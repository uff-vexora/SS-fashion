import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const NAV_LINKS = [
  ['New', '/new'],
  ['Women', '/women'],
  ['Men', '/men'],
  ['Children', '/children'],
  ['Sale', '/sale'],
  ['Delivery', '/delivery'],
  ['Support', '/support'],
];

export default function Header() {
  const { cart, wish, user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const wishCount = wish.length;

  // Scroll detection for glass navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on route change
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [location]);

  // Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); setSearchOpen(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Outside click for menu
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Body scroll lock on menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  return (
    <>
      {/* Announcement strip */}
      <div className="topline">
        Free shipping above ₹2,999<span>·</span>Easy 14-day returns<span>·</span>India's finest casuals
      </div>

      <header className={scrolled ? 'scrolled' : ''}>
        <nav className="nav" aria-label="Main navigation">
          {/* Mobile hamburger */}
          <button
            className="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          {/* Brand */}
          <Link className="brand" to="/" aria-label="SS Fashion — Home">
            SS<span>°</span>Fashion
          </Link>

          {/* Desktop nav links */}
          <nav aria-label="Collections">
            {NAV_LINKS.map(([label, to]) => (
              <Link
                key={to}
                to={to}
                className={location.pathname === to ? 'active' : ''}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="nav-actions">
            {/* Desktop search bar */}
            <form className="search" role="search" onSubmit={handleSearch}>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search…"
                aria-label="Search products"
              />
              <button type="submit" aria-label="Submit search">⌕</button>
            </form>

            {/* Mobile search toggle */}
            <button
              className="nav-icon-btn mobile-search-btn"
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Search"
              style={{ display: 'none' }}
            >
              ⌕
            </button>

            {/* Wishlist */}
            <Link className="nav-icon-btn" to="/wishlist" aria-label={`Wishlist (${wishCount} items)`} style={{ position: 'relative' }}>
              ♡
              {wishCount > 0 && (
                <b style={{
                  position: 'absolute',
                  background: 'var(--accent)',
                  color: '#fff',
                  borderRadius: '9999px',
                  fontSize: 8,
                  minWidth: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: -3,
                  right: -3,
                  padding: '0 3px',
                  fontWeight: 700,
                  animation: 'popIn .4s cubic-bezier(.34,1.56,.64,1) both',
                }}>
                  {wishCount}
                </b>
              )}
            </Link>

            {/* Account / Profile */}
            <Link
              className="nav-icon-btn profile-btn"
              to="/account"
              aria-label={user ? `Account (${user.name})` : "Sign In to Atelier"}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {user ? (
                <div style={{ position: 'relative', width: 26, height: 26 }}>
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent)' }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '1.5px solid #fff'
                  }} />
                </div>
              ) : (
                <span style={{ fontSize: 16 }} title="Sign In">👤</span>
              )}
            </Link>

            {/* Cart bag */}
            <Link className="bag" to="/cart" aria-label={`Shopping bag (${cartCount} items)`}>
              🛍
              {cartCount > 0 && <b>{cartCount}</b>}
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: 'rgba(0,0,0,.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'flex-start',
            paddingTop: '80px',
            animation: 'fadeIn 200ms both',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <form
            onSubmit={handleSearch}
            style={{
              width: 'calc(100% - 32px)',
              margin: '0 16px',
              background: '#fff',
              borderRadius: '12px',
              display: 'flex',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              animation: 'modalIn 250ms cubic-bezier(.22,1,.36,1) both',
            }}
          >
            <input
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for styles, colours, products…"
              style={{
                flex: 1,
                border: 0,
                padding: '18px 20px',
                fontSize: 16,
                outline: 0,
                background: 'transparent',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--ink)',
                border: 0,
                color: '#fff',
                padding: '0 20px',
                fontSize: 20,
                transition: 'background var(--t-fast)',
              }}
            >
              ⌕
            </button>
          </form>
        </div>
      )}

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            display: 'flex',
          }}
        >
          {/* Backdrop */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,.5)',
              backdropFilter: 'blur(4px)',
              animation: 'fadeIn 220ms both',
            }}
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <nav
            id="mobile-drawer"
            ref={menuRef}
            style={{
              position: 'relative',
              zIndex: 1,
              width: 'min(320px, 88vw)',
              background: 'var(--paper)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInLeft 280ms cubic-bezier(.22,1,.36,1) both',
              boxShadow: 'var(--shadow-xl)',
              overflowY: 'auto',
            }}
            aria-label="Mobile navigation drawer"
          >
            {/* Drawer header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
              <Link className="brand" to="/" style={{ fontSize: 20 }}>
                SS<span>°</span>Fashion
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{ fontSize: 20, color: 'var(--muted)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--t-fast)' }}
              >
                ✕
              </button>
            </div>

            {/* User profile card or sign in in drawer */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line-light)', background: 'rgba(255,255,255,0.6)' }}>
              {user ? (
                <Link to="/account" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }}
                  />
                  <div>
                    <span style={{ display: 'block', fontWeight: 600, fontSize: 13.5 }}>{user.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--mono)' }}>{user.tierBadge} · Account →</span>
                  </div>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="ai-button-glow" style={{ width: '100%', fontSize: 11, padding: '10px 16px' }}>
                  Sign In / Register ✦
                </Link>
              )}
            </div>

            {/* Nav links */}
            <div style={{ padding: '16px 24px', flex: 1 }}>
              <p style={{ font: '300 9px var(--mono)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 12px' }}>Collections</p>
              {NAV_LINKS.map(([label, to], i) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 0',
                    borderBottom: '1px solid var(--line-light)',
                    fontSize: 15,
                    fontWeight: location.pathname === to ? 600 : 400,
                    color: location.pathname === to ? 'var(--accent)' : 'var(--ink)',
                    animation: `up ${280 + i * 40}ms cubic-bezier(.22,1,.36,1) both`,
                  }}
                >
                  {label}
                  <span style={{ color: 'var(--muted)', fontSize: 14 }}>›</span>
                </Link>
              ))}
            </div>

            {/* Drawer footer actions */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--line)', display: 'grid', gap: 10 }}>
              <Link to="/wishlist" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--muted)' }}>
                <span style={{ fontSize: 18 }}>♡</span> Wishlist {wishCount > 0 && `(${wishCount})`}
              </Link>
              <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--muted)' }}>
                <span style={{ fontSize: 18 }}>🛍</span> Shopping bag {cartCount > 0 && `(${cartCount})`}
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Bottom mobile nav bar */}
      <nav className="bottom-nav" aria-label="Bottom navigation">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <span className="icon">⌂</span>
          Home
        </Link>
        <Link to="/women" className={['/women', '/men', '/children', '/new', '/sale'].includes(location.pathname) ? 'active' : ''}>
          <span className="icon">✦</span>
          Shop
        </Link>
        <Link to="/search" className={location.pathname === '/search' ? 'active' : ''}>
          <span className="icon">⌕</span>
          Search
        </Link>
        <Link to="/account" className={['/login', '/account'].includes(location.pathname) ? 'active' : ''}>
          <span className="icon">👤</span>
          {user ? 'Profile' : 'Sign In'}
        </Link>
        <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>
          <span className="icon">🛍</span>
          Bag
          {cartCount > 0 && <b>{cartCount}</b>}
        </Link>
      </nav>
    </>
  );
}
