import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-md text-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-wider">
          🍔 Smart Canteen
        </Link>
        <div className="space-x-6">
          <Link to="/" className="hover:text-blue-200 transition">Menu</Link>
          <Link to="/cart" className="hover:text-blue-200 transition">Cart</Link>
          <Link to="/kitchen" className="hover:text-blue-200 transition">Kitchen</Link>
          <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;