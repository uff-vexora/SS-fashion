import { createContext, useContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useLocalStorage('ss-cart', []);
  const [wish, setWish] = useLocalStorage('ss-wish', []);
  const [orders, setOrders] = useLocalStorage('ss-orders', []);
  const [toast, setToast] = useState('');

  // ── Toast notification ─────────────────────────────────────
  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  // ── Cart actions ───────────────────────────────────────────
  function addToCart(product, size = product.sizes[0], color = product.colors[0]) {
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
    const order = {
      id: `SSF-${Date.now()}`,
      items: cartItems,
      address,
      date: new Date().toISOString(),
      status: 'confirmed',
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    notify('Order placed successfully ✓');
    return order;
  }

  // ── Context value ──────────────────────────────────────────
  const value = {
    cart, setCart,
    wish, orders,
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
