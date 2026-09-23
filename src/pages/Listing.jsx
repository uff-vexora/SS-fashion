import { useState, useEffect } from 'react';
import ProductGrid from '../components/product/ProductGrid';
import { products } from '../data/products';

const SORT_OPTIONS = ['Popularity', 'Newest', 'Price: low to high', 'Price: high to low', 'Rating'];

function Filter({ items, filters, onChange, onClose }) {
  const categories = [...new Set(items.map((p) => p.category))];
  const allSizes  = [...new Set(items.flatMap((p) => p.sizes))];
  const allColors = [...new Set(items.flatMap((p) => p.colors))];

  return (
    <aside className="filters" aria-label="Product filters">
      <div className="filter-head">
        <b>Filter by</b>
        <button onClick={onClose} aria-label="Close filters">×</button>
      </div>

      {/* Category */}
      <details open>
        <summary>Category <span>+</span></summary>
        <div className="filter-options">
          {categories.map((cat) => (
            <label key={cat}>
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => onChange('categories', cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </details>

      {/* Size */}
      <details open>
        <summary>Size <span>+</span></summary>
        <div className="filter-options" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {allSizes.map((s) => (
            <label key={s}>
              <input
                type="checkbox"
                checked={filters.sizes.includes(s)}
                onChange={() => onChange('sizes', s)}
              />
              {s}
            </label>
          ))}
        </div>
      </details>

      {/* Color */}
      <details>
        <summary>Colour <span>+</span></summary>
        <div className="filter-options">
          {allColors.map((c) => (
            <label key={c}>
              <input
                type="checkbox"
                checked={filters.colors.includes(c)}
                onChange={() => onChange('colors', c)}
              />
              {c}
            </label>
          ))}
        </div>
      </details>

      {/* Price */}
      <details>
        <summary>Price range <span>+</span></summary>
        <div className="filter-options">
          {[['Under ₹1,500', 'under1500'], ['₹1,500–₹2,500', '1500to2500'], ['Above ₹2,500', 'above2500']].map(([label, val]) => (
            <label key={val}>
              <input
                type="checkbox"
                checked={filters.price === val}
                onChange={() => onChange('price', val)}
              />
              {label}
            </label>
          ))}
        </div>
      </details>

      {/* Availability */}
      <details>
        <summary>Availability <span>+</span></summary>
        <div className="filter-options">
          <label>
            <input
              type="checkbox"
              checked={filters.onSale}
              onChange={() => onChange('onSale', !filters.onSale)}
            />
            On sale
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.newIn}
              onChange={() => onChange('newIn', !filters.newIn)}
            />
            New in
          </label>
        </div>
      </details>
    </aside>
  );
}

const INITIAL_FILTERS = {
  categories: [],
  sizes: [],
  colors: [],
  price: '',
  onSale: false,
  newIn: false,
};

export default function Listing({ kind }) {
  const [sort, setSort] = useState('Popularity');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  // Lock body scroll when mobile filter panel is open
  useEffect(() => {
    document.body.style.overflow = filterOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [filterOpen]);

  // Base products for this listing type
  const base =
    kind === 'new'  ? products.filter((p) => p.tag === 'New') :
    kind === 'sale' ? products.filter((p) => p.originalPrice > p.price) :
    products.filter((p) => p.gender === kind);

  // Apply filters
  function applyFilters(list) {
    return list.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.sizes.length && !filters.sizes.some((s) => p.sizes.includes(s))) return false;
      if (filters.colors.length && !filters.colors.some((c) => p.colors.includes(c))) return false;
      if (filters.price === 'under1500' && p.price >= 1500) return false;
      if (filters.price === '1500to2500' && (p.price < 1500 || p.price > 2500)) return false;
      if (filters.price === 'above2500' && p.price <= 2500) return false;
      if (filters.onSale && p.originalPrice <= p.price) return false;
      if (filters.newIn && p.tag !== 'New') return false;
      return true;
    });
  }

  // Apply sort
  function applySort(list) {
    const sorted = [...list];
    if (sort === 'Price: low to high') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'Price: high to low') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'Rating') sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }

  const filtered = applyFilters(base);
  const listed   = applySort(filtered);

  const activeFilterCount =
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.price ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.newIn ? 1 : 0);

  function handleFilterChange(key, value) {
    setFilters((prev) => {
      if (key === 'onSale' || key === 'newIn') return { ...prev, [key]: value };
      if (key === 'price') return { ...prev, price: prev.price === value ? '' : value };
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS);
  }

  const title =
    kind === 'new'  ? 'New arrivals' :
    kind === 'sale' ? 'Sale' :
    `${kind} collection`;

  const eyebrow =
    kind === 'new'  ? 'JUST LANDED' :
    kind === 'sale' ? 'LAST CHANCE' :
    kind.toUpperCase();

  return (
    <main className="page">
      {/* Listing heading */}
      <div className="listing-head">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <span>{base.length} piece{base.length !== 1 ? 's' : ''}, selected with care</span>
      </div>

      {/* Toolbar */}
      <div className="listing-tools">
        <span>
          {listed.length} of {base.length} products
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              style={{ marginLeft: 10, border: 0, background: 'none', fontSize: 10, textDecoration: 'underline', cursor: 'pointer' }}
            >
              Clear filters ({activeFilterCount})
            </button>
          )}
        </span>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
          {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* Catalog layout */}
      <div className="catalog">
        {/* Filter toggle button — mobile only */}
        <button
          className="filter-toggle"
          onClick={() => setFilterOpen(true)}
          aria-expanded={filterOpen}
          aria-controls="filter-panel"
        >
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`} +
        </button>

        {/* Filter backdrop (mobile) */}
        <div
          className={`filter-backdrop ${filterOpen ? 'shown' : ''}`}
          onClick={() => setFilterOpen(false)}
          aria-hidden="true"
        />

        {/* Filter panel */}
        <div id="filter-panel" className={filterOpen ? 'shown' : ''}>
          <Filter
            items={base}
            filters={filters}
            onChange={handleFilterChange}
            onClose={() => setFilterOpen(false)}
          />
        </div>

        {/* Product grid */}
        {listed.length > 0 ? (
          <ProductGrid products={listed} />
        ) : (
          <div style={{ padding: '40px 0', textAlign: 'center', gridColumn: '1/-1' }}>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>
              No products match the selected filters.
            </p>
            <button
              className="button"
              onClick={clearFilters}
              style={{ marginTop: 16 }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
