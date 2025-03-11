import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-black text-white p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="text-2xl">🎙️</div>
        <div className="text-lg font-bold">
          V<span className="text-purple-500">Connect</span>
          <span className="block text-xs font-light">yourRoom,yourVoice</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-6">
        <a href="#" className="hover:text-purple-500">Home</a>
        <a href="#" className="hover:text-purple-500">About</a>
        <a href="#" className="hover:text-purple-500">Community</a>
        <a href="#" className="hover:text-purple-500">Daily Trivia</a>
        <a href="#" className="hover:text-purple-500">Contact us</a>
      </nav>

      {/* Login Button */}
      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:scale-105 transition">
        LOGIN
      </button>

      {/* Mobile Menu (Optional) */}
      <div className="md:hidden">
        <button className="text-white">☰</button>
      </div>
    </header>
  );
};

export default Header;