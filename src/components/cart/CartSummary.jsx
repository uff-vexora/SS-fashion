import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';

export default function CartSummary({ cart }) {
  const subtotal  = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount  = cart.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.qty, 0);
  const delivery  = subtotal >= 2999 ? 0 : 149;
  const total     = subtotal + delivery;

  return (
    <aside className="cart-summary">
      <h2>Order summary</h2>

      <div>
        <span>Subtotal</span>
        <b>{formatPrice(subtotal)}</b>
      </div>

      {discount > 0 && (
        <div>
          <span>Product discount</span>
          <b className="green">− {formatPrice(discount)}</b>
        </div>
      )}

      <div>
        <span>Delivery</span>
        <b style={!delivery ? { color: 'var(--green)', fontWeight: 700 } : {}}>
          {delivery ? formatPrice(delivery) : 'Free 🎉'}
        </b>
      </div>

      {!delivery && subtotal > 0 && (
        <div style={{ fontSize: 10, color: 'var(--green)', marginTop: -8 }}>
          <span>You saved ₹149 on delivery</span>
        </div>
      )}

      <div className="total">
        <span>Total</span>
        <strong>{formatPrice(total)}</strong>
      </div>

      <p>Inclusive of all taxes &amp; duties</p>

      <Link to="/checkout" className="button" style={{ display: 'block', textAlign: 'center' }}>
        Proceed to checkout →
      </Link>

      {/* Trust signals */}
      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['🔒 Secure checkout', '14-day returns', 'COD available'].map((t) => (
          <span key={t} style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--mono)', letterSpacing: '.04em', background: 'rgba(0,0,0,.04)', padding: '3px 7px', borderRadius: '999px' }}>
            {t}
          </span>
        ))}
      </div>
    </aside>
  );
}
