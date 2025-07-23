import React, { useState, useEffect } from 'react';

const AddBookForm = ({ onAdd }) => { // Removed prefillData prop as it's no longer needed here
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover: '',
    category: '',
    totalPages: '',
    currentPage: 0,
    startedOn: '',
  });

  // NEW: State to manage the active sub-mode within AddBookForm
  // 'initial': show choice buttons
  // 'search': show search section
  // 'manual': show manual form fields
  const [activeSubMode, setActiveSubMode] = useState('initial'); 

  // States for Google Books API search (kept here as per previous decision)
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  // useEffect to handle pre-filling formData based on search selection
  // This useEffect is now triggered by selectBookFromSearch directly
  useEffect(() => {
    // This useEffect is primarily for initial setup or external changes,
    // actual pre-filling happens in selectBookFromSearch
  }, []); // Empty dependency array, as prefillData prop is removed

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert('Please select a category.');
      return;
    }
    if (!formData.totalPages || isNaN(formData.totalPages) || parseInt(formData.totalPages) <= 0) {
      alert('Please enter a valid number of total pages.');
      return;
    }

    const newBook = {
      id: Date.now(),
      ...formData,
      totalPages: parseInt(formData.totalPages),
      currentPage: parseInt(formData.currentPage),
      startedOn: formData.startedOn || null,
      finishedOn: null,
      deadline: null,
    };

    onAdd(newBook);

    // Reset form, search results, and return to initial mode
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
    setActiveSubMode('initial'); // Return to initial choice after adding book
  };

  // Function to search books via Google Books API
  const searchBooks = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a search term (title or ISBN).');
      return;
    }
    setIsLoadingSearch(true);
    setSearchResults([]);

    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=5`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        setSearchResults(data.items.map(item => ({
          id: item.id,
          title: item.volumeInfo.title || 'N/A',
          author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'N/A',
          cover: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x190?text=No+Cover',
          category: item.volumeInfo.categories ? item.volumeInfo.categories[0] : 'Uncategorized',
          totalPages: item.volumeInfo.pageCount || 0,
        })));
      } else {
        setSearchResults([]);
        alert('No books found for your search.');
      }
    } catch (error) {
      console.error("Error searching Google Books API:", error);
      alert("Failed to search books. Please try again later.");
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // Function to select a book from search results to pre-fill the form
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
    setActiveSubMode('manual'); // Switch to manual mode to show form with pre-filled data
  };


  return (
    <form onSubmit={handleSubmit} className="bg-transparent rounded-xl shadow-lg space-y-4 w-full max-w-md">

      {/* NEW: Initial choice buttons */}
      {activeSubMode === 'initial' && (
        <div className="flex flex-col space-y-4 pt-4"> {/* Added pt-4 for spacing */}
          <button
            type="button" // Important: set type="button" to prevent form submission
            onClick={() => setActiveSubMode('search')}
            className="bg-cyan-800 text-white px-4 py-2 rounded hover:bg-cyan-900 w-full text-lg font-semibold"
          >
            Search for a Book
          </button>
          <button
            type="button" // Important: set type="button" to prevent form submission
            onClick={() => setActiveSubMode('manual')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full text-lg font-semibold"
          >
            Add Manually
          </button>
        </div>
      )}

      {/* NEW: Search Section (conditionally rendered) */}
{activeSubMode === 'search' && (
  <>
    <div className="flex flex-col gap-2 mb-2 md:flex-row md:items-center w-full">

      <input
        type="text"
        placeholder="Search by title or ISBN..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={(e) => { if (e.key === 'Enter') searchBooks(); }}
        className="border p-2 rounded bg-white/30 placeholder-cyan-950 text-cyan-950 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full"
      />

      <button
        type="button"
        onClick={searchBooks}
        disabled={isLoadingSearch}
        className="bg-cyan-800 text-white px-4 py-2 rounded hover:bg-cyan-900 disabled:opacity-50 w-full md:w-auto"
      >
        {isLoadingSearch ? 'Searching...' : 'Search'}
      </button>
    </div>

    {/* Search Results Display */}
    {searchResults.length > 0 && (
      <div className="mt-4 max-h-60 overflow-y-auto border border-gray-300 rounded-lg bg-white/20">
        {searchResults.map((book) => (
          <div
            key={book.id}
            onClick={() => selectBookFromSearch(book)}
            className="flex items-center gap-3 p-3 border-b border-gray-400 cursor-pointer hover:bg-white/30 transition"
          >
            <img src={book.cover} alt={book.title} className="w-12 h-16 object-cover rounded" />
            <div>
              <p className="font-semibold text-cyan-950">{book.title}</p>
              <p className="text-sm text-gray-700">{book.author}</p>
            </div>
          </div>
        ))}
        {searchResults.length > 0 && <p className="text-xs text-cyan-950 p-2">Click a book to pre-fill the form.</p>}
      </div>
    )}

    {/* Button to go back to initial choice */}
    <button
      type="button"
      onClick={() => { setActiveSubMode('initial'); setSearchResults([]); setSearchTerm(''); }}
      className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
    >
      Back to Choices
    </button>
  </>
)}


      {/* NEW: Manual Add Section (conditionally rendered) */}
      {activeSubMode === 'manual' && (
        <>
          <h3 className="text-lg font-semibold text-cyan-950">Enter Book Details Manually:</h3> {/* Changed header */}
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-white/30 placeholder-cyan-950 text-cyan-950 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <input
            type="text"
            placeholder="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full bg-white/30 placeholder-cyan-950 text-cyan-950 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <input
            type="text" // Changed to text as cover is URL
            placeholder="Cover Image URL"
            name="cover"
            value={formData.cover}
            onChange={handleChange}
            className="w-full bg-white/30 placeholder-cyan-950 text-cyan-950 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <input
            type="number"
            placeholder="Total Pages"
            name="totalPages"
            value={formData.totalPages}
            onChange={handleChange}
            required
            min="0"
            className="w-full bg-white/30 placeholder-cyan-950 text-cyan-950 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full bg-white/30 placeholder-cyan-950 text-cyan-950 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="" disabled className="bg-gray-700 text-gray-300">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-700 text-white">
                {cat}
              </option>
            ))}
          </select>

          <input
            type="date"
            placeholder="Started On (Optional)"
            name="startedOn"
            value={formData.startedOn}
            onChange={handleChange}
            className="w-full bg-white/30 placeholder-cyan-950 text-cyan-950 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <button
            type="submit"
            className="bg-cyan-800 text-white px-4 py-2 rounded hover:bg-cyan-900 w-full"
          >
            Add Book
          </button>

          {/* Button to go back to initial choice */}
          <button
            type="button"
            onClick={() => setActiveSubMode('initial')}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
          >
            Back to Choices
          </button>
        </>
      )}
    </form>
  );
};

export default AddBookForm;