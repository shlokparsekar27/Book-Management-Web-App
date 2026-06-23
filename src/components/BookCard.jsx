import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book, onRemove, onToggleFavorite }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const progress = book.totalPages > 0
    ? Math.round((book.currentPage / book.totalPages) * 100)
    : 0;

  // Title-derived gradient for covers that are missing
  const getPlaceholderGradient = (title = '') => {
    const charCode = title ? title.charCodeAt(0) : 0;
    const gradients = [
      'from-indigo-600/90 to-purple-600/90',
      'from-emerald-600/90 to-teal-600/90',
      'from-cyan-600/90 to-blue-600/90',
      'from-pink-600/90 to-rose-600/90',
      'from-amber-600/90 to-orange-600/90'
    ];
    return gradients[charCode % gradients.length];
  };

  const handleRemoveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmDelete(true);
  };

  const confirmDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(book.id);
    setShowConfirmDelete(false);
  };

  const cancelDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmDelete(false);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(book.id);
  };

  const hasCover = book.cover && book.cover.trim() !== '' && !book.cover.includes('placeholder.com');

  return (
    <div className="relative block h-full group">
      <Link to={`/book/${book.id}`} className="block h-full">
        <div className="bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-subtle)] rounded-xl p-4 hover:border-[var(--border-strong)] hover:bg-[var(--bg-secondary)]/80 transition-all duration-300 flex flex-col justify-between h-full shadow-lg hover:-translate-y-1">
          <div>
            {hasCover ? (
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-48 object-cover mb-4 rounded-lg shadow-md border border-[var(--border-subtle)]"
              />
            ) : (
              <div className={`w-full h-48 mb-4 rounded-lg flex flex-col items-center justify-center text-center p-3 bg-gradient-to-br ${getPlaceholderGradient(book.title)} shadow-md border border-[var(--border-subtle)]`}>
                <span className="text-white text-3xl font-extrabold tracking-wider drop-shadow-sm font-heading select-none">
                  {book.title ? book.title.charAt(0).toUpperCase() : 'B'}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/80 mt-2 select-none">
                  No Cover
                </span>
              </div>
            )}

            <h3 className="text-base font-bold text-[var(--text-primary)] truncate font-heading" title={book.title}>{book.title}</h3>
            <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{book.author}</p>
            <span className="inline-block bg-[var(--bg-tertiary)]/50 text-[var(--text-primary)] text-[10px] font-semibold px-2 py-0.5 rounded-full mt-2 border border-[var(--border-subtle)]">
              {book.category}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
            {book.totalPages > 0 && (
              <div className="text-xs text-[var(--text-muted)]">
                <div className="flex justify-between items-center mb-1 font-medium">
                  <span>Progress</span>
                  <span className="text-[var(--text-primary)] font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-1.5">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {book.currentPage === book.totalPages && book.totalPages > 0 && (
              <span className="mt-2.5 inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/20">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Completed
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Always Visible Favorite Toggle */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-3 left-3 p-1.5 rounded-full backdrop-blur-md transition-all duration-200 border shadow-md z-10 ${
          book.isFavorite
            ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 shadow-red-500/20'
            : 'bg-[var(--bg-secondary)]/80 text-[var(--text-muted)] border-[var(--border-strong)] hover:text-red-400 hover:border-red-400/30'
        }`}
        title={book.isFavorite ? "Unfavorite Book" : "Add to Favorites"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Always Visible Remove Button */}
      <button
        onClick={handleRemoveClick}
        className="absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all duration-200 border shadow-md z-10 bg-[var(--bg-secondary)]/80 text-[var(--text-muted)] border-[var(--border-strong)] hover:text-red-400 hover:border-red-400/30 hover:bg-red-500/10"
        title="Remove book"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Inline Delete Confirm Overlay */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-[var(--bg-primary)]/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4 text-center z-20 animate-fade-in border border-red-500/25">
          <svg className="w-8 h-8 text-red-500 mb-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-[var(--text-primary)] text-xs font-semibold px-2 mb-3">Remove "{book.title}" from library?</p>
          <div className="flex gap-2">
            <button
              onClick={cancelDelete}
              className="bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-strong)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCard;