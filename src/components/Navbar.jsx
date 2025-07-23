import React, { useState } from 'react'; // Import useState
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage mobile menu visibility

  const linkClasses = ({ isActive }) =>
    isActive
      ? 'underline font-semibold text-white'
      : 'hover:underline';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyan-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">📚 BookWorm</h1>

      {/* Hamburger menu button for mobile */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-white focus:outline-none" // Show only on mobile
        aria-label="Toggle navigation menu"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> // Close icon
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /> // Hamburger icon
          )}
        </svg>
      </button>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex space-x-4"> {/* Hide on mobile, show on desktop */}
        <NavLink to="/" className={linkClasses}>Home</NavLink>
        <NavLink to="/library" className={linkClasses}>Library</NavLink>
        <NavLink to="/profile" className={linkClasses}>Profile</NavLink>
      </div>

      {/* Mobile Navigation Menu (conditionally rendered) */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-cyan-800 flex flex-col items-center py-4 space-y-4 md:hidden shadow-lg">
          <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={linkClasses}>Home</NavLink>
          <NavLink to="/library" onClick={() => setIsMenuOpen(false)} className={linkClasses}>Library</NavLink>
          <NavLink to="/profile" onClick={() => setIsMenuOpen(false)} className={linkClasses}>Profile</NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;