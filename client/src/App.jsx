import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import KitchenDashboard from './pages/KitchenDashboard';
import AdminMenu from './pages/AdminMenu';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />

        <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8">
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/kitchen" element={<KitchenDashboard />} />
            <Route path="/admin-menu" element={<AdminMenu />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;