import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { products } from '../data/products';
import { useStore } from '../context/StoreContext';
import Rating from '../components/common/Rating';
import ProductGrid from '../components/product/ProductGrid';
import { formatPrice } from '../utils/formatPrice';
import { calculateDiscount } from '../utils/calculateDiscount';
import AiFitPredictor from '../components/product/AiFitPredictor';

const SAMPLE_REVIEWS = [
  { name: 'Priya S.', rating: 5, title: 'Perfect fit, beautiful quality', body: 'Exactly as described. The fabric feels premium and the fit is true to size. Very happy with this purchase.', verified: true, date: '14 Sep 2026' },
  { name: 'Arjun M.', rating: 4, title: 'Great everyday piece', body: 'Versatile and well made. Wears comfortably all day. Delivery was fast too.', verified: true, date: '8 Sep 2026' },
  { name: 'Meera K.', rating: 5, title: 'Exceeded expectations', body: 'The colour in person is even better than the photos. Will definitely be ordering more from SS Fashion.', verified: false, date: '2 Sep 2026' },
];

const SIZE_GUIDE = [
  ['Size', 'Chest (in)', 'Waist (in)', 'Hip (in)'],
  ['XS / 4-5Y', '32', '26', '34'],
  ['S / 6-7Y',  '34', '28', '36'],
  ['M / 8-9Y',  '36', '30', '38'],
  ['L',         '38', '32', '40'],
  ['XL',        '40', '34', '42'],
];

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  const { addToCart, wish, toggleWishlist } = useStore();

  const [size, setSize] = useState(product?.sizes[0]);
  const [color, setColor] = useState(product?.colors[0]);
  const [pin, setPin] = useState('');
  const [pinResult, setPinResult] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showAiFit, setShowAiFit] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="page empty">
        <div className="empty-icon">🔍</div>
        <p className="eyebrow">404 NOT FOUND</p>
        <h1>That piece isn&apos;t here.</h1>
        <p>It may have sold out or moved to a new collection.</p>
        <Link className="button" to="/new">Shop collection</Link>
      </main>
    );
  }

  const related = products
    .filter((p) => p.gender === product.gender && p.id !== product.id)
    .slice(0, 4);

  function checkPin() {
    if (!pin.trim()) return;
    if (/^\d{6}$/.test(pin)) {
      setPinResult('✓ Delivery available — arrives in 3–5 business days.');
    } else {
      setPinResult('Please enter a valid 6-digit pincode.');
    }
  }

  function handleAddToCart() {
    addToCart(product, size, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const img1 = product.img;
  const img2 = product.img.includes('?')
    ? product.img.replace('fit=crop', 'fit=crop&crop=top')
    : product.img + '&crop=top';

  const discount = calculateDiscount(product.price, product.originalPrice);
  const isSaved = wish.includes(product.id);

  return (
    <main className="page detail">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        {' / '}
        <Link to={`/${product.gender.toLowerCase()}`}>{product.gender}</Link>
        {' / '}
        <span style={{ color: 'var(--ink)' }}>{product.name}</span>
      </nav>

      {/* Main detail grid */}
      <div className="detail-grid">
        {/* Gallery */}
        <div className="gallery">
          <img src={img1} alt={product.name} />
          <img src={img2} alt={`${product.name} — detail view`} />
        </div>

        {/* Info panel */}
        <div className="product-detail">
          <p className="eyebrow">SS FASHION / {product.category.toUpperCase()}</p>
          <h1>{product.name}</h1>
          <Rating product={product} />

          {/* Price */}
          <div className="price">
            <strong>{formatPrice(product.price)}</strong>
            <del>{formatPrice(product.originalPrice)}</del>
            {discount > 0 && <span>{discount}% off</span>}
          </div>

          <p className="description">{product.description}</p>

          {/* Color choice */}
          <div className="choice">
            <b>Colour: <small>{color}</small></b>
            <div>
              {product.colors.map((item) => (
                <button
                  key={item}
                  className={color === item ? 'chosen' : ''}
                  onClick={() => setColor(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Size choice */}
          <div className="choice">
            <b>Size</b>
            <div style={{ position: 'absolute', right: 0, top: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                className="ai-badge luminous"
                style={{ cursor: 'pointer', padding: '3px 9px', fontSize: 10, border: '1px solid rgba(139, 92, 246, 0.4)' }}
                onClick={() => setShowAiFit(true)}
              >
                <span className="dot" /> ✦ AI Fit Advisor
              </button>
              <button
                style={{ background: 'none', border: 0, fontSize: 11, textDecoration: 'underline', cursor: 'pointer', color: 'var(--accent)', textUnderlineOffset: 3 }}
                onClick={() => setShowSizeGuide(true)}
              >
                Size guide
              </button>
            </div>
            <div className="sizes">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  className={size === item ? 'chosen' : ''}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="detail-actions">
            <button
              className={`button${added ? ' ghost' : ''}`}
              onClick={handleAddToCart}
              style={added ? { background: 'var(--green)', borderColor: 'var(--green)', color: '#fff', transform: 'none' } : {}}
            >
              {added ? '✓ Added to bag' : 'Add to bag'}
            </button>
            <button
              className="wish-detail"
              onClick={() => toggleWishlist(product.id)}
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              style={isSaved ? { background: 'var(--accent-lt)', borderColor: 'var(--accent-lt)', color: 'var(--accent)' } : {}}
            >
              {isSaved ? '♥' : '♡'}
            </button>
          </div>

          {/* Delivery check */}
          <div className="delivery-check">
            <b>Check delivery</b>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                value={pin}
                onChange={(e) => { setPin(e.target.value); setPinResult(''); }}
                placeholder="Enter 6-digit pincode"
                maxLength={6}
                inputMode="numeric"
                onKeyDown={(e) => e.key === 'Enter' && checkPin()}
              />
              <button onClick={checkPin}>Check</button>
            </div>
            {pinResult && (
              <small style={{ color: pinResult.startsWith('✓') ? 'var(--green)' : 'var(--accent)', fontWeight: 500 }}>
                {pinResult}
              </small>
            )}
            <small>Free delivery above ₹2,999 · Easy 14-day returns</small>
          </div>

          {/* Accordion */}
          <details open>
            <summary>Product details <span>+</span></summary>
            <p>
              Made from carefully selected materials. Designed in India and
              inspected for a precise, lasting finish. Model is 5&apos;8&ldquo; and wears
              size {product.sizes[1] || product.sizes[0]}.
            </p>
          </details>
          <details>
            <summary>Shipping & returns <span>+</span></summary>
            <p>
              Standard delivery 3–5 business days. Express delivery 1–2 business
              days (₹199). Free returns within 14 days — items must be unworn
              with tags intact.
            </p>
          </details>
        </div>
      </div>

      {/* Reviews */}
      <section className="reviews" aria-label="Customer reviews">
        <h2>Customer reviews</h2>
        <div className="review-summary">
          <strong>{product.rating}</strong>
          <div>
            <Rating product={product} />
            <span>{product.reviews} verified reviews</span>
          </div>
        </div>
        <div className="review-list">
          {SAMPLE_REVIEWS.map((r) => (
            <article key={r.name}>
              <span>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              <b>
                {r.title}
                {r.verified && <em>Verified purchase</em>}
              </b>
              <small>{r.name} · {r.date}</small>
              <p>{r.body}</p>
              <button>Helpful</button>
            </article>
          ))}
        </div>
      </section>

      {/* You may also like */}
      {related.length > 0 && (
        <section className="also-like">
          <h2>You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowSizeGuide(false); }}
        >
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setShowSizeGuide(false)}
              aria-label="Close size guide"
            >
              ×
            </button>
            <h3 id="size-guide-title">Size guide</h3>
            <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 16 }}>
              All measurements in inches. If between sizes, size up.
            </p>
            <table className="size-table">
              <thead>
                <tr>{SIZE_GUIDE[0].map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {SIZE_GUIDE.slice(1).map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => <td key={i}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* AI Fit Predictor Modal */}
      <AiFitPredictor
        product={product}
        selectedSize={size}
        onSelectSize={setSize}
        isOpen={showAiFit}
        onClose={() => setShowAiFit(false)}
      />
    </main>
  );
}
