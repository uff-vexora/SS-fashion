import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { StoreProvider } from './context/StoreContext';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';
import AiStylistFab from './components/common/AiStylistFab';

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <ScrollToTop />
        <Header />
        <AppRoutes />
        <Footer />
        <AiStylistFab />
      </StoreProvider>
    </ErrorBoundary>
  );
}

