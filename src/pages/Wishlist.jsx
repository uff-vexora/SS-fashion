import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { products } from '../data/products';
import ProductGrid from '../components/product/ProductGrid';

export default function Wishlist() {
  const { wish, toggleWishlist } = useStore();

  const wishItems = products.filter((p) => wish.includes(p.id));

  if (wishItems.length === 0) {
    return (
      <main className="page empty">
        <p className="eyebrow">YOUR SAVED PIECES</p>
        <h1>Nothing saved yet.</h1>
        <p>Tap the ♡ on any product to save it here for later.</p>
        <Link className="button" to="/new">Explore new arrivals</Link>
      </main>
    );
  }

  return (
    <main className="page">
      {/* Header row */}
      <div className="wishlist-head">
        <div>
          <p className="eyebrow">YOUR SAVED PIECES</p>
          <h1 style={{ fontSize: 44, margin: '4px 0 0' }}>
            Wishlist <small style={{ font: '13px var(--sans)', color: 'var(--muted)' }}>
              ({wishItems.length} item{wishItems.length !== 1 ? 's' : ''})
            </small>
          </h1>
        </div>
        <button
          onClick={() => wish.forEach((id) => toggleWishlist(id))}
          style={{
            border: '1px solid var(--line)',
            background: 'none',
            padding: '9px 16px',
            fontSize: 11,
            cursor: 'pointer',
            letterSpacing: '.04em',
            alignSelf: 'flex-end',
          }}
        >
          Clear all
        </button>
      </div>

      {/* Product grid */}
      <ProductGrid products={wishItems} />
    </main>
  );
}
