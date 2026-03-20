export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Interior' | 'Exterior' | 'Condo' | 'Commercial';
  imageUrl: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface BookingDetails {
  propertyType: string;
  address: string;
  dateTime: string;
  name: string;
  email: string;
}
