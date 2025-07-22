import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkClasses = ({ isActive }) =>
    isActive
      ? 'underline font-semibold text-white'
      : 'hover:underline';

  return (
    // Added fixed positioning and z-index to make Navbar float on top
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyan-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">📚 BookWorm</h1>
      <div className="space-x-4">
        <NavLink to="/" className={linkClasses}>Home</NavLink>
        <NavLink to="/library" className={linkClasses}>Library</NavLink>
        <NavLink to="/profile" className={linkClasses}>Profile</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;