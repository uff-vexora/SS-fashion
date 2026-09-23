import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';

export default function Checkout() {
  const { cart, placeOrder } = useStore();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('upi');
  const [loading, setLoading] = useState(false);

  if (!cart.length && !placed) {
    return (
      <EmptyState
        icon="📦"
        title="Nothing to check out yet."
        text="Add something to your bag first, then come back here."
        link="/new"
        label="Shop collection"
      />
    );
  }

  if (placed) {
    return (
      <main className="page confirmation">
        <div className="empty-icon" aria-hidden="true">🎉</div>
        <p className="eyebrow">ORDER CONFIRMED</p>
        <h1>Thank you for choosing SS Fashion.</h1>
        <p>
          Order <strong>{orderId}</strong> is confirmed and being prepared with
          care. Check your email for details and tracking information.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="button" to="/delivery">Track your order</Link>
          <Link className="button ghost" to="/new">Continue shopping</Link>
        </div>
      </main>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay for UX polish
    setTimeout(() => {
      const fd = new FormData(e.target);
      const address = {
        name:    fd.get('name'),
        phone:   fd.get('phone'),
        email:   fd.get('email'),
        pincode: fd.get('pincode'),
        address: fd.get('address'),
        city:    fd.get('city'),
        state:   fd.get('state'),
      };
      const order = placeOrder(cart, address);
      setOrderId(order.id);
      setLoading(false);
      setPlaced(true);
    }, 900);
  }

  return (
    <main className="page checkout">
      <h1>Checkout</h1>

      <div className="checkout-grid">
        <form onSubmit={handleSubmit} noValidate>
          {/* Delivery address */}
          <section>
            <h2>Delivery address</h2>
            <div className="form-grid">
              <input name="name"    required placeholder="Full name" autoComplete="name" />
              <input name="phone"   required placeholder="Phone number" type="tel" inputMode="numeric" autoComplete="tel" />
              <input name="email"   required placeholder="Email address" type="email" autoComplete="email" />
              <input name="pincode" required placeholder="Pincode" maxLength={6} inputMode="numeric" />
              <input name="address" required placeholder="Address line 1 & 2" className="full" autoComplete="street-address" />
              <input name="city"    placeholder="City" autoComplete="address-level2" />
              <input name="state"   placeholder="State" autoComplete="address-level1" />
            </div>
          </section>

          {/* Delivery method */}
          <section>
            <h2>Delivery method</h2>
            <label className="option">
              <input type="radio" name="delivery" value="standard" checked={delivery === 'standard'} onChange={() => setDelivery('standard')} />
              Standard delivery
              <span>3–5 days · Free above ₹2,999</span>
            </label>
            <label className="option">
              <input type="radio" name="delivery" value="express" checked={delivery === 'express'} onChange={() => setDelivery('express')} />
              Express delivery
              <span>1–2 days · ₹199</span>
            </label>
          </section>

          {/* Payment */}
          <section>
            <h2>Payment</h2>
            {[
              ['upi',  'UPI (GPay, PhonePe, Paytm)'],
              ['card', 'Credit / Debit card'],
              ['emi',  'EMI — 3, 6 or 12 months'],
              ['cod',  'Cash on delivery'],
            ].map(([val, label]) => (
              <label className="option" key={val}>
                <input type="radio" name="payment" value={val} checked={payment === val} onChange={() => setPayment(val)} />
                {label}
              </label>
            ))}

            {payment === 'card' && (
              <div className="form-grid" style={{ marginTop: 12 }}>
                <input placeholder="Card number" className="full" maxLength={19} inputMode="numeric" autoComplete="cc-number" />
                <input placeholder="MM / YY" maxLength={7} autoComplete="cc-exp" />
                <input placeholder="CVV" maxLength={4} inputMode="numeric" type="password" autoComplete="cc-csc" />
                <input placeholder="Name on card" className="full" autoComplete="cc-name" />
              </div>
            )}
          </section>

          <button
            className="button"
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              textAlign: 'center',
              opacity: loading ? .7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity var(--t-fast)',
            }}
          >
            {loading ? '⟳ Placing order…' : 'Place order'}
          </button>

          <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 12, textAlign: 'center', lineHeight: 1.6 }}>
            🔒 By placing your order, you agree to our{' '}
            <Link to="/support" style={{ textDecoration: 'underline' }}>Terms of Service</Link>
            {' '}and{' '}
            <Link to="/support" style={{ textDecoration: 'underline' }}>Privacy Policy</Link>.
          </p>
        </form>

        <CartSummary cart={cart} />
      </div>
    </main>
  );
}
