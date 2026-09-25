import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import { products } from '../data/products';
import AiStylistModal from '../components/common/AiStylistModal';
import { formatPrice } from '../utils/formatPrice';

const categories = [
  ['Men',      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=85', 'Modern tailoring'],
  ['Women',    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=85', 'Quiet confidence'],
  ['Children', 'https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=900&q=85', 'Made for movement'],
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'SS Fashion°',
  url: 'https://ss-fashion.in',
  description: 'Modern fashion essentials for men, women and children. Designed in India.',
  currenciesAccepted: 'INR',
  paymentAccepted: 'UPI, Credit Card, Debit Card, Cash on Delivery',
  priceRange: '₹999 – ₹3,999',
};

export default function Home() {
  const [stylistOpen, setStylistOpen] = useState(false);

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero ai-ambient-bg" aria-label="Hero — Autumn collection">
        <div className="ai-orb ai-orb-1" aria-hidden="true" />
        <img
          src="https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=1800&q=90"
          alt="SS Fashion Autumn editorial — women's collection"
          fetchPriority="high"
          loading="eager"
        />
        <div className="hero-copy">
          <div style={{ marginBottom: 12 }}>
            <span className="ai-badge luminous" style={{ background: 'rgba(24,24,26,0.7)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
              <span className="dot" /> AI STYLED EDIT · AUTUMN 2026
            </span>
          </div>
          <h1>
            New forms.<br />
            Same point of view.
          </h1>
          <span>Considered pieces designed for fluid everyday luxury.</span>
          <div className="hero-actions">
            <Link className="button light" to="/new">Shop new arrivals</Link>
            <button
              type="button"
              className="ai-button-glow"
              onClick={() => setStylistOpen(true)}
              style={{ padding: '12px 22px' }}
            >
              ✦ Ask AI Stylist
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll" aria-hidden="true">
          ↓ SCROLL
        </div>
      </section>

      {/* ── AI Neural Styling Studio Showcase Banner ─────── */}
      <section className="section ai-ambient-bg" style={{ padding: '60px var(--section-h)' }}>
        <div className="ai-orb ai-orb-2" aria-hidden="true" />
        <div className="ai-glass-card ai-border-glow" style={{ padding: '40px 36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24, marginBottom: 28 }}>
            <div>
              <span className="ai-badge luminous" style={{ marginBottom: 10 }}>
                <span className="dot" /> ATELIER INTELLIGENCE V3.8
              </span>
              <h2 className="ai-gradient-text" style={{ fontSize: 32, fontFamily: 'var(--serif)', fontWeight: 600, margin: '6px 0 10px' }}>
                Generative Styling Studio
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 540, lineHeight: 1.6 }}>
                Experience intelligent wardrobe curation. Our neural algorithm harmonizes color temperature, fabric drape, and silhouettes from the SS Fashion vault in real-time.
              </p>
            </div>

            <button
              type="button"
              className="ai-button-glow"
              onClick={() => setStylistOpen(true)}
              style={{ alignSelf: 'center' }}
            >
              Launch AI Stylist Concierge ✦
            </button>
          </div>

          {/* 3 AI Highlight Feature Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              {
                title: 'Monsoon Quiet Luxury',
                match: '98.8%',
                item: products.find((p) => p.id === 'w1') || products[0],
                sub: 'Linen Column + Tailored Layering',
              },
              {
                title: 'Contemporary Executive',
                match: '97.4%',
                item: products.find((p) => p.id === 'm1') || products[1],
                sub: 'Relaxed Oxford + Pleated Drape',
              },
              {
                title: 'Tactile Weekend Minimalist',
                match: '99.1%',
                item: products.find((p) => p.id === 'w4') || products[2],
                sub: 'Soft Blazer + Sculpted Rib Tank',
              },
            ].map((look, idx) => (
              <div
                key={idx}
                onClick={() => setStylistOpen(true)}
                style={{
                  background: '#fff',
                  borderRadius: 'var(--r-lg)',
                  border: '1px solid var(--line-light)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  cursor: 'pointer',
                  transition: 'all var(--t-spring)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(142,72,55,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
                }}
              >
                <img
                  src={look.item.img}
                  alt={look.title}
                  style={{ width: 68, height: 78, borderRadius: 8, objectFit: 'cover' }}
                />
                <div>
                  <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 700 }}>
                    ✦ {look.match} HARMONY
                  </span>
                  <h4 style={{ fontSize: 14, fontWeight: 600, margin: '2px 0 4px', lineHeight: 1.3 }}>
                    {look.title}
                  </h4>
                  <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>
                    {look.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category intro ────────────────────────────────── */}
      <section className="section category-intro">
        <p className="eyebrow">SHOP BY WORLD</p>
        <h2>
          Designed for the rhythm<br />
          of real life.
        </h2>
      </section>

      {/* ── Category grid ─────────────────────────────────── */}
      <section className="category-grid" aria-label="Shop by category">
        {categories.map(([name, img, subtitle]) => (
          <Link
            to={`/${name.toLowerCase()}`}
            className="category"
            key={name}
            aria-label={`Shop ${name}'s collection — ${subtitle}`}
          >
            <img loading="lazy" src={img} alt={`${name}'s fashion`} />
            <div>
              <p>{subtitle}</p>
              <h3>{name}</h3>
              <span>Shop collection →</span>
            </div>
          </Link>
        ))}
      </section>

      {/* ── Discovery ─────────────────────────────────────── */}
      <section className="section discovery">
        <div>
          <p className="eyebrow">MOST WANTED</p>
          <h2>
            The pieces<br />
            you keep reaching for.
          </h2>
        </div>
        <Link className="text-link" to="/new">View all pieces →</Link>
      </section>

      {/* ── Featured products ──────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <ProductGrid products={products.slice(0, 8)} />
      </section>

      {/* ── Campaign banner ───────────────────────────────── */}
      <section className="campaign" aria-label="Women's campaign banner">
        <img
          loading="lazy"
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=85"
          alt="A study in texture — SS Fashion womenswear campaign"
        />
        <div>
          <span className="ai-badge luminous" style={{ marginBottom: 12 }}>
            <span className="dot" /> EDITORIAL ATELIER
          </span>
          <h2 style={{ marginTop: 8 }}>
            Feel good<br />
            in your skin.
          </h2>
          <Link className="button" to="/women">Discover womenswear</Link>
        </div>
      </section>

      {/* AI Stylist Modal */}
      <AiStylistModal isOpen={stylistOpen} onClose={() => setStylistOpen(false)} />
    </>
  );
}

