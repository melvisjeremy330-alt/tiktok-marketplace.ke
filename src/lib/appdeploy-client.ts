// Mock replacement for @appdeploy/client for local and AI Studio environment

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
}

const STORAGE_KEYS = {
  USER: 'tm-auth-user',
  CART: 'tm-cart-items',
  WISHLIST: 'tm-wishlist-items',
  ORDERS: 'tm-orders-data',
  SHOPS: 'tm-shops-data',
  SELLER_PRODUCTS: 'tm-seller-products',
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

export const auth = {
  isSignedIn(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.USER);
  },

  async getUser(): Promise<AuthUser | null> {
    return getStorage<AuthUser | null>(STORAGE_KEYS.USER, null);
  },

  async signIn(_opts?: { scope?: string }): Promise<{ user: AuthUser }> {
    const existing = getStorage<AuthUser | null>(STORAGE_KEYS.USER, null);
    if (existing) {
      return { user: existing };
    }
    const role = localStorage.getItem('tm-account-role') || 'Customer';
    const defaultName = role === 'Creator' ? 'Jeremy Creator' : role === 'Business' ? 'Jeremy Business' : 'Jeremy Shopper';
    const newUser: AuthUser = {
      userId: 'usr_' + Math.random().toString(36).slice(2, 9),
      name: defaultName,
      email: 'jeremy@marketplace.ke',
    };
    setStorage(STORAGE_KEYS.USER, newUser);
    return { user: newUser };
  },

  async signOut(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};

const initialProducts = [
  {
    id: 1,
    name: 'iPhone 11 64GB',
    price: 30000,
    old: 34000,
    shop: 'iPhone Place Kenya',
    category: 'Phones',
    rating: 4.8,
    reviews: 127,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=85',
    commission: 10,
    stock: 8,
    description: 'Tested iPhone 11 64GB from a verified Kenyan technology seller. Seller inspection and dispatch details are shown before checkout.',
    badge: 'Hot Deal',
  },
  {
    id: 2,
    name: 'Samsung Galaxy A55 5G',
    price: 35999,
    old: 39999,
    shop: 'Tech Hub Kenya',
    category: 'Phones',
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=85',
    commission: 8,
    stock: 12,
    description: 'Modern 5G smartphone with a bright display, capable cameras and all-day battery performance.',
    badge: 'Top Rated',
  },
  {
    id: 3,
    name: 'Premium Running Sneakers',
    price: 2500,
    old: 3500,
    shop: 'Urban Kicks KE',
    category: 'Fashion',
    rating: 4.6,
    reviews: 214,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
    commission: 12,
    stock: 31,
    description: 'Comfort-focused everyday running sneakers with a lightweight sole and durable upper.',
    badge: 'Flash Sale',
  },
  {
    id: 4,
    name: 'Wireless ANC Headphones',
    price: 4200,
    old: 5500,
    shop: 'Sound House',
    category: 'Electronics',
    rating: 4.9,
    reviews: 74,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    commission: 10,
    stock: 16,
    description: 'Wireless over-ear headphones with active noise cancellation, comfortable cushions and long battery life.',
    badge: 'Best Seller',
  },
  {
    id: 5,
    name: 'Smart Watch Series 9',
    price: 4800,
    old: 6500,
    shop: 'Gadget World KE',
    category: 'Electronics',
    rating: 4.5,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
    commission: 15,
    stock: 22,
    description: 'Everyday smartwatch for notifications, activity tracking and quick access to essential tools.',
    badge: 'Creator Pick',
  },
  {
    id: 6,
    name: 'Oversized Cotton Hoodie',
    price: 2200,
    old: 2800,
    shop: 'Nairobi Streetwear',
    category: 'Fashion',
    rating: 4.8,
    reviews: 61,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
    commission: 14,
    stock: 44,
    description: 'Soft heavyweight cotton hoodie with a relaxed oversized fit for everyday streetwear.',
    badge: 'Trending',
  },
  {
    id: 7,
    name: 'Portable Power Bank 20,000mAh',
    price: 2800,
    old: 3500,
    shop: 'Tech Hub Kenya',
    category: 'Electronics',
    rating: 4.7,
    reviews: 118,
    image: 'https://images.unsplash.com/photo-1609592424811-2d2a3d9c0c3d?auto=format&fit=crop&w=900&q=85',
    commission: 9,
    stock: 27,
    description: 'High-capacity portable power bank designed for daily charging on the move.',
    badge: 'Value Pick',
  },
  {
    id: 8,
    name: 'Air Fryer 5L',
    price: 7200,
    old: 8500,
    shop: 'HomePlus Kenya',
    category: 'Home',
    rating: 4.6,
    reviews: 48,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=85',
    commission: 11,
    stock: 9,
    description: '5-litre air fryer for convenient low-oil cooking, with simple controls and an easy-clean basket.',
    badge: 'Home Pick',
  },
];

export const api = {
  async get(path: string): Promise<{ data: any }> {
    const cleanPath = path.split('?')[0];

    if (cleanPath === '/api/products') {
      return { data: { products: initialProducts } };
    }
    if (cleanPath === '/api/cart') {
      const items = getStorage<Array<{ productId: string; quantity: number }>>(STORAGE_KEYS.CART, []);
      return { data: { items } };
    }
    if (cleanPath === '/api/wishlist') {
      const items = getStorage<Array<{ productId: string }>>(STORAGE_KEYS.WISHLIST, []);
      return { data: { items } };
    }
    if (cleanPath === '/api/orders') {
      const orders = getStorage<any[]>(STORAGE_KEYS.ORDERS, []);
      return { data: { orders } };
    }
    if (cleanPath === '/api/shops') {
      const shops = getStorage<any[]>(STORAGE_KEYS.SHOPS, []);
      return { data: { shops } };
    }
    if (cleanPath === '/api/my-shop') {
      const shop = getStorage<any>(STORAGE_KEYS.SHOPS + '_mine', null);
      return { data: { shop } };
    }
    if (cleanPath === '/api/my-shop/products') {
      const products = getStorage<any[]>(STORAGE_KEYS.SELLER_PRODUCTS, []);
      return { data: { products } };
    }
    if (cleanPath === '/api/payment/config') {
      return { data: { livePaymentsEnabled: false, methods: ['M-Pesa', 'Card'], currency: 'KES' } };
    }
    return { data: {} };
  },

  async put(path: string, body?: any): Promise<{ data: any }> {
    const cleanPath = path.split('?')[0];

    if (cleanPath === '/api/cart') {
      const items = body?.items || [];
      setStorage(STORAGE_KEYS.CART, items);
      return { data: { saved: true, items } };
    }
    if (cleanPath === '/api/wishlist') {
      const productIds = body?.productIds || [];
      const items = productIds.map((id: string) => ({ productId: String(id) }));
      setStorage(STORAGE_KEYS.WISHLIST, items);
      return { data: { saved: true, productIds } };
    }
    return { data: { saved: true } };
  },

  async post(path: string, body?: any): Promise<{ data: any }> {
    const cleanPath = path.split('?')[0];

    if (cleanPath === '/api/orders') {
      const orders = getStorage<any[]>(STORAGE_KEYS.ORDERS, []);
      const newOrder = {
        id: `TM-${Date.now().toString().slice(-6)}`,
        product: body?.items?.length === 1 ? 'Single item order' : `${body?.items?.length || 1} items`,
        total: body?.total || 0,
        status: 'Payment confirmed',
        tracking: `TKM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        sellers: body?.sellers || ['Verified Kenya Shop'],
        address: body?.address || '',
        createdAt: new Date().toISOString(),
      };
      const updated = [newOrder, ...orders];
      setStorage(STORAGE_KEYS.ORDERS, updated);
      // Clear cart
      setStorage(STORAGE_KEYS.CART, []);
      return { data: { order: newOrder } };
    }
    if (cleanPath === '/api/shops') {
      const shop = {
        id: 'shp_' + Date.now(),
        name: body?.name || 'My Shop',
        location: body?.location || 'Nairobi, Kenya',
        category: body?.category || 'General',
        status: 'verified',
      };
      setStorage(STORAGE_KEYS.SHOPS + '_mine', shop);
      return { data: { shop } };
    }
    if (cleanPath === '/api/my-shop/products') {
      const products = getStorage<any[]>(STORAGE_KEYS.SELLER_PRODUCTS, []);
      const newProd = {
        id: 'prod_' + Date.now(),
        ...body,
        status: 'draft',
      };
      setStorage(STORAGE_KEYS.SELLER_PRODUCTS, [...products, newProd]);
      return { data: { product: newProd } };
    }
    if (cleanPath === '/api/payment/test') {
      return {
        data: {
          transaction: {
            id: `TX-${Date.now()}`,
            orderId: body?.orderId,
            amount: body?.amount,
            currency: 'KES',
            method: body?.method,
            status: 'verified',
            createdAt: new Date().toISOString(),
          },
        },
      };
    }
    if (cleanPath === '/api/protection/confirm') {
      return { data: { orderId: body?.orderId, status: 'protection_period', payout: 'pending' } };
    }
    if (cleanPath === '/api/protection/dispute') {
      return {
        data: {
          dispute: {
            id: `DSP-${Date.now()}`,
            orderId: body?.orderId,
            reason: body?.reason,
            status: 'open',
            payout: 'hold',
          },
        },
      };
    }
    if (cleanPath === '/api/protection/resolve') {
      return {
        data: {
          dispute: {
            id: body?.disputeId,
            status: body?.resolution === 'refund' ? 'resolved_refund' : 'resolved_release',
            payout: body?.resolution === 'refund' ? 'hold' : 'released',
          },
        },
      };
    }
    return { data: {} };
  },
};
