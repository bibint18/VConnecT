import React, { useState } from 'react';
import logo from '../../../assets/logovct1.png';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { logoutTheUser } from '../../../redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { name, isAuthenticated, accessToken } = useAppSelector((state) => state.user);
  console.log("name", name, isAuthenticated, accessToken);
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleUserLogout = () => {
    dispatch(logoutTheUser());
    setIsMenuOpen(false);
  };

 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white text-black p-4 flex justify-between items-center relative z-50">
      <div className="flex items-center space-x-2">
        <img className="w-36" src={logo} alt="Logo" />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6">
        <Link to="/" className="hover:text-purple-500">Home</Link>
        <Link to="/rooms" className="hover:text-purple-500">Rooms</Link>
        <Link to="/friends" className="hover:text-purple-500">Friends</Link>
        <Link to="/profile" className="hover:text-purple-500">Profile</Link>
        <Link to="/dailyTrivia" className="hover:text-purple-500">Daily Trivia</Link>
        <Link to="/feed" className="hover:text-purple-500">Community</Link>
      </nav>

      {/* Desktop Auth Section */}
      <div className="hidden md:flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="text-gray-700">{name}</span>
            <button
              onClick={handleUserLogout}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:scale-105 transition"
            >
              LOGOUT
            </button>
          </>
        ) : (
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:scale-105 transition"
            onClick={() => navigate('/login')}
          >
            LOGIN
          </button>
        )}
      </div>

      {/* Hamburger Button for Small Screens */}
      <div className="md:hidden">
        <button
          className="!text-black focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`absolute top-[calc(100%+0.5rem)] right-0 w-64 !bg-white !shadow-xl md:hidden z-50 !rounded-lg !border !border-gray-200 transition-all duration-300 ease-in-out ${
            isMenuOpen ? '!opacity-100 !translate-y-0' : '!opacity-0 !-translate-y-4 !pointer-events-none'
          }`}
        >
          <nav className="!flex !flex-col !p-4 !space-y-3">
            <Link
              to="/"
              className="!text-black !font-medium hover:!text-purple-500 !py-2 !px-3 !rounded-md hover:!bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/rooms"
              className="!text-black !font-medium hover:!text-purple-500 !py-2 !px-3 !rounded-md hover:!bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
              }}
            >
              Rooms
            </Link>
            <Link
              to="/friends"
              className="!text-black !font-medium hover:!text-purple-500 !py-2 !px-3 !rounded-md hover:!bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Friends
            </Link>
            <Link
              to="/profile"
              className="!text-black !font-medium hover:!text-purple-500 !py-2 !px-3 !rounded-md hover:!bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/dailyTrivia"
              className="!text-black !font-medium hover:!text-purple-500 !py-2 !px-3 !rounded-md hover:!bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Daily Trivia
            </Link>
            <Link
              to="/feed"
              className="!text-black !font-medium hover:!text-purple-500 !py-2 !px-3 !rounded-md hover:!bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </Link>
            {isAuthenticated ? (
              <div className="!flex !flex-col !space-y-3 !mt-2">
                <span className="!text-gray-700 !font-medium !py-2 !px-3">{name}</span>
                <button
                  onClick={() => {
                    handleUserLogout();
                    setIsMenuOpen(false);
                  }}
                  className="!bg-gradient-to-r !from-purple-500 !to-pink-500 !text-white !px-4 !py-2 !rounded-full hover:!scale-105 !transition !text-left hover:!from-purple-600 hover:!to-pink-600"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                className="!bg-gradient-to-r !from-purple-500 !to-pink-500 !text-white !px-4 !py-2 !rounded-full hover:!scale-105 !transition !text-left hover:!from-purple-600 hover:!to-pink-600"
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
              >
                LOGIN
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;