import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const Navbar = ({ books = [], theme, toggleTheme }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectBook = (id) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/book/${id}`);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--bg-primary)]/80 border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img src="/images/img4.jpg" alt="BookWorm Logo" className="w-8 h-8 rounded-sm shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform object-cover" />
            <span className="hidden sm:block text-xl font-heading font-semibold text-[var(--text-primary)] tracking-tight">
              BookWorm
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="flex flex-1 justify-center items-center gap-4 sm:gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-[var(--text-primary)] ${
                  isActive ? 'text-[var(--text-primary)] border-b-2 border-[var(--accent-primary)] py-5' : 'text-[var(--text-muted)] py-5 border-b-2 border-transparent'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/library"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-[var(--text-primary)] ${
                  isActive ? 'text-[var(--text-primary)] border-b-2 border-[var(--accent-primary)] py-5' : 'text-[var(--text-muted)] py-5 border-b-2 border-transparent'
                }`
              }
            >
              Library
            </NavLink>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-strong)] px-3 py-1.5 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
              <kbd className="font-mono text-xs opacity-50 ml-1">⌘K</kbd>
            </button>

            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full border border-[var(--border-strong)] overflow-hidden hover:border-[var(--accent-primary)] transition-colors bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
            
            <Link to="/profile" className="w-8 h-8 rounded-full border border-[var(--border-strong)] overflow-hidden hover:border-[var(--accent-primary)] transition-colors bg-[var(--bg-tertiary)] flex items-center justify-center">
              <svg className="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

        </div>
      </nav>

      {/* Search Modal (Command Palette) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <div 
            className="absolute inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-sm" 
            onClick={() => setIsSearchOpen(false)}
          ></div>
          
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] w-full max-w-xl rounded-md shadow-2xl relative z-10 flex flex-col overflow-hidden animate-slide-up">
            
            {/* Search Input */}
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search your library by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-0 text-base"
              />
              <button onClick={() => setIsSearchOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-xs font-semibold px-2 py-1 rounded bg-[var(--bg-tertiary)]/50">
                ESC
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {searchQuery.trim() === '' ? (
                <div className="p-8 text-center text-[var(--text-muted)] text-sm">
                  Start typing to search your collection...
                </div>
              ) : filteredBooks.length > 0 ? (
                <div className="py-2">
                  {filteredBooks.map(book => (
                    <button 
                      key={book.id}
                      onClick={() => handleSelectBook(book.id)}
                      className="w-full text-left px-4 py-3 flex items-center gap-4 hover:bg-[var(--border-subtle)] transition-colors focus:bg-[var(--border-subtle)] focus:outline-none"
                    >
                      {book.cover ? (
                        <img src={book.cover} alt="" className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-14 bg-[var(--bg-tertiary)] rounded flex items-center justify-center shadow-sm flex-shrink-0">
                          <span className="font-heading text-sm text-[var(--text-muted)]">{book.title.charAt(0)}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[var(--text-primary)] font-semibold truncate text-sm">{book.title}</h4>
                        <p className="text-[var(--text-muted)] text-xs truncate mt-0.5">{book.author}</p>
                      </div>
                      <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--accent-primary)] opacity-80 px-2 py-1 bg-[var(--accent-primary)]/10 rounded-sm">
                        {book.category}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-[var(--text-muted)] text-sm">
                  No books found matching "{searchQuery}"
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
