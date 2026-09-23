import { Link } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import { products } from '../data/products';

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
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero" aria-label="Hero — Autumn collection">
        <img
          src="https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=1800&q=90"
          alt="SS Fashion Autumn editorial — women's collection"
          fetchPriority="high"
          loading="eager"
        />
        <div className="hero-copy">
          <p>THE AUTUMN EDIT · 2026</p>
          <h1>
            New forms.<br />
            Same point of view.
          </h1>
          <span>Considered pieces for the season ahead.</span>
          <div className="hero-actions">
            <Link className="button light" to="/new">Shop new arrivals</Link>
            <Link className="text-link" to="/women">Explore collection →</Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll" aria-hidden="true">
          ↓ SCROLL
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
          <p className="eyebrow">A STUDY IN TEXTURE</p>
          <h2>
            Feel good<br />
            in your skin.
          </h2>
          <Link className="button" to="/women">Discover womenswear</Link>
        </div>
      </section>
    </>
  );
}
