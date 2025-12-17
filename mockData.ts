import { Product, Order, User, Worker, Fabric } from './types';

export const MOCK_FABRICS: Fabric[] = [
  { id: 'f1', name: 'Italian Merino Wool', pricePerMeter: 50, image: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&q=80&w=200' },
  { id: 'f2', name: 'Egyptian Cotton', pricePerMeter: 30, image: 'https://images.unsplash.com/photo-1596207390457-b08e7a070f6e?auto=format&fit=crop&q=80&w=200' },
  { id: 'f3', name: 'Linen Blend', pricePerMeter: 35, image: 'https://images.unsplash.com/photo-1579619176848-6927958a74cd?auto=format&fit=crop&q=80&w=200' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Bespoke Italian Suit',
    description: 'A masterpiece of tailoring. Fully canvassed, hand-finished buttonholes, and your choice of premium lining.',
    price: 450,
    category: 'Suits',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c47e356?auto=format&fit=crop&q=80&w=800',
    isCustomizable: true,
    fabrics: ['f1', 'f3']
  },
  {
    id: 'p2',
    name: 'Signature White Shirt',
    description: 'The foundation of every wardrobe. Crisp, breathable, and perfectly fitted.',
    price: 85,
    category: 'Shirts',
    image: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&q=80&w=800',
    isCustomizable: true,
    fabrics: ['f2']
  },
  {
    id: 'p3',
    name: 'Tailored Chinos',
    description: 'Versatile trousers that bridge the gap between formal and casual.',
    price: 65,
    category: 'Pants',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800',
    isCustomizable: true,
    fabrics: ['f2', 'f3']
  },
  {
    id: 'p4',
    name: 'Silk Jacquard Tie',
    description: 'Woven silk tie with a subtle geometric pattern.',
    price: 45,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&q=80&w=800',
    isCustomizable: false
  },
  {
    id: 'p5',
    name: 'Summer Linen Blazer',
    description: 'Unstructured and lightweight for effortless summer elegance.',
    price: 220,
    category: 'Blazers',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    isCustomizable: true,
    fabrics: ['f3']
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    customerId: 'u2',
    customerName: 'James Bond',
    items: [
      { productId: 'p1', productName: 'Bespoke Italian Suit', quantity: 1, price: 450, isCustom: true, measurements: { chest: 42, waist: 34 }, selectedFabric: 'Italian Merino Wool' }
    ],
    totalAmount: 450,
    advanceAmount: 200,
    dueAmount: 250,
    status: 'PROCESSING',
    workflowStage: 'SEWING',
    date: '2023-10-25',
    assignedWorkerId: 'w2'
  },
  {
    id: 'ORD-1002',
    customerId: 'u3',
    customerName: 'Alice Freeman',
    items: [
      { productId: 'p2', productName: 'Signature White Shirt', quantity: 2, price: 85, isCustom: false, selectedSize: 'M' }
    ],
    totalAmount: 170,
    advanceAmount: 170,
    dueAmount: 0,
    status: 'DELIVERED',
    date: '2023-10-20'
  }
];

export const MOCK_WORKERS: Worker[] = [
  { id: 'w1', name: 'Master Ahmed', role: 'CUTTER', activeOrders: 3, performanceRating: 4.8 },
  { id: 'w2', name: 'Sarah Stitch', role: 'TAILOR', activeOrders: 5, performanceRating: 4.9 },
  { id: 'w3', name: 'Mike Finish', role: 'FINISHER', activeOrders: 2, performanceRating: 4.5 },
];
