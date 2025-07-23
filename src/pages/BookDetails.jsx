import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// BookDetails now accepts onToggleFavorite prop
const BookDetails = ({ books, onUpdateBook, onToggleFavorite }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const book = books.find(b => b.id === parseInt(id));

    // Define localStorageKey based on book.id. This must be stable.
    // Ensure 'book' is available before creating the key, otherwise it could be 'book_undefined_showGoalForm'
    const currentBookLocalStorageKey = book ? `book_${book.id}_showGoalForm` : null; // Set to null if book not yet available

    // Initialize states
    const [sliderCurrentPage, setSliderCurrentPage] = useState(book ? book.currentPage : 0);
    const [newDeadline, setNewDeadline] = useState(book && book.deadline ? new Date(book.deadline) : null);

    // *** FIX FOR showGoalForm Initialization & Sync ***
    // showGoalForm is now initialized ONLY from localStorage, defaulting to false.
    // Its persistence is strictly managed by localStorage.setItem/getItem on user actions.
    const [showGoalForm, setShowGoalForm] = useState(() => {
        // We can't rely on 'book' being available here for localStorageKey on initial render.
        // So, we default to false (show 'Set Goal' button) and useEffect will correct it once 'book' is loaded.
        return false;
    });

    // Effect to synchronize states when 'book' prop changes (e.g., after save/update from parent)
    // This useEffect will now take care of setting showGoalForm correctly AFTER 'book' is loaded.
    useEffect(() => {
        if (book) {
            setSliderCurrentPage(book.currentPage);
            setNewDeadline(book.deadline ? new Date(book.deadline) : null);

            // Now that 'book' and 'currentBookLocalStorageKey' are stable, read from localStorage.
            // This is the definitive logic for initial and subsequent visibility.
            const storedVisibility = localStorage.getItem(currentBookLocalStorageKey);
            setShowGoalForm(storedVisibility === 'true'); // Strictly adhere to localStorage
        }
    }, [book, currentBookLocalStorageKey]); // Depend on 'book' and the unique key

    // New states for Save button feedback (from previous turn)
    const [hasUnsavedProgress, setHasUnsavedProgress] = useState(false);
    const [isProgressSaved, setIsProgressSaved] = useState(false);

    // Effect to reset Save button states on book load (from previous turn)
    useEffect(() => {
        if (book) {
            setHasUnsavedProgress(false);
            setIsProgressSaved(false);
        }
    }, [book]);

    // NEW: Handle favorite toggle click
    const handleFavoriteClick = () => {
        if (book) {
            onToggleFavorite(book.id); // Call the function from App.jsx
        }
    };

    if (!book) {
        return <div className="text-center mt-20 text-red-600 text-xl">Book not found!</div>;
    }

    // Calculate progress for display
    const progress = book.totalPages > 0
        ? Math.round((book.currentPage / book.totalPages) * 100)
        : 0;

    // Function to handle updating pages via slider
    const handleUpdateProgress = () => {
        // Confirmation popup
        const confirmSave = window.confirm("Are you sure you want to save your progress?");
        if (!confirmSave) {
            return; // If user cancels, stop
        }

        const pagesReadThisSession = sliderCurrentPage - book.currentPage;

        if (pagesReadThisSession === 0 && book.currentPage === sliderCurrentPage) {
            alert('No change in pages. Current page is ' + book.currentPage + '.');
            setIsProgressSaved(false);
            setHasUnsavedProgress(false);
            return;
        }

        const newCurrentPage = sliderCurrentPage;

        // Automatically set finishedOn date if book is completed
        let updatedFinishedOn = book.finishedOn;
        if (newCurrentPage === book.totalPages && newCurrentPage > 0 && !book.finishedOn) {
            updatedFinishedOn = new Date().toISOString().split('T')[0];
        } else if (newCurrentPage < book.totalPages && book.finishedOn) {
            // If moved back from completed, clear finishedOn date
            updatedFinishedOn = null;
        }

        // Create a new daily log entry only if pages were actually read (moved forward or backward)
        const newDailyLogEntry = {
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            pagesRead: pagesReadThisSession, // Can be negative if going backwards
            timestamp: new Date().toISOString()
        };

        const updatedBook = {
            ...book,
            currentPage: newCurrentPage,
            finishedOn: updatedFinishedOn,
            // Only add to log if actual pages were read in this session (forward or backward)
            dailyLog: [...(book.dailyLog ?? []), newDailyLogEntry]

        };

        onUpdateBook(updatedBook); // Call the function passed from App.jsx to update global state
        alert(`Progress updated! You are now on page ${updatedBook.currentPage}.`);

        // Set states for button feedback after successful save
        setHasUnsavedProgress(false);
        setIsProgressSaved(true);
    };

    // Handler for Increase/Decrease buttons and Slider change
    const handlePageChange = (newPage) => {
        setSliderCurrentPage(newPage);
        setHasUnsavedProgress(true); // Indicate there are unsaved changes
        setIsProgressSaved(false); // Clear saved status
    };

    const handlePageChangeByButton = (amount) => {
        const newPage = sliderCurrentPage + amount;
        handlePageChange(Math.max(0, Math.min(book.totalPages, newPage)));
    };


    // Handle deadline update
    const handleDeadlineChange = (date) => {
        setNewDeadline(date);
    };

    const handleSaveDeadline = () => {
        const updatedBook = {
            ...book,
            deadline: newDeadline ? newDeadline.toISOString().split('T')[0] : null
        };
        onUpdateBook(updatedBook);
        alert('Deadline updated!');
        localStorage.setItem(currentBookLocalStorageKey, 'true');
        setShowGoalForm(true); // Keep the form open
    };

    // Function to handle "Read Again"
    const handleReadAgain = () => {
        const confirmReadAgain = window.confirm("Do you want to reset your progress and read this book again?");
        if (confirmReadAgain) {
            const updatedBook = {
                ...book,
                currentPage: 0,
                finishedOn: null,
                dailyLog: [],
            };
            onUpdateBook(updatedBook);
            alert("Progress reset! Happy reading again!");
        }
    };

    // Function to handle "Reset Log"
    const handleResetLog = () => {
        const confirmReset = window.confirm("Are you sure you want to reset the entire reading log and progress for this book? This cannot be undone.");
        if (confirmReset) {
            const updatedBook = {
                ...book,
                currentPage: 0,
                dailyLog: [],
                finishedOn: null,
            };
            onUpdateBook(updatedBook);
            setSliderCurrentPage(0);
            setHasUnsavedProgress(false);
            setIsProgressSaved(false);
            alert("Reading log and progress reset!");
            setShowGoalForm(false);
            localStorage.setItem(currentBookLocalStorageKey, 'false'); // Persist hidden state
        }
    };

    // Calculate deadline status
    let deadlineStatus = null;
    if (book.deadline) {
        const deadlineDate = new Date(book.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (book.finishedOn) {
            const finishedDate = new Date(book.finishedOn);
            if (finishedDate <= deadlineDate) {
                deadlineStatus = <span className="text-green-600 font-semibold">🎉 Goal Succeeded! Finished on time.</span>;
            } else {
                deadlineStatus = <span className="text-yellow-600 font-semibold">⏰ Goal Missed. Finished after deadline.</span>;
            }
        } else if (today > deadlineDate) {
            deadlineStatus = <span className="text-red-600 font-semibold">🚨 Deadline Passed!</span>;
        } else {
            const timeLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
            deadlineStatus = <span className="text-blue-600 font-semibold">⏳ {timeLeft} days left until deadline.</span>;
        }
    }

    // Handle Cancel Goal with confirmation popup
    const handleCancelGoal = () => {
        const confirmCancel = window.confirm("Are you sure you want to cancel setting the goal? Any unsaved changes will be lost.");
        if (confirmCancel) {
            setNewDeadline(book.deadline ? new Date(book.deadline) : null);
            setShowGoalForm(false); // Hide the form
            localStorage.setItem(currentBookLocalStorageKey, 'false'); // Persist the hidden state
        }
    };


    return (
        <div className="fixed inset-0 bg-[url('/images/img5.jpg')] bg-cover bg-center bg-no-repeat">
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="container mx-auto p-6 bg-white/50 shadow-lg rounded-lg mt-20 max-w-4xl pt-4 relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                        &larr; Back to Library
                    </button>
                    {/* Reading Log History - Always visible */}
                    <button
                        onClick={handleResetLog}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Reset Log
                    </button>
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="relative"> {/* Added relative for favorite button positioning */}
                        <img
                            src={book.cover}
                            alt={book.title}
                            className="w-48 h-64 object-cover rounded-lg shadow-md flex-shrink-0"
                        />
                        
                        {/* NEW: Favorite button/icon */}
                        <button
                            onClick={handleFavoriteClick} // ADD this onClick handler
                            className={`absolute top-2 right-2 p-2 rounded-full text-white transition-colors duration-200 ${
                                book.isFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'
                            }`}
                            title={book.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        >
                            {/* Heart SVG icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                        <p className="text-xl text-gray-700 mb-2">by {book.author}</p>
                        <p className="text-md text-gray-600 mb-4">Category: {book.category}</p>

                        <div className="mb-4 text-gray-700">
                            <p><span className="font-semibold">Total Pages:</span> {book.totalPages}</p>
                            <p><span className="font-semibold">Current Page:</span> {book.currentPage}</p>
                            {book.startedOn && <p><span className="font-semibold">Started On:</span> {book.startedOn}</p>}
                            {book.finishedOn && <p><span className="font-semibold">Finished On:</span> {book.finishedOn}</p>}

                            {/* Progress Bar */}
                            <div className="mt-4">
                                <p className="font-semibold">
                                    Reading Progress ({progress}%){":   "}
                                    {book.currentPage === book.totalPages && book.totalPages > 0 ? (
                                        <span className="text-green-600">🥳 Book Completed!</span>
                                    ) : (
                                        ""
                                    )}
                                </p>
                                <div className="w-full bg-gray-400 rounded-full h-2.5 mt-1">
                                    <div
                                        className="bg-cyan-700 h-2.5 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Slider Section with + and - buttons */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mt-6">
                            <h3 className="text-xl font-semibold mb-3">Update Progress</h3>
                            <div className="flex items-center gap-4 mb-3">
                                <button
                                    onClick={() => handlePageChangeByButton(-1)}
                                    className="bg-cyan-700 text-white hover:bg-cyan-800 rounded px-3 py-1 text-lg"
                                    aria-label="Decrease page"
                                >
                                    -
                                </button>
                                <span className="text-lg font-medium min-w-[30px] text-center">{sliderCurrentPage}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max={book.totalPages}
                                    value={sliderCurrentPage}
                                    onChange={(e) => handlePageChange(parseInt(e.target.value))} // Use new handler
                                    className="flex-grow h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-lg font-medium min-w-[30px] text-center">{book.totalPages}</span>
                                <button
                                    onClick={() => handlePageChangeByButton(1)}
                                    className="bg-cyan-700 text-white hover:bg-cyan-800 rounded px-3 py-1 text-lg"
                                    aria-label="Increase page"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleUpdateProgress}
                                // Conditional classes for button text and color
                                className={`px-4 py-2 rounded w-full ${isProgressSaved ? 'bg-cyan-800 text-white hover:bg-cyan-900' : 'bg-cyan-700 text-white hover:bg-cyan-800'
                                    }`}
                            >
                                {isProgressSaved ? 'Saved' : 'Save'}
                            </button>
                            {book.currentPage === book.totalPages && book.totalPages > 0 && (
                                <button
                                    onClick={handleReadAgain}
                                    className="mt-3 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 w-full"
                                >
                                    Read Again
                                </button>
                            )}
                        </div>


                        {/* Deadline Goal Section - Conditional Display */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mt-6">
                            {!showGoalForm ? (
                                <button
                                    onClick={() => {
                                        setShowGoalForm(true);
                                        localStorage.setItem(currentBookLocalStorageKey, 'true');
                                    }}
                                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 w-full"
                                >
                                    Set Goal
                                </button>
                            ) : (
                                <>
                                    <h3 className="text-xl font-semibold mb-3">Set Reading Goal</h3>
                                    <div className="flex flex-col sm:flex-row gap-2 mb-3 items-center">
                                        <DatePicker
                                            selected={newDeadline}
                                            onChange={handleDeadlineChange}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Select deadline"
                                            className="w-full sm:w-auto border p-2 rounded"
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                        />
                                        <button
                                            onClick={handleSaveDeadline}
                                            className="px-4 py-2 rounded bg-cyan-700 text-white hover:bg-cyan-800 w-full sm:w-auto"
                                        >
                                            Set Deadline
                                        </button>
                                        <button
                                            onClick={handleCancelGoal}
                                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    {deadlineStatus && <p className="mt-2 text-sm">{deadlineStatus}</p>}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;