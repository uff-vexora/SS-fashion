import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';

export default function Checkout() {
  const { cart, placeOrder, user, notify } = useStore();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('upi');
  const [loading, setLoading] = useState(false);

  // Default address from user if available
  const defaultAddr = user?.savedAddresses?.find((a) => a.isDefault) || user?.savedAddresses?.[0];
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || defaultAddr?.phone || '',
    email: user?.email || '',
    pincode: defaultAddr?.pincode || '',
    address: defaultAddr?.address || '',
    city: defaultAddr?.city || '',
    state: defaultAddr?.state || '',
  });

  function autofillUser() {
    if (!user) return;
    setFormData({
      name: user.name || '',
      phone: user.phone || defaultAddr?.phone || '',
      email: user.email || '',
      pincode: defaultAddr?.pincode || '560038',
      address: defaultAddr?.address || 'Flat 402, Signature Palms, Indiranagar',
      city: defaultAddr?.city || 'Bengaluru',
      state: defaultAddr?.state || 'Karnataka',
    });
    notify('Autofilled with Atelier Profile ✓');
  }

  function handleFieldChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

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
      <main className="page confirmation ai-ambient-bg">
        <div className="ai-orb ai-orb-1" aria-hidden="true" />
        <div className="empty-icon" aria-hidden="true">🎉</div>
        <p className="eyebrow">ORDER CONFIRMED</p>
        <h1 className="ai-gradient-text">Thank you for choosing SS Fashion.</h1>
        <p>
          Order <strong>{orderId}</strong> is confirmed and being prepared with
          care. Check your email for details and tracking information.
        </p>
        {user && (
          <div className="ai-badge luminous" style={{ margin: '14px 0 24px', padding: '6px 14px' }}>
            <span className="dot" /> ✦ Style Points added to your Atelier Membership
          </div>
        )}
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

    setTimeout(() => {
      const order = placeOrder(cart, formData);
      setOrderId(order.id);
      setLoading(false);
      setPlaced(true);
    }, 900);
  }

  return (
    <main className="page checkout ai-ambient-bg">
      <div className="ai-orb ai-orb-1" aria-hidden="true" />
      <h1>Checkout</h1>

      {/* Member status banner */}
      <div style={{
        background: user ? 'rgba(255,255,255,0.85)' : 'var(--paper)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-lg)',
        padding: '14px 20px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="ai-badge luminous">
            <span className="dot" /> {user ? user.tierBadge : 'ATELIER GUEST'}
          </span>
          <span style={{ fontSize: 13, color: 'var(--ink)' }}>
            {user ? (
              <>Authenticated as <strong>{user.name}</strong> · Profile details synced</>
            ) : (
              <>Have an Atelier account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Sign in</Link> for 1-click checkout.</>
            )}
          </span>
        </div>

        {user && (
          <button
            type="button"
            onClick={autofillUser}
            className="ai-badge"
            style={{ cursor: 'pointer', background: '#fff' }}
          >
            ✦ Reset to Saved Address
          </button>
        )}
      </div>

      <div className="checkout-grid">
        <form onSubmit={handleSubmit} noValidate>
          {/* Delivery address */}
          <section>
            <h2>Delivery address</h2>
            <div className="form-grid">
              <input name="name"    required placeholder="Full name" autoComplete="name" value={formData.name} onChange={handleFieldChange} />
              <input name="phone"   required placeholder="Phone number" type="tel" inputMode="numeric" autoComplete="tel" value={formData.phone} onChange={handleFieldChange} />
              <input name="email"   required placeholder="Email address" type="email" autoComplete="email" value={formData.email} onChange={handleFieldChange} />
              <input name="pincode" required placeholder="Pincode" maxLength={6} inputMode="numeric" value={formData.pincode} onChange={handleFieldChange} />
              <input name="address" required placeholder="Address line 1 & 2" className="full" autoComplete="street-address" value={formData.address} onChange={handleFieldChange} />
              <input name="city"    placeholder="City" autoComplete="address-level2" value={formData.city} onChange={handleFieldChange} />
              <input name="state"   placeholder="State" autoComplete="address-level1" value={formData.state} onChange={handleFieldChange} />
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
