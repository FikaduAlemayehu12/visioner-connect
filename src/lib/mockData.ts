export interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  distance?: string;
  image: string;
  category: string;
  type: 'sell' | 'buy' | 'service-offer' | 'service-need';
  rating: number;
  sellerName: string;
  sellerVerified: boolean;
  isUrgent?: boolean;
  isFeatured?: boolean;
  negotiable?: boolean;
  createdAt: string;
  views: number;
}

export const categories = [
  { id: '1', name: 'Electronics', icon: '📱', count: 234 },
  { id: '2', name: 'Vehicles', icon: '🚗', count: 189 },
  { id: '3', name: 'Real Estate', icon: '🏠', count: 156 },
  { id: '4', name: 'Fashion', icon: '👗', count: 312 },
  { id: '5', name: 'Home & Garden', icon: '🪴', count: 98 },
  { id: '6', name: 'Services', icon: '🔧', count: 145 },
  { id: '7', name: 'Jobs', icon: '💼', count: 67 },
  { id: '8', name: 'Sports', icon: '⚽', count: 43 },
];

export const listings: Listing[] = [
  {
    id: '1',
    title: 'Samsung Galaxy S24 Ultra - Like New',
    price: 85000,
    currency: 'ETB',
    location: 'Bole, Addis Ababa',
    distance: '2.3 km',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop',
    category: 'Electronics',
    type: 'sell',
    rating: 4.8,
    sellerName: 'Abebe T.',
    sellerVerified: true,
    negotiable: true,
    createdAt: '2 hours ago',
    views: 45,
  },
  {
    id: '2',
    title: 'Toyota Vitz 2019 - Excellent Condition',
    price: 1850000,
    currency: 'ETB',
    location: 'Kazanchis, Addis Ababa',
    distance: '4.1 km',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400&h=300&fit=crop',
    category: 'Vehicles',
    type: 'sell',
    rating: 4.5,
    sellerName: 'Dawit M.',
    sellerVerified: true,
    createdAt: '5 hours ago',
    views: 120,
  },
  {
    id: '3',
    title: '2 Bedroom Apartment for Rent',
    price: 25000,
    currency: 'ETB',
    location: 'CMC, Addis Ababa',
    distance: '7.8 km',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    category: 'Real Estate',
    type: 'sell',
    rating: 4.2,
    sellerName: 'Sara K.',
    sellerVerified: false,
    createdAt: '1 day ago',
    views: 89,
  },
  {
    id: '4',
    title: 'Professional Photography Services',
    price: 5000,
    currency: 'ETB',
    location: 'Piazza, Addis Ababa',
    distance: '3.5 km',
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=300&fit=crop',
    category: 'Services',
    type: 'service-offer',
    rating: 4.9,
    sellerName: 'Yonas A.',
    sellerVerified: true,
    isFeatured: true,
    createdAt: '3 hours ago',
    views: 67,
  },
  {
    id: '5',
    title: 'MacBook Pro M2 - 512GB',
    price: 120000,
    currency: 'ETB',
    location: 'Bole, Addis Ababa',
    distance: '1.8 km',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    category: 'Electronics',
    type: 'sell',
    rating: 4.7,
    sellerName: 'Hana G.',
    sellerVerified: true,
    isUrgent: true,
    negotiable: true,
    createdAt: '30 min ago',
    views: 23,
  },
  {
    id: '6',
    title: 'Looking for Used Furniture Set',
    price: 15000,
    currency: 'ETB',
    location: 'Megenagna, Addis Ababa',
    distance: '5.2 km',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    category: 'Home & Garden',
    type: 'buy',
    rating: 3.8,
    sellerName: 'Kidist B.',
    sellerVerified: false,
    createdAt: '6 hours ago',
    views: 34,
  },
  {
    id: '7',
    title: 'Nike Air Max - Size 42 (New)',
    price: 8500,
    currency: 'ETB',
    location: 'Mexico, Addis Ababa',
    distance: '3.0 km',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    category: 'Fashion',
    type: 'sell',
    rating: 4.4,
    sellerName: 'Meron T.',
    sellerVerified: true,
    createdAt: '1 day ago',
    views: 56,
  },
  {
    id: '8',
    title: 'Web Development Services',
    price: 0,
    currency: 'ETB',
    location: 'Bole, Addis Ababa',
    distance: '2.0 km',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    category: 'Services',
    type: 'service-offer',
    rating: 5.0,
    sellerName: 'Samuel D.',
    sellerVerified: true,
    createdAt: '4 hours ago',
    views: 41,
  },
  {
    id: '9',
    title: 'Bajaj Three-Wheeler 2022',
    price: 450000,
    currency: 'ETB',
    location: 'Bishoftu',
    distance: '45 km',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop',
    category: 'Vehicles',
    type: 'sell',
    rating: 4.1,
    sellerName: 'Tesfaye H.',
    sellerVerified: false,
    negotiable: true,
    createdAt: '2 days ago',
    views: 198,
  },
];

export const formatETB = (price: number): string => {
  if (price === 0) return 'Contact for price';
  return `ETB ${price.toLocaleString()}`;
};
