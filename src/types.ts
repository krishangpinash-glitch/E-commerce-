export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number; // percentage
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  image: string;
  images: string[];
  specs: Record<string, string>;
  stock: number;
  ecoScore: number; // 1-100 indicating green/sustainability
  carbonSaved: number; // in kg CO2
  isNewArrival?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  reviews?: Review[];
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Address {
  id: string;
  type: string; // Home, Work, etc
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  address: Address;
  paymentMethod: string;
  couponCode?: string;
  date: string;
  status: 'placed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered';
  invoicePath?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface PhoneNotification {
  id: string;
  title: string;
  body: string;
  app: string;
  time: string;
  read: boolean;
  image?: string;
}

export interface FileDocument {
  id: string;
  name: string;
  type: 'invoice' | 'document' | 'image';
  size: string;
  date: string;
  url: string;
  content?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  unlocked: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'active' | 'inactive';
  registerDate: string;
  purchaseCount: number;
  spent: number;
}

export interface Category {
  id: string;
  name: string;
  itemCount: number;
  icon: string;
  color: string;
}

export interface PhoneSettings {
  darkMode: boolean;
  airplaneMode: boolean;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  batterySaver: boolean;
  brightness: number; // 0-100
  volume: number; // 0-100
  wallpaper: string;
  language: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  rewardPoints: number;
  securityLock: 'swipe' | 'faceid' | 'fingerprint';
  highContrastMode: boolean;
  fontSizeScale: number; // 1 (normal), 1.1 (large), 1.25 (extra-large)
}
