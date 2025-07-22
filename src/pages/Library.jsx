import React, { useState } from 'react';
import BookCard from '../components/BookCard';

const Library = ({ books, handleRemoveBook, onToggleFavorite }) => {
    // Renamed showFavorites to activeFilterMode for clarity, initialized to 'all_books'
    // 'all_books': showing all books, potentially filtered by category
    // 'favorite_books': showing only favorites, category filter is ignored
    // 'select_category_view': showing only category buttons, no books displayed
    const [activeFilterMode, setActiveFilterMode] = useState('all_books');
    const [selectedCategory, setSelectedCategory] = useState('All'); // 'All' means no category filter active

    // Dynamically get unique categories from all books for the category buttons
    const uniqueCategories = ['All', ...new Set(books.map(book => book.category))].sort();

    // Filter books based on active mode and selected category
    const displayedBooks = books.filter(book => {
        // If in 'select_category_view' mode, we don't display any books yet.
        if (activeFilterMode === 'select_category_view') {
            return false; // No books are displayed when categories are being selected
        }

        // Filter by Favorites if activeFilterMode is 'favorite_books'
        const matchesFavorites = activeFilterMode === 'favorite_books' ? book.isFavorite : true;

        // Filter by Category if activeFilterMode is 'all_books' and a specific category is selected
        const matchesCategory = activeFilterMode === 'all_books' && selectedCategory !== 'All'
            ? book.category === selectedCategory
            : true;

        return matchesFavorites && matchesCategory;
    });

    // CORRECTED: Determine if the background should be fixed or relative
    // It should be fixed if displayedBooks are few (<=5) OR if we are explicitly in category selection view.
    const shouldBeFixedBackground = displayedBooks.length <= 5 || activeFilterMode === 'select_category_view'; 
    const backgroundClasses = `bg-[url('/images/img5.jpg')] bg-cover bg-center bg-no-repeat`;
    const positioningClasses = shouldBeFixedBackground ? "fixed inset-0" : "relative min-h-[calc(100vh-64px)] pt-16";

    return (
        <div className={`${positioningClasses} ${backgroundClasses}`}>
            <div className="absolute inset-0 bg-black opacity-30"></div>

            <div className="relative z-10 py-10 px-6">
                <h2 className="text-4xl font-extrabold text-center text-white mt-8 mb-7">Your Library</h2>

                {/* Tabs/Buttons for All Books, Favorites, and Category */}
                <div className="flex justify-center mb-8 space-x-4">
                    <button
                        onClick={() => { setActiveFilterMode('all_books'); setSelectedCategory('All'); }} // Set mode to 'all_books'
                        className={`px-6 py-3 rounded-full text-lg font-semibold transition-colors ${
                            activeFilterMode === 'all_books' ? 'bg-cyan-700 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        All Books
                    </button>
                    <button
                        onClick={() => { setActiveFilterMode('favorite_books'); setSelectedCategory('All'); }} // Set mode to 'favorite_books'
                        className={`px-6 py-3 rounded-full text-lg font-semibold transition-colors ${
                            activeFilterMode === 'favorite_books' ? 'bg-cyan-700 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Favorites
                    </button>
                    {/* Category Filter Toggle Button */}
                    <button
                        onClick={() => { setActiveFilterMode('select_category_view'); setSelectedCategory('All'); }} // Set mode to 'select_category_view'
                        className={`px-6 py-3 rounded-full text-lg font-semibold transition-colors ${
                            activeFilterMode === 'select_category_view' ? 'bg-cyan-700 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Category
                    </button>
                </div>

                {/* NEW: Category Filter List (conditionally rendered) */}
                {activeFilterMode === 'select_category_view' ? (
                    <div className="mb-8 text-center bg-white/80 p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Select a Category:</h3>
                        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2"> {/* Changed to flex-col for w-full, reduced gap */}
                            {uniqueCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setActiveFilterMode('all_books'); // Go back to 'all_books' view with category filter applied
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg text-base font-semibold transition-colors ${
                                        selectedCategory === category // This condition checks if it's the selected category
                                            ? (category === 'All' // Check if it's 'All' AND selected
                                                ? 'bg-gray-200 text-gray-700 hover:bg-cyan-700  hover:text-white' // Apply default non-selected style if 'All' is selected
                                                : 'bg-cyan-700 text-white shadow-md' // Apply selected style for others
                                              )
                                            : 'bg-gray-200 text-gray-700 hover:bg-cyan-700 hover:text-white' // Apply default non-selected style
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : ( /* Only render book cards if not in 'select_category_view' mode */
                    displayedBooks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-10 bg-white/80 rounded-xl shadow-lg max-w-2xl mx-auto text-gray-800">
                            <p className="text-xl text-gray-700 font-semibold mb-4">
                                {activeFilterMode === 'favorite_books'
                                    ? "You don't have any favorite books yet!"
                                    : selectedCategory !== 'All'
                                        ? `No books found for category "${selectedCategory}"`
                                        : "Your library is currently empty! Add a book from the Home page."}
                            </p>
                            <p className="text-gray-600 text-lg text-center">
                                {activeFilterMode === 'favorite_books'
                                    ? "Mark a book as favorite from its details page."
                                    : selectedCategory !== 'All'
                                        ? "Try selecting a different category or adding more books."
                                        : "Start by adding a new book from the Home page."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {displayedBooks.map((book) => (
                                <BookCard key={book.id} book={book} onRemove={handleRemoveBook} onToggleFavorite={onToggleFavorite} />
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Library;