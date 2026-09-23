import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import Rating from '../common/Rating';
import { formatPrice } from '../../utils/formatPrice';
import { calculateDiscount } from '../../utils/calculateDiscount';
import { useState } from 'react';

const COLOR_MAP = {
  Ivory: '#f3f0e8', Cream: '#f3f0e8', Ecru: '#f3f0e8', Pearl: '#f3f0e8', White: '#f8f8f8', Butter: '#f5efc0',
  Black: '#27282a', Espresso: '#2e1f1a', Charcoal: '#4a4a4a',
  Navy: '#1e2a3a', Indigo: '#3a4e7a', Blue: '#5b7fa6', 'Washed Blue': '#7b9cba',
  Sage: '#75816d', Olive: '#6b7557', Terracotta: '#b5603a',
  Cherry: '#a2282c', Red: '#b03030', Rose: '#d4879f',
  Clay: '#b87056', Sand: '#c9b89a', Stone: '#a89880',
  Stripe: '#a8b9cf',
};

export default function ProductCard({ product }) {
  const { wish, toggleWishlist, addToCart } = useStore();
  const isSaved = wish.includes(product.id);
  const discount = calculateDiscount(product.price, product.originalPrice);
  const [justSaved, setJustSaved] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  function handleWishlist() {
    toggleWishlist(product.id);
    if (!isSaved) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 500);
    }
  }

  function handleAddToCart() {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <article className="product-card">
      {/* Image area */}
      <div className="product-image">
        <Link to={`/product/${product.id}`} tabIndex={-1} aria-hidden="true">
          <img
            loading="lazy"
            src={product.img}
            alt={product.name}
            width={450}
            height={600}
          />
        </Link>

        {/* Badge */}
        {product.tag && <em>{product.tag}</em>}

        {/* Wishlist */}
        <button
          className={`heart${isSaved ? ' saved' : ''}${justSaved ? ' pop' : ''}`}
          onClick={handleWishlist}
          aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        >
          {isSaved ? '♥' : '♡'}
        </button>

        {/* Desktop hover quick-add */}
        <button
          className="quick-add"
          onClick={handleAddToCart}
          aria-label={`Quick add ${product.name} to bag`}
          style={justAdded ? { background: 'var(--green)', borderRadius: 'var(--r-sm)' } : {}}
        >
          {justAdded ? '✓ Added' : 'Add to bag'}
        </button>
      </div>

      {/* Info */}
      <div className="product-info">
        <p>{product.gender} / {product.category}</p>

        <div className="product-line">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
          <Rating product={product} />
        </div>

        <div>
          <strong>{formatPrice(product.price)}</strong>
          {' '}
          <del>{formatPrice(product.originalPrice)}</del>
          {discount > 0 && <span className="discount">{discount}% off</span>}
        </div>

        {/* Color swatches */}
        <div className="swatches" aria-label="Available colours">
          {product.colors.map((color) => (
            <i
              key={color}
              title={color}
              aria-label={color}
              style={{ background: COLOR_MAP[color] || '#c4bfb5' }}
            />
          ))}
        </div>

        {/* Mobile add button */}
        <button
          className="mobile-add-btn"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to bag`}
          style={justAdded ? { background: 'var(--green)' } : {}}
        >
          {justAdded ? '✓ Added to bag' : '+ Add to bag'}
        </button>
      </div>
    </article>
  );
}
