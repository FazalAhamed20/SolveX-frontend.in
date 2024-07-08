import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/Store";
import { Logout } from "../../redux/actions/AuthActions";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(Logout());
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md z-10">
      <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo and Company Name */}
          <div className="flex items-center">
            <img
              className="h-6 w-auto"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/c869578c6dcaa35301d4bd19676c539d8b9e6b6d26a4b22898f4201318589d79?"
              alt="Logo"
            />
            <span className="ml-2 text-2xl font-bold text-gray-800">
              SolveX
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex sm:items-center sm:ml-6">
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Problem
              </a>
              <a
                href="#"
                className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Categories
              </a>
              <a
                href="#"
                className="text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Leaderboard
              </a>
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="bg-green-500 text-white h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium focus:outline-none"
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          navigate("/profile");
                          setIsDropdownOpen(false);
                        }}
                      >
                        Profile
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Logout
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href="#"
                  className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium"
                  onClick={() => navigate("/signup")}
                >
                  Register
                </a>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <button
              type="button"
              className="text-gray-700 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 px-3 py-2 rounded-md"
              aria-label="Toggle menu"
              onClick={toggleMenu}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Menu */}
      <div className={`sm:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="#"
            className="text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium"
          >
            Problem
          </a>
          <a
            href="#"
            className="text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium"
          >
            Category
          </a>
          <a
            href="#"
            className="text-gray-700 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium"
          >
            Leaderboard
          </a>
          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="bg-green-500 text-white h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium mx-auto focus:outline-none"
              >
                {user.username.charAt(0).toUpperCase()}
              </button>
              {isDropdownOpen && (
                <div className="mt-2 w-48 bg-white rounded-md shadow-lg py-2 mx-auto">
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          ) : (
            <a
              href="#"
              className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium"
              onClick={() => navigate("/signup")}
            >
              Register Now
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
