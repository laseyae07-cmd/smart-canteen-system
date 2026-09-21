import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegistering
        ? formData
        : { email: formData.email, password: formData.password };

      const response = await axios.post(endpoint, payload);

      if (isRegistering) {
        setIsRegistering(false);
        setFormData({ name: '', email: '', password: '', role: 'student' });
        setError('Registration successful! Please log in.');
        return;
      }

      login(response.data.user, response.data.token);
      navigate(response.data.user.role === 'staff' ? '/staff-dashboard' : '/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          {isRegistering ? 'Create Account' : 'Login'}
        </h1>
        <p className="mb-6 text-gray-600">
          {isRegistering ? 'Register to order food from the canteen.' : 'Sign in to place an order.'}
        </p>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {isRegistering && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? 'Please wait...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isRegistering ? 'Already have an account?' : 'Need an account?'}{' '}
          <button
            type="button"
            onClick={() => setIsRegistering((current) => !current)}
            className="font-semibold text-blue-600 hover:underline"
          >
            {isRegistering ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;