import { useState } from 'react';
import { Link } from 'react-router-dom';

const TRACKING_STEPS = [
  { label: 'Order placed', detail: 'Your order has been confirmed.', date: 'Mon, 22 Sep 2026' },
  { label: 'Processing', detail: 'Your items are being carefully prepared.', date: 'Mon, 22 Sep 2026' },
  { label: 'Shipped', detail: 'Your parcel is on its way.', date: 'Tue, 23 Sep 2026' },
  { label: 'Out for delivery', detail: 'Your parcel is with the delivery partner.', date: 'Expected today' },
  { label: 'Delivered', detail: '', date: '' },
];

const ACTIVE_STEP = 3; // 0-indexed — "Out for delivery"

export default function Delivery() {
  const [orderNum, setOrderNum] = useState('');
  const [tracked, setTracked] = useState(false);
  const [email, setEmail] = useState('');

  function handleTrack(e) {
    e.preventDefault();
    if (orderNum.trim()) setTracked(true);
  }

  return (
    <main className="page delivery">
      <p className="eyebrow">ORDER TRACKING</p>
      <h1>Track your order</h1>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 32 }}>
        Enter your order number and email to see real-time delivery updates.
      </p>

      {/* Track form */}
      {!tracked ? (
        <form onSubmit={handleTrack} style={{ display: 'grid', gap: 10, maxWidth: 480, marginBottom: 40 }}>
          <input
            required
            value={orderNum}
            onChange={(e) => setOrderNum(e.target.value)}
            placeholder="Order number (e.g. ATL-20240923)"
            style={{
              padding: '13px 11px',
              border: '1px solid var(--line)',
              background: 'transparent',
              fontSize: 12,
              outline: 0,
              width: '100%',
            }}
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            style={{
              padding: '13px 11px',
              border: '1px solid var(--line)',
              background: 'transparent',
              fontSize: 12,
              outline: 0,
              width: '100%',
            }}
          />
          <button className="button" type="submit">Track order</button>
        </form>
      ) : (
        <button
          onClick={() => { setTracked(false); setOrderNum(''); setEmail(''); }}
          style={{ border: 0, background: 'none', fontSize: 11, textDecoration: 'underline', marginBottom: 32, cursor: 'pointer', padding: 0 }}
        >
          ← Track a different order
        </button>
      )}

      {/* Tracking timeline — shown after tracking */}
      {tracked && (
        <>
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 4px' }}>
              Order #{orderNum}
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>
              Estimated delivery: <span style={{ color: 'var(--accent)' }}>Today by 8 PM</span>
            </p>
          </div>

          <div className="tracking">
            {TRACKING_STEPS.map((step, i) => {
              const done = i <= ACTIVE_STEP;
              const active = i === ACTIVE_STEP;
              return (
                <div key={step.label} className={done ? 'done' : ''}>
                  <i>{done ? '✓' : ''}</i>
                  <b style={active ? { color: 'var(--accent)' } : {}}>{step.label}</b>
                  {step.detail && <span>{step.detail}</span>}
                  {step.date && (
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{step.date}</span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Help box */}
      <div className="delivery-help">
        <b>Need help with your order?</b>
        <p style={{ margin: '6px 0 0' }}>
          Contact our team at{' '}
          <Link to="/support">care@atelier.in</Link>
          {' '}or call{' '}
          <a href="tel:+918001234567">+91 800 123 4567</a>
          {' '}(Mon–Sat, 9am–6pm IST).
        </p>
      </div>

      {/* FAQ accordion */}
      <section style={{ marginTop: 48 }}>
        <p className="eyebrow">COMMON QUESTIONS</p>
        <h2 style={{ font: '30px var(--serif)', margin: '0 0 8px' }}>Delivery & returns</h2>
        {[
          ['How long does standard delivery take?', 'Standard delivery takes 3–5 business days from dispatch. Express delivery arrives in 1–2 business days.'],
          ['Can I change my delivery address?', 'Address changes can be made within 1 hour of placing the order. Contact care@atelier.in immediately.'],
          ['How do I return an item?', "Initiate a return within 14 days of delivery. Items must be unworn with all tags intact. We'll arrange a free pickup."],
          ['When will I receive my refund?', 'Refunds are processed within 5–7 business days of receiving the returned item.'],
        ].map(([q, a]) => (
          <details key={q} style={{ borderTop: '1px solid var(--line)', padding: '14px 0' }}>
            <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
              {q} <span>+</span>
            </summary>
            <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, margin: '13px 0 0' }}>{a}</p>
          </details>
        ))}
      </section>
    </main>
  );
}
