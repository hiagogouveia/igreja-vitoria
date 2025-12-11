import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Programacao from './pages/Programacao';
import Cav from './pages/Cav';
import Aovivo from './pages/Aovivo';
import Contribua from './pages/Contribua';
import MinistryDetail from './pages/MinistryDetail';
import ContribuaPagamento from './pages/ContribuaPagamento';
import CavPage from './pages/CavPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-black text-white selection:bg-white selection:text-black">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programacao" element={<Programacao />} />
            <Route path="/aovivo" element={<Aovivo />} />
            <Route path="/contribua" element={<Contribua />} />
            <Route path="/ministerios/:id" element={<MinistryDetail />} />
            <Route path="/contribua-pagamento" element={<ContribuaPagamento />} />
            <Route path="/cav" element={<CavPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
