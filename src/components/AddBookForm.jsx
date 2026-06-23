import React, { useState } from 'react';

const AddBookForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover: '',
    category: '',
    totalPages: '',
    currentPage: 0,
    startedOn: '',
  });

  const [activeSubMode, setActiveSubMode] = useState('initial');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [showError, setShowError] = useState('');

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Thriller',
    'Biography',
    'History',
    'Self-Help',
    'Dystopian',
    'Romance',
    'Horror'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const triggerError = (msg) => {
    setShowError(msg);
    setTimeout(() => setShowError(''), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category) {
      triggerError('Please select a category.');
      return;
    }
    if (!formData.totalPages || isNaN(formData.totalPages) || parseInt(formData.totalPages) <= 0) {
      triggerError('Please enter a valid number of total pages.');
      return;
    }

    const newBook = {
      id: Date.now(),
      ...formData,
      totalPages: parseInt(formData.totalPages),
      currentPage: parseInt(formData.currentPage),
      startedOn: formData.startedOn || new Date().toISOString().split('T')[0],
      finishedOn: null,
      deadline: null,
    };

    onAdd(newBook);

    setFormData({
      title: '',
      author: '',
      cover: '',
      category: '',
      totalPages: '',
      currentPage: 0,
      startedOn: '',
    });
    setSearchResults([]);
    setSearchTerm('');
    setActiveSubMode('initial');
  };

  const searchBooks = async () => {
    if (!searchTerm.trim()) {
      triggerError('Please enter a search term (title or ISBN).');
      return;
    }
    setIsLoadingSearch(true);
    setSearchResults([]);
    setShowError('');

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
      const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=5${apiKey ? `&key=${apiKey}` : ''}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        setSearchResults(data.items.map(item => ({
          id: item.id,
          title: item.volumeInfo.title || 'N/A',
          author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'N/A',
          cover: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : '',
          category: item.volumeInfo.categories ? item.volumeInfo.categories[0] : 'Uncategorized',
          totalPages: item.volumeInfo.pageCount || 0,
        })));
      } else {
        setSearchResults([]);
        triggerError('No books found for your search.');
      }
    } catch (error) {
      console.error("Error searching Google Books API:", error);
      triggerError("Failed to search books. Please try again later.");
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const selectBookFromSearch = (book) => {

    setFormData({
      title: book.title || '',
      author: book.author || '',
      cover: book.cover || '',
      category: book.category || '',
      totalPages: book.totalPages || '',
      currentPage: 0,
      startedOn: new Date().toISOString().split('T')[0],
    });
    setSearchResults([]);
    setSearchTerm('');
    setActiveSubMode('manual');
  };

  return (
    <div className="w-full space-y-4">
      {showError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium">{showError}</span>
        </div>
      )}

      {activeSubMode === 'initial' && (
        <div className="flex flex-col space-y-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveSubMode('search')}
            className="flex items-center justify-center gap-2 bg-[var(--accent-primary)] text-white px-4 py-3 rounded-xl hover:opacity-90 font-semibold transition-all duration-200 shadow-md shadow-[var(--accent-primary)]/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Book
          </button>
          <button
            type="button"
            onClick={() => setActiveSubMode('manual')}
            className="flex items-center justify-center gap-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] px-4 py-3 rounded-xl hover:bg-[var(--bg-tertiary)] font-semibold border border-[var(--border-strong)] transition-all duration-200 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Book Manually
          </button>
        </div>
      )}

      {activeSubMode === 'search' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') searchBooks(); }}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-[var(--accent-primary)] transition-all"
              />
            </div>
            <button
              type="button"
              onClick={searchBooks}
              disabled={isLoadingSearch}
              className="bg-[var(--accent-primary)] hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center shadow-md shadow-[var(--accent-primary)]/10"
            >
              {isLoadingSearch ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Search'}
            </button>
          </div>

          {isLoadingSearch && (
            <div className="space-y-3 mt-4 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-secondary)] divide-y divide-[var(--border-subtle)] overflow-hidden">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-3 p-3 animate-pulse">
                  <div className="w-10 h-14 bg-[var(--bg-tertiary)] rounded flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--bg-tertiary)] rounded w-2/3"></div>
                    <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="mt-4 max-h-60 overflow-y-auto border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-secondary)] divide-y divide-[var(--border-subtle)] custom-scrollbar shadow-inner">
              {searchResults.map((book) => (
                <div
                  key={book.id}
                  onClick={() => selectBookFromSearch(book)}
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors duration-150"
                >
                  {book.cover ? (
                    <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-14 bg-[var(--bg-tertiary)] text-[10px] text-[var(--text-tertiary)] rounded flex items-center justify-center text-center font-bold flex-shrink-0">No Cover</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--text-primary)] truncate text-sm">{book.title}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{book.author}</p>
                  </div>
                </div>
              ))}
              <p className="text-[11px] text-[var(--text-tertiary)] p-2.5 text-center bg-[var(--bg-tertiary)]/50">Click a book to import details.</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => { setActiveSubMode('initial'); setSearchResults([]); setSearchTerm(''); }}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors w-full text-center py-2 underline decoration-[var(--border-strong)] underline-offset-4"
          >
            Cancel and Go Back
          </button>
        </div>
      )}

      {activeSubMode === 'manual' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Book Title *</label>
              <input
                type="text"
                placeholder="e.g. Clean Code"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-transparent border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-[var(--accent-primary)] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Author Name *</label>
              <input
                type="text"
                placeholder="e.g. Robert C. Martin"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full bg-transparent border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-[var(--accent-primary)] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Cover Image URL</label>
              <input
                type="text"
                placeholder="https://example.com/cover.jpg"
                name="cover"
                value={formData.cover}
                onChange={handleChange}
                className="w-full bg-transparent border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-[var(--accent-primary)] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Total Pages *</label>
                <input
                  type="number"
                  placeholder="e.g. 350"
                  name="totalPages"
                  value={formData.totalPages}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full bg-transparent border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-[var(--accent-primary)] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Category *</label>
                <input
                  list="categories-list"
                  name="category"
                  placeholder="e.g. Fiction"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-[var(--accent-primary)] transition-all"
                />
                <datalist id="categories-list">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Started On</label>
              <input
                type="date"
                name="startedOn"
                value={formData.startedOn}
                onChange={handleChange}
                className="w-full bg-transparent border border-[var(--border-strong)] text-[var(--text-primary)] px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-[var(--accent-primary)] transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveSubMode('initial')}
              className="flex-1 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-semibold px-4 py-2.5 rounded-xl border border-[var(--border-strong)] transition-all text-sm"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-[var(--accent-primary)] hover:opacity-90 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm shadow-md shadow-[var(--accent-primary)]/10"
            >
              Add to Library
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddBookForm;