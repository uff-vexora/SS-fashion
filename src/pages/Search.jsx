import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductGrid from '../components/product/ProductGrid';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // Sync input with URL
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const q = (searchParams.get('q') || '').toLowerCase().trim();

  const results = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.gender.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.colors.some((c) => c.toLowerCase().includes(q))
      )
    : [];

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  }

  return (
    <main className="page search-page">
      {/* Search heading */}
      {q ? (
        <h1>Results for "{searchParams.get('q')}"</h1>
      ) : (
        <h1>Search</h1>
      )}

      {/* Search input */}
      <form className="search-input-wrap" onSubmit={handleSubmit} role="search">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products, styles, colours…"
          aria-label="Search products"
        />
        <button type="submit" aria-label="Search">⌕</button>
      </form>

      {/* Results */}
      {q && (
        <>
          {results.length > 0 ? (
            <>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 28 }}>
                {results.length} piece{results.length !== 1 ? 's' : ''} found
              </p>
              <ProductGrid products={results} />
            </>
          ) : (
            <div className="empty" style={{ paddingTop: 60 }}>
              <p className="eyebrow">NO RESULTS</p>
              <h1 style={{ fontSize: 38 }}>Nothing matched "{searchParams.get('q')}"</h1>
              <p>Try a different search term or explore our collections.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[['Men', '/men'], ['Women', '/women'], ['New Arrivals', '/new']].map(([label, to]) => (
                  <Link key={to} className="button" to={to}>{label}</Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state — no query yet */}
      {!q && (
        <div style={{ marginTop: 20 }}>
          <p className="eyebrow">POPULAR SEARCHES</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
            {['Linen dress', 'Oxford shirt', 'Blazer', 'Denim', 'Sneakers', 'Co-ord'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchParams({ q: term })}
                style={{
                  border: '1px solid var(--line)',
                  background: 'none',
                  padding: '8px 16px',
                  fontSize: 11,
                  cursor: 'pointer',
                  letterSpacing: '.04em',
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
