import { useStore } from '../context/StoreContext';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';
import { formatPrice } from '../utils/formatPrice';

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useStore();

  if (!cart.length) {
    return (
      <EmptyState
        icon="🛍"
        title="Your bag is empty."
        text="Discover considered pieces designed to be worn on repeat."
        link="/new"
        label="Shop new arrivals"
      />
    );
  }

  const subtotal  = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const progress  = Math.min(100, (subtotal / 2999) * 100);
  const remaining = Math.max(0, 2999 - subtotal);

  return (
    <main className="page cart">
      <h1>
        Shopping bag
        <small>({cart.length} item{cart.length !== 1 ? 's' : ''})</small>
      </h1>

      {/* Free delivery progress */}
      <div className="free-delivery" role="status" aria-label="Free delivery progress">
        <span style={{ width: `${progress}%` }} />
        {subtotal >= 2999
          ? <span>🎉 You&apos;ve unlocked free delivery!</span>
          : `Add ${formatPrice(remaining)} more for free delivery.`}
      </div>

      <div className="cart-layout">
        {/* Cart items */}
        <section aria-label="Cart items">
          {cart.map((item, index) => (
            <article
              className="cart-item"
              key={`${item.id}-${item.size}-${item.color}-${index}`}
            >
              <img src={item.img} alt={item.name} loading="lazy" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p>{item.gender} / {item.category}</p>
                <h3>{item.name}</h3>
                <small>{item.color} · Size {item.size}</small>
                <strong>{formatPrice(item.price)}</strong>

                <div className="cart-item-actions">
                  <div className="quantity">
                    <button
                      onClick={() => updateQty(index, -1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <b aria-label={`Quantity: ${item.qty}`}>{item.qty}</b>
                    <button
                      onClick={() => updateQty(index, 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove"
                    onClick={() => removeFromCart(index)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Order summary */}
        <CartSummary cart={cart} />
      </div>
    </main>
  );
}
