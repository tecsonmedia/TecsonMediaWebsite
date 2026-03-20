import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

export function useVoiceAgent() {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startVoice = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const ctx = new AudioContext({ sampleRate: 16000 });
      setAudioContext(ctx);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            // Audio processing
            const source = ctx.createMediaStreamSource(stream);
            const processor = ctx.createScriptProcessor(4096, 1, 1);
            
            source.connect(processor);
            processor.connect(ctx.destination);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
              }
              const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({
                  audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
              const floatData = new Float32Array(audioData.length / 2);
              const view = new DataView(audioData.buffer);
              for (let i = 0; i < floatData.length; i++) {
                floatData[i] = view.getInt16(i * 2, true) / 0x7FFF;
              }
              
              const buffer = ctx.createBuffer(1, floatData.length, 16000);
              buffer.getChannelData(0).set(floatData);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start();
            }
            
            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
              setTranscript(prev => prev + " " + message.serverContent?.modelTurn?.parts?.[0]?.text);
            }
          },
          onclose: () => {
            stopVoice();
          },
          onerror: (err) => {
            console.error("Voice Error:", err);
            stopVoice();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are the Tecson Media Toronto AI assistant. You help users book real estate photography sessions. Be professional, friendly, and efficient. You can answer questions about pricing, services, and turnaround times. You can also guide users through the booking process.",
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error("Failed to start voice:", error);
      setIsConnecting(false);
    }
  };

  const stopVoice = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
    setIsActive(false);
    setIsConnecting(false);
  };

  return { isActive, isConnecting, transcript, startVoice, stopVoice };
}
