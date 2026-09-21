import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import KitchenDashboard from './pages/KitchenDashboard';
import StaffDashboard from './pages/StaffDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminMenu from './pages/AdminMenu';
import ProtectedRoute from './components/ProtectedRoute';

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
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff-dashboard"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kitchen"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <KitchenDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-menu"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <AdminMenu />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;