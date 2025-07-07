import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/EZHealthLogo.png';
import { GiHamburgerMenu } from 'react-icons/gi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { IoClose } from 'react-icons/io5';
import { AuthContext } from '../auth.jsx';

const Navbar = () => {
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated, setIsAuthenticated, user, userRole, setUserRole } =
    useContext(AuthContext);
  console.log('Navbar user:', user);
  console.log('Navbar userRole:', userRole);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    console.log('Navbar isAuthenticated:', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      let logoutUrl = '';

      if (userRole === 'Doctor') {
        logoutUrl = 'https://ezhealth-server.onrender.com/api/v1/doctor/logout';
      } else {
        logoutUrl =
          'https://ezhealth-server.onrender.com/api/v1/user/patient/logout';
      }

      const res = await axios.get(logoutUrl, {
        withCredentials: true,
      });

      toast.success(res.data.message);
      setIsAuthenticated(false);
      setUserRole(null);
      navigateTo('/login');
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Logout failed, please try again.'
      );
    }
  };

  const navigateTo = useNavigate();

  const gotoLogin = async () => {
    navigateTo('/login');
  };

  return (
    <nav className="bg-blue-100 fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto px-6 py-2 flex justify-around items-center">
        {/* Logo */}
        <img src={logo} className="w-60" alt="Logo" />

        {/* Hamburger Icon */}
        <div
          className="md:hidden text-2xl cursor-pointer"
          onClick={() => setShow(!show)}>
          {show ? <IoClose /> : <GiHamburgerMenu />}
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 text-gray-700">
          <Link to="/">
            <li className="cursor-pointer text-xl hover:text-orange-500">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="cursor-pointer text-xl hover:text-orange-500">
              About
            </li>
          </Link>
          <Link to="/service">
            <li className="cursor-pointer text-xl hover:text-orange-500">
              Services
            </li>
          </Link>
          <Link to="/doctors">
            <li className="cursor-pointer text-xl hover:text-orange-500">
              Doctors
            </li>
          </Link>
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-4 items-center relative">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="px-4 py-2 text-white font-semibold bg-blue-600 rounded-lg hover:bg-orange-500">
                {user.firstName || 'User'} {`(${userRole})`}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <Link
                    to={
                      userRole === 'Doctor'
                        ? '/doctor/dashboard'
                        : '/patient/dashboard'
                    }
                    onClick={() => setIsDropdownOpen(false)}>
                    <div className="px-4 py-3 hover:bg-blue-50 hover:text-blue-700 text-gray-700 font-medium cursor-pointer transition-colors duration-200 rounded-t-lg">
                      View Profile
                    </div>
                  </Link>
                  <div
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="px-4 py-3 hover:bg-orange-100 hover:text-orange-700 text-gray-700 font-medium cursor-pointer transition-colors duration-200 rounded-b-lg">
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-orange-500"
              onClick={gotoLogin}>
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {show && (
        <div className="md:hidden bg-blue-100 shadow-md">
          <ul className="flex items-center flex-col gap-4 py-4 px-6 text-gray-700">
            <Link to="/">
              <li
                className="cursor-pointer text-lg hover:text-orange-500"
                onClick={() => setShow(false)}>
                Home
              </li>
            </Link>
            <Link to="/service">
              <li
                className="cursor-pointer text-lg hover:text-orange-500"
                onClick={() => setShow(false)}>
                Services
              </li>
            </Link>
            <Link to="/about">
              <li
                className="cursor-pointer text-lg hover:text-orange-500"
                onClick={() => setShow(false)}>
                About
              </li>
            </Link>
            <Link to="/doctors">
              <li
                className="cursor-pointer text-lg hover:text-orange-500"
                onClick={() => setShow(false)}>
                Doctors
              </li>
            </Link>
          </ul>
          <div className="flex items-center flex-col gap-4 px-6 pb-4">
            {isAuthenticated && user ? (
              <div className="text-center w-full " ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="w-full px-4 py-2 text-white font-semibold bg-blue-600 rounded-lg hover:bg-orange-500">
                  {user.firstName || 'User'} {`(${userRole})`}
                </button>

                {isDropdownOpen && (
                  <div className="mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <Link
                      to={
                        userRole === 'Doctor'
                          ? '/doctor/profile'
                          : '/patient/profile'
                      }
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setShow(false);
                      }}>
                      <div className="px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-gray-700 font-medium cursor-pointer transition-colors duration-200 rounded-t-lg">
                        View Profile
                      </div>
                    </Link>
                    <div
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setShow(false);
                        handleLogout();
                      }}
                      className="px-4 py-2 hover:bg-orange-50 hover:text-blue-700 text-gray-700 font-medium cursor-pointer transition-colors duration-200 rounded-b-lg">
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-orange-500"
                onClick={gotoLogin}>
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
