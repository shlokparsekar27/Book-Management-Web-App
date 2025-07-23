import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookDetails = ({ books, onUpdateBook, onToggleFavorite }) => {
    // ... (all existing code from the top of the file remains the same)

    const { id } = useParams();
    const navigate = useNavigate();
    const book = books.find(b => b.id === parseInt(id));
    const currentBookLocalStorageKey = book ? `book_${book.id}_showGoalForm` : null;
    const [sliderCurrentPage, setSliderCurrentPage] = useState(book ? book.currentPage : 0);
    const [newDeadline, setNewDeadline] = useState(book && book.deadline ? new Date(book.deadline) : null);
    const [showGoalForm, setShowGoalForm] = useState(() => {
        return false;
    });

    // --- NEW: State to detect mobile screen size ---
    const [isMobile, setIsMobile] = useState(false);

    // --- NEW: useEffect to check screen size ---
    useEffect(() => {
        const checkScreenSize = () => {
            // 768px is the standard 'md' breakpoint in Tailwind
            setIsMobile(window.innerWidth < 768);
        };

        // Check on initial load
        checkScreenSize();

        // Add event listener for screen resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup function to remove listener
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []); // Empty dependency array ensures this runs only once on mount

    useEffect(() => {
        if (book) {
            setSliderCurrentPage(book.currentPage);
            setNewDeadline(book.deadline ? new Date(book.deadline) : null);
            const storedVisibility = localStorage.getItem(currentBookLocalStorageKey);
            setShowGoalForm(storedVisibility === 'true');
        }
    }, [book, currentBookLocalStorageKey]);

    const [hasUnsavedProgress, setHasUnsavedProgress] = useState(false);
    const [isProgressSaved, setIsProgressSaved] = useState(false);

    useEffect(() => {
        if (book) {
            setHasUnsavedProgress(false);
            setIsProgressSaved(false);
        }
    }, [book]);

    // ... (all handler functions like handleFavoriteClick, handleUpdateProgress, etc. remain the same) ...
    const handleFavoriteClick = () => {
        if (book) onToggleFavorite(book.id);
    };

    if (!book) {
        return <div className="text-center mt-20 text-red-600 text-xl">Book not found!</div>;
    }
    const progress = book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;
    const handleUpdateProgress = () => {
        const confirmSave = window.confirm("Are you sure you want to save your progress?");
        if (!confirmSave) return;
        const pagesReadThisSession = sliderCurrentPage - book.currentPage;
        if (pagesReadThisSession === 0 && book.currentPage === sliderCurrentPage) {
            alert('No change in pages. Current page is ' + book.currentPage + '.');
            setIsProgressSaved(false);
            setHasUnsavedProgress(false);
            return;
        }
        const newCurrentPage = sliderCurrentPage;
        let updatedFinishedOn = book.finishedOn;
        if (newCurrentPage === book.totalPages && newCurrentPage > 0 && !book.finishedOn) {
            updatedFinishedOn = new Date().toISOString().split('T')[0];
        } else if (newCurrentPage < book.totalPages && book.finishedOn) {
            updatedFinishedOn = null;
        }
        const newDailyLogEntry = { date: new Date().toISOString().split('T')[0], pagesRead: pagesReadThisSession, timestamp: new Date().toISOString() };
        const updatedBook = { ...book, currentPage: newCurrentPage, finishedOn: updatedFinishedOn, dailyLog: [...(book.dailyLog ?? []), newDailyLogEntry] };
        onUpdateBook(updatedBook);
        alert(`Progress updated! You are now on page ${updatedBook.currentPage}.`);
        setHasUnsavedProgress(false);
        setIsProgressSaved(true);
    };
    const handlePageChange = (newPage) => {
        setSliderCurrentPage(newPage);
        setHasUnsavedProgress(true);
        setIsProgressSaved(false);
    };
    const handlePageChangeByButton = (amount) => {
        const newPage = sliderCurrentPage + amount;
        handlePageChange(Math.max(0, Math.min(book.totalPages, newPage)));
    };
    const handleSaveDeadline = () => {
        const updatedBook = { ...book, deadline: newDeadline ? newDeadline.toISOString().split('T')[0] : null };
        onUpdateBook(updatedBook);
        alert('Deadline updated!');
        localStorage.setItem(currentBookLocalStorageKey, 'true');
        setShowGoalForm(true);
    };
    const handleReadAgain = () => {
        if (window.confirm("Do you want to reset your progress and read this book again?")) {
            const updatedBook = { ...book, currentPage: 0, finishedOn: null, dailyLog: [] };
            onUpdateBook(updatedBook);
            alert("Progress reset! Happy reading again!");
        }
    };
    const handleResetLog = () => {
        if (window.confirm("Are you sure you want to reset the entire reading log and progress for this book? This cannot be undone.")) {
            const updatedBook = { ...book, currentPage: 0, dailyLog: [], finishedOn: null };
            onUpdateBook(updatedBook);
            setSliderCurrentPage(0);
            setHasUnsavedProgress(false);
            setIsProgressSaved(false);
            alert("Reading log and progress reset!");
            setShowGoalForm(false);
            localStorage.setItem(currentBookLocalStorageKey, 'false');
        }
    };
    let deadlineStatus = null;
    if (book.deadline) {
        const deadlineDate = new Date(book.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (book.finishedOn) {
            const finishedDate = new Date(book.finishedOn);
            if (finishedDate <= deadlineDate) deadlineStatus = <span className="text-green-600 font-semibold">🎉 Goal Succeeded! Finished on time.</span>;
            else deadlineStatus = <span className="text-yellow-600 font-semibold">⏰ Goal Missed. Finished after deadline.</span>;
        } else if (today > deadlineDate) {
            deadlineStatus = <span className="text-red-600 font-semibold">🚨 Deadline Passed!</span>;
        } else {
            const timeLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
            deadlineStatus = <span className="text-blue-600 font-semibold">⏳ {timeLeft} days left until deadline.</span>;
        }
    }
    const handleCancelGoal = () => {
        if (window.confirm("Are you sure you want to cancel setting the goal? Any unsaved changes will be lost.")) {
            setNewDeadline(book.deadline ? new Date(book.deadline) : null);
            setShowGoalForm(false);
            localStorage.setItem(currentBookLocalStorageKey, 'false');
        }
    };


    return (
        <div className="relative min-h-screen bg-[url('/images/img5.jpg')] bg-cover bg-center bg-no-repeat md:fixed md:inset-0">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="container mx-auto p-6 bg-white/50 shadow-lg rounded-lg mt-20 max-w-4xl pt-4 relative z-10">
                {/* ... (The top part of the return statement is the same) ... */}
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => navigate(-1)} className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">&larr; Back to Library</button>
                    <button onClick={handleResetLog} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Reset Log</button>
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="relative">
                        <img src={book.cover} alt={book.title} className="w-48 h-64 object-cover rounded-lg shadow-md flex-shrink-0" />
                        <button onClick={handleFavoriteClick} className={`absolute top-2 right-2 p-2 rounded-full text-white transition-colors duration-200 ${book.isFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'}`} title={book.isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                    <div className="flex-1">
                        {/* ... (book title, author, progress, etc. are the same) ... */}
                        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                        <p className="text-xl text-gray-700 mb-2">by {book.author}</p>
                        <p className="text-md text-gray-600 mb-4">Category: {book.category}</p>
                        <div className="mb-4 text-gray-700">
                            <p><span className="font-semibold">Total Pages:</span> {book.totalPages}</p>
                            <p><span className="font-semibold">Current Page:</span> {book.currentPage}</p>
                            {book.startedOn && <p><span className="font-semibold">Started On:</span> {book.startedOn}</p>}
                            {book.finishedOn && <p><span className="font-semibold">Finished On:</span> {book.finishedOn}</p>}
                            <div className="mt-4">
                                <p className="font-semibold">Reading Progress ({progress}%){": "} {book.currentPage === book.totalPages && book.totalPages > 0 ? (<span className="text-green-600">🥳 Book Completed!</span>) : ("")}</p>
                                <div className="w-full bg-gray-400 rounded-full h-2.5 mt-1"><div className="bg-cyan-700 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mt-6">
                            <h3 className="text-xl font-semibold mb-3">Update Progress</h3>
                            <div className="flex items-center gap-4 mb-3">
                                <button onClick={() => handlePageChangeByButton(-1)} className="bg-cyan-700 text-white hover:bg-cyan-800 rounded px-3 py-1 text-lg" aria-label="Decrease page">-</button>
                                <span className="text-lg font-medium min-w-[30px] text-center">{sliderCurrentPage}</span>
                                <input type="range" min="0" max={book.totalPages} value={sliderCurrentPage} onChange={(e) => handlePageChange(parseInt(e.target.value))} className="flex-grow h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer" />
                                <span className="text-lg font-medium min-w-[30px] text-center">{book.totalPages}</span>
                                <button onClick={() => handlePageChangeByButton(1)} className="bg-cyan-700 text-white hover:bg-cyan-800 rounded px-3 py-1 text-lg" aria-label="Increase page">+</button>
                            </div>
                            <button onClick={handleUpdateProgress} className={`px-4 py-2 rounded w-full ${isProgressSaved ? 'bg-cyan-800 text-white hover:bg-cyan-900' : 'bg-cyan-700 text-white hover:bg-cyan-800'}`}>{isProgressSaved ? 'Saved' : 'Save'}</button>
                            {book.currentPage === book.totalPages && book.totalPages > 0 && (<button onClick={handleReadAgain} className="mt-3 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 w-full">Read Again</button>)}
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
                                            // --- MODIFIED: withPortal is now conditional ---
                                            withPortal={isMobile}
                                            selected={newDeadline}
                                            onChange={(date) => setNewDeadline(date)}
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