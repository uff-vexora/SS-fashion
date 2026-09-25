import { createContext, useContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const StoreContext = createContext(null);

export const DEMO_USERS = {
  vip: {
    id: 'usr_anya',
    name: 'Anya Roy',
    email: 'anya.roy@atelier.in',
    phone: '+91 98201 44520',
    tier: 'Atelier Noir Elite',
    tierBadge: '✦ NOIR VIP',
    points: 2450,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    joinedDate: 'October 2025',
    styleDNA: {
      archetype: 'Quiet Luxury Minimalist',
      confidenceScore: 98,
      palette: ['Ivory', 'Espresso', 'Charcoal', 'Oat'],
      preferredSize: 'M',
      fitPreference: 'Fluid / Tailored Relaxed',
      recommendationNote: 'Prefers monochromatic palettes and natural breathable fibers like linen and long-staple cotton.'
    },
    savedAddresses: [
      {
        id: 'addr_1',
        isDefault: true,
        label: 'Home Atelier',
        name: 'Anya Roy',
        phone: '+91 98201 44520',
        address: 'Flat 402, Signature Palms, Indiranagar 100ft Rd',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038'
      },
      {
        id: 'addr_2',
        isDefault: false,
        label: 'Studio',
        name: 'Anya Roy',
        phone: '+91 98201 44520',
        address: '7th Floor, Design Quarter, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050'
      }
    ]
  },
  casual: {
    id: 'usr_karan',
    name: 'Karan Sharma',
    email: 'karan.sharma@atelier.in',
    phone: '+91 98710 33890',
    tier: 'Gold Connoisseur',
    tierBadge: '★ GOLD MEMBER',
    points: 1280,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    joinedDate: 'January 2026',
    styleDNA: {
      archetype: 'Contemporary Sartorial Casual',
      confidenceScore: 94,
      palette: ['Sage', 'Stone', 'Navy', 'Olive'],
      preferredSize: 'L',
      fitPreference: 'Relaxed Overshirt & Structured Trouser',
      recommendationNote: 'Enjoys textured resort polos and utilitarian outerwear with subtle architectural silhouettes.'
    },
    savedAddresses: [
      {
        id: 'addr_k1',
        isDefault: true,
        label: 'Residence',
        name: 'Karan Sharma',
        phone: '+91 98710 33890',
        address: 'B-12, Defence Colony, Ring Road',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110024'
      }
    ]
  }
};

const DEFAULT_SAMPLE_ORDERS = [
  {
    id: 'SSF-892401',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: 'In Transit',
    trackingStep: 3,
    estimatedDelivery: 'Tomorrow, by 6 PM',
    items: [
      {
        id: 'w1',
        name: 'Linen Column Dress',
        category: 'Dresses',
        price: 2699,
        size: 'S',
        color: 'Clay',
        qty: 1,
        img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85'
      },
      {
        id: 'w2',
        name: 'Sculpted Rib Tank',
        category: 'Tops',
        price: 999,
        size: 'M',
        color: 'Ecru',
        qty: 1,
        img: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85'
      }
    ],
    address: {
      name: 'Anya Roy',
      phone: '+91 98201 44520',
      address: 'Flat 402, Signature Palms, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    total: 3698
  },
  {
    id: 'SSF-761209',
    date: new Date(Date.now() - 14 * 86400000).toISOString(),
    status: 'Delivered',
    trackingStep: 4,
    estimatedDelivery: 'Delivered on 12 Sep 2026',
    items: [
      {
        id: 'm1',
        name: 'Relaxed Oxford Shirt',
        category: 'Shirts',
        price: 1499,
        size: 'M',
        color: 'Ivory',
        qty: 1,
        img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=85'
      }
    ],
    address: {
      name: 'Anya Roy',
      phone: '+91 98201 44520',
      address: 'Flat 402, Signature Palms, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    total: 1499
  }
];

export function StoreProvider({ children }) {
  const [cart, setCart] = useLocalStorage('ss-cart', []);
  const [wish, setWish] = useLocalStorage('ss-wish', []);
  const [orders, setOrders] = useLocalStorage('ss-orders', DEFAULT_SAMPLE_ORDERS);
  const [user, setUser] = useLocalStorage('ss-user', null);
  const [toast, setToast] = useState('');

  // ── Toast notification ─────────────────────────────────────
  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  // ── Cart actions ───────────────────────────────────────────
  function addToCart(product, size = product.sizes?.[0] || 'M', color = product.colors?.[0] || 'Default') {
    setCart((items) => {
      const existing = items.find(
        (item) => item.id === product.id && item.size === size && item.color === color
      );
      if (existing) {
        return items.map((item) =>
          item === existing ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...items, { ...product, size, color, qty: 1 }];
    });
    notify('Added to your bag ✓');
  }

  function removeFromCart(index) {
    setCart((items) => items.filter((_, i) => i !== index));
    notify('Item removed');
  }

  function updateQty(index, change) {
    setCart((items) =>
      items.map((item, i) =>
        i === index ? { ...item, qty: Math.max(1, item.qty + change) } : item
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  // ── Wishlist actions ───────────────────────────────────────
  function toggleWishlist(id) {
    const isSaved = wish.includes(id);
    setWish((items) =>
      isSaved ? items.filter((item) => item !== id) : [...items, id]
    );
    notify(isSaved ? 'Removed from wishlist' : 'Saved to wishlist ♥');
  }

  // ── Order actions ──────────────────────────────────────────
  function placeOrder(cartItems, address) {
    const orderTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const order = {
      id: `SSF-${Math.floor(100000 + Math.random() * 900000)}`,
      items: cartItems,
      address,
      date: new Date().toISOString(),
      status: 'Confirmed',
      trackingStep: 1,
      estimatedDelivery: 'Arrives in 3–4 business days',
      total: orderTotal,
      userId: user?.id || null,
    };
    setOrders((prev) => [order, ...prev]);

    // Award style points if user is logged in
    if (user) {
      const pointsEarned = Math.round(orderTotal * 0.1);
      setUser((prev) => ({
        ...prev,
        points: (prev.points || 0) + pointsEarned,
      }));
    }

    clearCart();
    notify('Order placed successfully ✓');
    return order;
  }

  // ── Authentication & Profile Actions ───────────────────────
  function login(email, password) {
    // Check if email matches demo accounts
    if (email.toLowerCase().includes('karan')) {
      setUser(DEMO_USERS.casual);
      notify(`Welcome back, ${DEMO_USERS.casual.name} ✦`);
      return { success: true, user: DEMO_USERS.casual };
    }
    if (email.toLowerCase().includes('anya') || email.toLowerCase().includes('vip')) {
      setUser(DEMO_USERS.vip);
      notify(`Welcome back, ${DEMO_USERS.vip.name} ✦`);
      return { success: true, user: DEMO_USERS.vip };
    }

    // Custom user login
    const derivedName = email.split('@')[0].replace(/[._]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const customUser = {
      id: `usr_${Date.now()}`,
      name: derivedName || 'Atelier Patron',
      email,
      phone: '+91 98000 12345',
      tier: 'Atelier Member',
      tierBadge: '✦ MEMBER',
      points: 250,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(derivedName || 'SS')}`,
      joinedDate: 'September 2026',
      styleDNA: {
        archetype: 'Modern Contemporary',
        confidenceScore: 92,
        palette: ['Ivory', 'Stone', 'Charcoal'],
        preferredSize: 'M',
        fitPreference: 'Relaxed Fit',
        recommendationNote: 'Personalized styling algorithm calibrated to contemporary wardrobe essentials.'
      },
      savedAddresses: [
        {
          id: 'addr_new_1',
          isDefault: true,
          label: 'Default Address',
          name: derivedName,
          phone: '+91 98000 12345',
          address: '24, Lotus Promenade, Green Avenue',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        }
      ]
    };

    setUser(customUser);
    notify(`Welcome to SS Fashion, ${customUser.name} ✦`);
    return { success: true, user: customUser };
  }

  function quickLogin(type = 'vip') {
    const selected = type === 'casual' ? DEMO_USERS.casual : DEMO_USERS.vip;
    setUser(selected);
    notify(`Signed in as ${selected.name} (${selected.tier}) ✦`);
    return selected;
  }

  function signup({ name, email, phone = '', archetype = 'Modern Minimalist', preferredSize = 'M' }) {
    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim() || 'Atelier Patron',
      email: email.trim(),
      phone: phone.trim() || '+91 98111 22334',
      tier: 'Atelier Member',
      tierBadge: '✦ MEMBER',
      points: 500, // Welcome bonus points
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'SS')}`,
      joinedDate: 'September 2026',
      styleDNA: {
        archetype,
        confidenceScore: 95,
        palette: ['Ivory', 'Charcoal', 'Earth Tones'],
        preferredSize,
        fitPreference: 'Relaxed Clean Drape',
        recommendationNote: 'Welcome to SS Fashion Atelier. 500 Style Points credited to your account.'
      },
      savedAddresses: [
        {
          id: `addr_${Date.now()}`,
          isDefault: true,
          label: 'Primary Delivery',
          name,
          phone: phone || '+91 98111 22334',
          address: 'Flat 12B, Skyview Residences',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001'
        }
      ]
    };

    setUser(newUser);
    notify(`Account created! 500 Welcome Points awarded ✦`);
    return { success: true, user: newUser };
  }

  function logout() {
    setUser(null);
    notify('Signed out of Atelier session');
  }

  function updateProfile(updates) {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      return updated;
    });
    notify('Profile updated successfully ✓');
  }

  function addSavedAddress(address) {
    setUser((prev) => {
      if (!prev) return prev;
      const newAddr = {
        ...address,
        id: `addr_${Date.now()}`,
        isDefault: prev.savedAddresses?.length === 0,
      };
      return {
        ...prev,
        savedAddresses: [...(prev.savedAddresses || []), newAddr],
      };
    });
    notify('Address saved ✓');
  }

  // ── Context value ──────────────────────────────────────────
  const value = {
    cart, setCart,
    wish, orders,
    user,
    login,
    quickLogin,
    signup,
    logout,
    updateProfile,
    addSavedAddress,
    addToCart, removeFromCart, updateQty, clearCart,
    toggleWishlist,
    placeOrder,
    notify,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toast && (
        <div className="toast" role="status" aria-live="polite" aria-atomic="true">
          {toast}
        </div>
      )}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
