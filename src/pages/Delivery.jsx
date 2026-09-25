import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatPrice';

const TRACKING_STEPS = [
  { label: 'Order placed', detail: 'Your order has been confirmed.', date: 'Confirmed' },
  { label: 'Processing', detail: 'Your items are being carefully prepared & steamed.', date: 'In Atelier' },
  { label: 'Shipped', detail: 'Your parcel is on its way via Express Logistics.', date: 'In Transit' },
  { label: 'Out for delivery', detail: 'Your courier is out for delivery today.', date: 'Out for Delivery' },
  { label: 'Delivered', detail: 'Handed to recipient.', date: 'Completed' },
];

export default function Delivery() {
  const { orders } = useStore();
  const [orderNum, setOrderNum] = useState('');
  const [tracked, setTracked] = useState(false);
  const [email, setEmail] = useState('');
  const [matchedOrder, setMatchedOrder] = useState(null);

  function handleTrack(e, idToTrack = orderNum) {
    if (e) e.preventDefault();
    const queryId = (idToTrack || orderNum).trim().toUpperCase();
    if (queryId) {
      const found = orders.find((o) => o.id.toUpperCase() === queryId);
      setMatchedOrder(found || null);
      setOrderNum(queryId);
      setTracked(true);
    }
  }

  const activeStep = matchedOrder?.trackingStep !== undefined ? matchedOrder.trackingStep : 3;

  return (
    <main className="page delivery ai-ambient-bg">
      <div className="ai-orb ai-orb-1" aria-hidden="true" />
      <p className="eyebrow">ORDER TRACKING</p>
      <h1 className="ai-gradient-text">Track your order</h1>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>
        Enter your order number to see real-time delivery checkpoints.
      </p>

      {/* Quick click chips for existing store orders */}
      {!tracked && orders.length > 0 && (
        <div style={{ marginBottom: 28, background: 'rgba(255,255,255,0.7)', padding: '16px 20px', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', maxWidth: 480 }}>
          <p style={{ fontSize: 11, fontFamily: 'var(--mono)', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
            ✦ Your Recent Atelier Orders
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {orders.slice(0, 3).map((ord) => (
              <button
                key={ord.id}
                type="button"
                className="ai-prompt-pill"
                onClick={() => handleTrack(null, ord.id)}
              >
                Track {ord.id} ({ord.status}) →
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Track form */}
      {!tracked ? (
        <form onSubmit={handleTrack} style={{ display: 'grid', gap: 12, maxWidth: 480, marginBottom: 40 }}>
          <input
            required
            value={orderNum}
            onChange={(e) => setOrderNum(e.target.value)}
            placeholder="Order number (e.g. SSF-892401)"
            style={{
              padding: '13px 14px',
              border: '1px solid var(--line)',
              background: '#fff',
              fontSize: 13,
              outline: 0,
              borderRadius: 6,
              width: '100%',
            }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address (optional)"
            style={{
              padding: '13px 14px',
              border: '1px solid var(--line)',
              background: '#fff',
              fontSize: 13,
              outline: 0,
              borderRadius: 6,
              width: '100%',
            }}
          />
          <button className="ai-button-glow" type="submit" style={{ justifyContent: 'center' }}>
            Track Order ✦
          </button>
        </form>
      ) : (
        <button
          onClick={() => { setTracked(false); setOrderNum(''); setMatchedOrder(null); }}
          style={{ border: 0, background: 'none', fontSize: 12, textDecoration: 'underline', marginBottom: 28, cursor: 'pointer', padding: 0, color: 'var(--accent)' }}
        >
          ← Track a different order
        </button>
      )}

      {/* Tracking timeline — shown after tracking */}
      {tracked && (
        <div className="ai-glass-card" style={{ padding: '28px', maxWidth: 640, marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
            <div>
              <span className="ai-badge luminous" style={{ marginBottom: 6 }}>
                <span className="dot" /> LIVE ATELIER TRACKING
              </span>
              <h3 style={{ fontSize: 20, fontFamily: 'var(--mono)', fontWeight: 700, margin: '4px 0' }}>
                Order #{orderNum}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
                Status: <strong style={{ color: matchedOrder?.status === 'Delivered' ? 'var(--green)' : 'var(--accent)' }}>{matchedOrder?.status || 'In Transit'}</strong>
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Delivery Schedule</span>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
                {matchedOrder?.estimatedDelivery || 'Arriving in 1–2 business days'}
              </p>
            </div>
          </div>

          {/* Matched order items preview */}
          {matchedOrder?.items && (
            <div style={{ marginBottom: 24, padding: '12px', background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--r-md)', border: '1px solid var(--line-light)' }}>
              <p style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                Items in this parcel ({matchedOrder.items.length})
              </p>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
                {matchedOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--line-light)' }}>
                    <img src={it.img} alt={it.name} style={{ width: 32, height: 38, objectFit: 'cover', borderRadius: 3 }} />
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{it.name} (x{it.qty})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stepper timeline */}
          <div className="tracking">
            {TRACKING_STEPS.map((step, i) => {
              const done = i <= activeStep;
              const active = i === activeStep;
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
        </div>
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
