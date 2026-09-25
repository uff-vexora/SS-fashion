import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('../pages/Home'));
const Listing = lazy(() => import('../pages/Listing'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const Search = lazy(() => import('../pages/Search'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Delivery = lazy(() => import('../pages/Delivery'));
const Support = lazy(() => import('../pages/Support'));
const Login = lazy(() => import('../pages/Login'));

const Loader = () => (
  <main className="page empty" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <div className="ai-badge luminous" style={{ marginBottom: 12 }}>
        <span className="dot" /> ATELIER LOADING
      </div>
      <p className="eyebrow" style={{ letterSpacing: '0.15em' }}>CALIBRATING PIECES…</p>
    </div>
  </main>
);

const NotFound = () => (
  <main className="page empty">
    <h1>That page has moved.</h1>
    <p>Let’s take you somewhere considered instead.</p>
    <a className="button" href="/">Return home</a>
  </main>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/men" element={<Listing kind="Men" />} />
        <Route path="/women" element={<Listing kind="Women" />} />
        <Route path="/children" element={<Listing kind="Children" />} />
        <Route path="/new" element={<Listing kind="new" />} />
        <Route path="/sale" element={<Listing kind="sale" />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/support" element={<Support />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

