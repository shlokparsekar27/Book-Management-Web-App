import React, { useState } from 'react';
import BookCard from '../components/BookCard';

const Library = ({ books, handleRemoveBook, onToggleFavorite }) => {
  const [activeFilterMode, setActiveFilterMode] = useState('all_books');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const uniqueCategories = ['All', ...new Set(books.map(book => book.category))].sort();

  const displayedBooks = books.filter(book => {
    if (activeFilterMode === 'select_category_view') return false;
    const matchesFavorites = activeFilterMode === 'favorite_books' ? book.isFavorite : true;
    const matchesCategory = activeFilterMode === 'all_books' && selectedCategory !== 'All'
      ? book.category === selectedCategory
      : true;
    return matchesFavorites && matchesCategory;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-6 animate-fade-in">

      {/* Editorial Header */}
      <div className="mb-12 border-b border-[var(--border-subtle)] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading text-[var(--text-primary)] mb-3">Your Collection</h1>
        </div>

        {/* Minimal Underline Filter Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto custom-scrollbar pb-1">
          <button
            onClick={() => { setActiveFilterMode('all_books'); setSelectedCategory('All'); }}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${activeFilterMode === 'all_books'
              ? 'border-[var(--accent-primary)] text-[var(--text-primary)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
          >
            All Books
          </button>
          <button
            onClick={() => { setActiveFilterMode('favorite_books'); setSelectedCategory('All'); }}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${activeFilterMode === 'favorite_books'
              ? 'border-[var(--accent-primary)] text-[var(--text-primary)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
          >
            Favorites
          </button>
          <button
            onClick={() => { setActiveFilterMode('select_category_view'); setSelectedCategory('All'); }}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${activeFilterMode === 'select_category_view'
              ? 'border-[var(--accent-primary)] text-[var(--text-primary)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
          >
            By Category
          </button>
        </div>
      </div>

      {/* Category Grid View */}
      {activeFilterMode === 'select_category_view' ? (
        <div className="animate-slide-up py-8">
          <h3 className="text-sm font-heading font-semibold text-[var(--text-tertiary)] mb-6 tracking-widest uppercase text-center">Select a Genre</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uniqueCategories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setActiveFilterMode('all_books');
                }}
                className={`py-8 px-4 rounded-md text-center transition-all border ${selectedCategory === category
                  ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold'
                  : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                  }`}
              >
                <span className="font-heading text-lg block mb-1">{category}</span>
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                  {category === 'All' ? books.length : books.filter(b => b.category === category).length} items
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        displayedBooks.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] text-2xl mb-6 shadow-sm">
              {activeFilterMode === 'favorite_books' ? '★' : '📖'}
            </div>
            <h3 className="text-xl font-heading text-[var(--text-primary)] mb-2">
              {activeFilterMode === 'favorite_books'
                ? "No favorites found."
                : selectedCategory !== 'All'
                  ? `No books under "${selectedCategory}".`
                  : "Your library is waiting."}
            </h3>
            <p className="text-[var(--text-muted)] text-sm max-w-sm">
              {activeFilterMode === 'favorite_books'
                ? "You haven't marked any books as your favorites yet."
                : "Head to the Home page to start cataloging and expanding your collection."}
            </p>
          </div>
        ) : (
          <div className="animate-slide-up">
            {activeFilterMode === 'all_books' && selectedCategory !== 'All' && (
              <div className="mb-8 border-b border-[var(--border-subtle)] pb-2 flex items-center justify-between">
                <h2 className="text-2xl font-heading text-[var(--text-primary)]">
                  Genre: <span className="text-[var(--accent-primary)] italic">{selectedCategory}</span>
                </h2>
                <span className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-widest bg-[var(--bg-secondary)] px-3 py-1 rounded-full border border-[var(--border-subtle)]">
                  {displayedBooks.length} Books
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
              {displayedBooks.map((book) => (
                <BookCard key={book.id} book={book} onRemove={handleRemoveBook} onToggleFavorite={onToggleFavorite} />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Library;