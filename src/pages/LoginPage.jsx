import React, { useContext, useState } from 'react';
import { IoEyeOff, IoEye } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../auth.jsx';
import axios from 'axios';

const LoginPage = () => {
  const { isAuthenticated, setIsAuthenticated, setUser, setUserRole } =
    useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigateTo = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/login`,
        { email, password, role: activeTab },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      toast.success(res.data.message);
      setIsAuthenticated(true);
      setUser(res.data.user);
      setUserRole(res.data.user.role || activeTab);
      setEmail('');
      setPassword('');

      // Role-based redirection
      if (activeTab === 'Doctor') {
        navigateTo('/doctor/dashboard');
      } else {
        navigateTo('/patient/dashboard');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="bg-blue-100 min-h-screen flex justify-center items-center">
      <div className="bg-blue-50 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Login
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('Patient')}
            className={`px-6 py-2 rounded-l-lg ${
              activeTab === 'Patient'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-600'
            }`}>
            Patient
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Doctor')}
            className={`px-6 py-2 rounded-r-lg ${
              activeTab === 'Doctor'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-600'
            }`}>
            Doctor
          </button>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-11 right-4 text-gray-600 hover:text-blue-500">
              {showPassword ? <IoEye /> : <IoEyeOff />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">
            Login as {activeTab}
          </button>

          {/* Register Redirect */}
          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
