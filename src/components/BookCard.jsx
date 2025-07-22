import React, { useState, useEffect } from 'react'; // Import useEffect
import { Link } from 'react-router-dom';

const BookCard = ({ book, onRemove, onToggleFavorite }) => {
  const progress = book.totalPages > 0
    ? Math.round((book.currentPage / book.totalPages) * 100)
    : 0;

  // NEW: State to store the random background color
  const [randomBgColor, setRandomBgColor] = useState('');

  // NEW: Function to generate a random hex color
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // NEW: useEffect to set a random background color if no cover image
  useEffect(() => {
    // Check if book.cover is empty, null, or a known placeholder
    const isCoverProvided = book.cover && book.cover.trim() !== '' && !book.cover.includes('placeholder.com');
    if (!isCoverProvided) {
      setRandomBgColor(generateRandomColor());
    } else {
      setRandomBgColor(''); // Clear color if cover is provided
    }
  }, [book.cover]); // Re-run when book.cover changes

  const handleRemoveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmDelete = window.confirm(`Are you sure you want to remove "${book.title}" from your library? This cannot be undone.`);
    if (confirmDelete) {
      onRemove(book.id);
      alert(`"${book.title}" has been removed.`);
    }
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(book.id);
  };

  // Determine if a custom background should be applied instead of an image
  const showColorBackground = !book.cover || book.cover.trim() === '' || book.cover.includes('placeholder.com');

  return (
    <div className="relative block h-full">
      <Link to={`/book/${book.id}`} className="block h-full">
        <div className="bg-white/80 shadow rounded-lg p-4 hover:shadow-xl transition-shadow duration-200 cursor-pointer h-full">
          {showColorBackground ? (
            // NEW: Div for random background color
            <div
              className="w-full h-48 mb-4 rounded flex items-center justify-center text-center text-gray-500 font-semibold text-sm"
              style={{ backgroundColor: randomBgColor }}
            >
              No Cover
            </div>
          ) : (
            // Existing img tag for actual cover image
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-48 object-cover mb-4 rounded"
            />
          )}

          <h3 className="text-lg font-semibold">{book.title}</h3>
          <p className="text-gray-600">{book.author}</p>
          <p className="text-sm mt-1 text-gray-500">{book.category}</p>
          {book.totalPages > 0 && (
            <div className="mt-2 text-sm text-gray-700">
              Progress: {book.currentPage} / {book.totalPages} pages ({progress}%)
              <div className="w-full bg-gray-300 rounded-full h-2.5 mt-1">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          {book.currentPage === book.totalPages && book.totalPages > 0 && (
            <span className="mt-2 inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Completed
            </span>
          )}
        </div>
      </Link>
      {/* Remove Button */}
      <button
        onClick={handleRemoveClick}
        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors duration-200"
        title="Remove book"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Favorite Toggle Button/Indicator */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-2 left-2 p-1 rounded-full shadow-md transition-colors duration-200 ${
          book.isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title={book.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default BookCard;