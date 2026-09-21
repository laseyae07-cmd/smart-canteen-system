import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md text-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link to={user?.role === 'staff' ? '/staff-dashboard' : '/'} className="text-xl font-bold tracking-wider">
          🍔 Smart Canteen
        </Link>

        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          {user?.role === 'staff' ? (
            <>
              <Link to="/staff-dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
              <Link to="/kitchen" className="hover:text-blue-200 transition">Kitchen</Link>
              <Link to="/admin-menu" className="hover:text-blue-200 transition">Admin Menu</Link>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-blue-200 transition">Menu</Link>
              <Link to="/cart" className="relative hover:text-blue-200 transition">
                Cart
                {totalItems > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-blue-600">
                    {totalItems}
                  </span>
                )}
              </Link>
              <Link to="/student-dashboard" className="hover:text-blue-200 transition">My Orders</Link>
            </>
          )}

          {user ? (
            <>
              <span className="text-sm font-medium text-blue-100">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;