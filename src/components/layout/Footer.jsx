import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); }
  }

  return (
    <footer>
      <div className="footer-top">
        {/* Brand column */}
        <div>
          <Link className="brand" to="/">
            SS<span style={{ color: 'var(--accent)' }}>°</span>Fashion
          </Link>
          <p>
            Modern essentials, designed in India. Crafted for the rhythm
            of real life and worn on repeat.
          </p>

          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            {[
              ['Instagram', 'IG', 'https://instagram.com'],
              ['Pinterest', 'PT', 'https://pinterest.com'],
              ['WhatsApp', 'WA', 'https://wa.me'],
            ].map(([name, abbr, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`SS Fashion on ${name}`}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,.07)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontFamily: 'var(--mono)',
                  color: '#9a978f',
                  border: '1px solid rgba(255,255,255,.06)',
                  transition: 'background var(--t-fast), color var(--t-fast)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.14)'; e.currentTarget.style.color = '#f0ede6'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#9a978f'; }}
              >
                {abbr}
              </a>
            ))}
          </div>
        </div>

        {/* Shop column */}
        <div>
          <b>Shop</b>
          {[['New arrivals', '/new'], ['Women', '/women'], ['Men', '/men'], ['Children', '/children'], ['Sale', '/sale']].map(([label, to]) => (
            <Link key={to} to={to}>{label}</Link>
          ))}
        </div>

        {/* Help column */}
        <div>
          <b>Help</b>
          {[['Track your order', '/delivery'], ['Returns & exchanges', '/delivery'], ['Size guide', '/support'], ['Contact us', '/support'], ['FAQs', '/support']].map(([label, to]) => (
            <Link key={label} to={to}>{label}</Link>
          ))}
        </div>

        {/* Newsletter column */}
        <div className="newsletter">
          <b>Get early access</b>
          <p style={{ fontSize: 12, color: '#9a978f', margin: '4px 0 16px', lineHeight: 1.6 }}>
            New drops, edit previews, and curated style advice — no noise.
          </p>
          {subscribed ? (
            <p style={{ fontSize: 12, color: '#b5923c' }}>
              ✓ You&apos;re in. Welcome to the list.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email address for newsletter"
              />
              <button type="submit" aria-label="Subscribe">→</button>
            </form>
          )}

          {/* Payment badges */}
          <div className="footer-payment" style={{ marginTop: 20 }}>
            {['UPI', 'Visa', 'Mastercard', 'AmEx', 'COD', 'EMI'].map((m) => (
              <span className="payment-badge" key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SS Fashion Pvt. Ltd. All rights reserved.</span>
        <span style={{ display: 'flex', gap: 16 }}>
          <Link to="/support">Privacy</Link>
          <Link to="/support">Terms</Link>
          <Link to="/support">Cookies</Link>
        </span>
        <span>India's premium casual wear 🇮🇳</span>
      </div>
    </footer>
  );
}
