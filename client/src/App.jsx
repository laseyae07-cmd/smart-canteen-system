import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import KitchenDashboard from './pages/KitchenDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navbar stays at the top of every page */}
        <Navbar />
        
        {/* Main content changes based on the URL */}
        <main className="flex-grow max-w-6xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/kitchen" element={<KitchenDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;