import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import QuemSomos from './pages/QuemSomos';
import Ministerios from './pages/Ministerios';
import CavPage from './pages/CavPage';
import Programacao from './pages/Programacao';
import Aovivo from './pages/Aovivo';
import Eventos from './pages/Eventos';
import Mensagens from './pages/Mensagens';
import Contribua from './pages/Contribua';
import ContribuaPagamento from './pages/ContribuaPagamento';
import Contato from './pages/Contato';

export default function App() {
  return (
    <Router>
      <ModalProvider>
        <ScrollToTop />
        <div style={{ background: 'var(--void)', minHeight: '100vh', color: 'var(--text)', position: 'relative', overflowX: 'hidden' }}>
          <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, background: 'radial-gradient(120% 70% at 50% -10%, rgba(240,168,72,.05), transparent 55%),radial-gradient(90% 50% at 50% 115%, rgba(91,141,239,.04), transparent 60%)' }} />
          <Navbar />
          <main style={{ position: 'relative', zIndex: 2 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quem-somos" element={<QuemSomos />} />
              <Route path="/ministerios" element={<Ministerios />} />
              <Route path="/ministerios/:id" element={<Ministerios />} />
              <Route path="/cav" element={<CavPage />} />
              <Route path="/programacao" element={<Programacao />} />
              <Route path="/aovivo" element={<Aovivo />} />
              <Route path="/eventos" element={<Eventos />} />
              <Route path="/mensagens" element={<Mensagens />} />
              <Route path="/contribua" element={<Contribua />} />
              <Route path="/contribua-pagamento" element={<ContribuaPagamento />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ModalProvider>
    </Router>
  );
}
