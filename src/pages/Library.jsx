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

    const shouldBeFixedBackground = displayedBooks.length <= 5 || activeFilterMode === 'select_category_view';
    const backgroundClasses = `bg-[url('/images/img5.jpg')] bg-cover bg-center bg-no-repeat`;
    // --- MODIFIED LINE ---
    const positioningClasses = `relative min-h-[calc(100vh-64px)] pt-16 ${shouldBeFixedBackground ? "md:fixed md:inset-0 md:p-0 md:min-h-0" : ""}`;

    return (
        <div className={`${positioningClasses} ${backgroundClasses}`}>
            <div className="absolute inset-0 bg-black opacity-30"></div>

            <div className="relative z-10 py-10 px-4 sm:px-6">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-white mt-6 sm:mt-8 mb-6 sm:mb-7">Your Library</h2>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                    <button
                        onClick={() => { setActiveFilterMode('all_books'); setSelectedCategory('All'); }}
                        className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition-colors ${
                            activeFilterMode === 'all_books' ? 'bg-cyan-700 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        All Books
                    </button>
                    <button
                        onClick={() => { setActiveFilterMode('favorite_books'); setSelectedCategory('All'); }}
                        className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition-colors ${
                            activeFilterMode === 'favorite_books' ? 'bg-cyan-700 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Favorites
                    </button>
                    <button
                        onClick={() => { setActiveFilterMode('select_category_view'); setSelectedCategory('All'); }}
                        className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-semibold transition-colors ${
                            activeFilterMode === 'select_category_view' ? 'bg-cyan-700 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Category
                    </button>
                </div>

                {/* Category Selector */}
                {activeFilterMode === 'select_category_view' ? (
                    <div className="mb-8 text-center bg-white/80 p-5 sm:p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Select a Category:</h3>
                        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
                            {uniqueCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setActiveFilterMode('all_books');
                                    }}
                                    className={`w-full px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
                                        selectedCategory === category
                                            ? (category === 'All'
                                                ? 'bg-gray-200 text-gray-700 hover:bg-cyan-700 hover:text-white'
                                                : 'bg-cyan-700 text-white shadow-md')
                                            : 'bg-gray-200 text-gray-700 hover:bg-cyan-700 hover:text-white'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    displayedBooks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-6 sm:p-10 bg-white/80 rounded-xl shadow-lg max-w-2xl mx-auto text-gray-800">
                            <p className="text-lg sm:text-xl text-gray-700 font-semibold mb-4 text-center">
                                {activeFilterMode === 'favorite_books'
                                    ? "You don't have any favorite books yet!"
                                    : selectedCategory !== 'All'
                                        ? `No books found for category "${selectedCategory}"`
                                        : "Your library is currently empty! Add a book from the Home page."}
                            </p>
                            <p className="text-gray-600 text-sm sm:text-lg text-center">
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