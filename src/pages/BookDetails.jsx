import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookDetails = ({ books, onUpdateBook, onToggleFavorite }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const book = books.find(b => b.id === parseInt(id) || b.id === id); 
    const currentBookLocalStorageKey = book ? `book_${book.id}_showGoalForm` : null;

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const parts = isoDate.split('-');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return isoDate;
    };
    
    const [sliderCurrentPage, setSliderCurrentPage] = useState(book ? book.currentPage : 0);
    const [newDeadline, setNewDeadline] = useState(book && book.deadline ? new Date(book.deadline) : null);
    const [showGoalForm, setShowGoalForm] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null });

    useEffect(() => {
        const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        if (book) {
            setSliderCurrentPage(book.currentPage);
            setNewDeadline(book.deadline ? new Date(book.deadline) : null);
            const storedVisibility = localStorage.getItem(currentBookLocalStorageKey);
            setShowGoalForm(storedVisibility === 'true');
        }
    }, [book, currentBookLocalStorageKey]);

    if (!book) {
        return (
            <div className="text-center py-32 animate-fade-in">
                <p className="text-[var(--text-muted)] font-heading text-xl mb-6">This volume could not be found.</p>
                <button onClick={() => navigate('/library')} className="bg-[var(--bg-secondary)] text-[var(--text-primary)] px-6 py-2 rounded-sm border border-[var(--border-strong)] hover:border-[var(--accent-primary)] transition-colors">
                    Return to Library
                </button>
            </div>
        );
    }

    const progress = book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;
    
    const handleFavoriteClick = () => onToggleFavorite(book.id);

    const handleUpdateProgress = () => {
        const pagesReadThisSession = sliderCurrentPage - book.currentPage;
        if (pagesReadThisSession === 0 && book.currentPage === sliderCurrentPage) return;

        setConfirmModal({
            show: true,
            title: 'Log Reading Session',
            message: `Save progress to page ${sliderCurrentPage}? This logs ${Math.abs(pagesReadThisSession)} pages for today's session.`,
            onConfirm: () => {
                const newCurrentPage = sliderCurrentPage;
                let updatedFinishedOn = book.finishedOn;
                
                if (newCurrentPage === book.totalPages && newCurrentPage > 0 && !book.finishedOn) {
                    updatedFinishedOn = new Date().toISOString().split('T')[0];
                } else if (newCurrentPage < book.totalPages && book.finishedOn) {
                    updatedFinishedOn = null;
                }
                
                const newDailyLogEntry = { 
                    date: new Date().toISOString().split('T')[0], 
                    pagesRead: pagesReadThisSession, 
                    timestamp: new Date().toISOString() 
                };
                
                const updatedBook = { 
                    ...book, 
                    currentPage: newCurrentPage, 
                    finishedOn: updatedFinishedOn, 
                    dailyLog: [...(book.dailyLog ?? []), newDailyLogEntry] 
                };
                
                onUpdateBook(updatedBook);
            }
        });
    };

    const handlePageChange = (newPage) => setSliderCurrentPage(newPage);
    const handlePageChangeByButton = (amount) => {
        const newPage = sliderCurrentPage + amount;
        handlePageChange(Math.max(0, Math.min(book.totalPages, newPage)));
    };

    const handleSaveDeadline = () => {
        const updatedBook = { ...book, deadline: newDeadline ? newDeadline.toISOString().split('T')[0] : null };
        onUpdateBook(updatedBook);
        localStorage.setItem(currentBookLocalStorageKey, 'true');
        setShowGoalForm(true);
    };



    const handleResetLog = () => {
        setConfirmModal({
            show: true,
            title: 'Reset Reading Log',
            message: 'Delete entire reading session history and reset progress? This is permanent.',
            onConfirm: () => {
                const updatedBook = { ...book, currentPage: 0, dailyLog: [], finishedOn: null };
                onUpdateBook(updatedBook);
                setSliderCurrentPage(0);
                setShowGoalForm(false);
                localStorage.setItem(currentBookLocalStorageKey, 'false');
            }
        });
    };

    const handleCancelGoal = () => {
        setNewDeadline(book.deadline ? new Date(book.deadline) : null);
        setShowGoalForm(false);
        localStorage.setItem(currentBookLocalStorageKey, 'false');
    };

    let deadlineStatus = null;
    if (book.deadline) {
        const deadlineDate = new Date(book.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (book.finishedOn) {
            const finishedDate = new Date(book.finishedOn);
            if (finishedDate <= deadlineDate) {
                deadlineStatus = <span className="text-emerald-500 font-semibold">Goal Succeeded! Finished on time.</span>;
            } else {
                deadlineStatus = <span className="text-amber-600 font-semibold">Goal Missed. Finished after deadline.</span>;
            }
        } else if (today > deadlineDate) {
            deadlineStatus = <span className="text-red-500 font-semibold">Deadline Passed!</span>;
        } else {
            const timeLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
            deadlineStatus = <span className="text-[var(--accent-primary)] font-semibold">{timeLeft} days left until deadline.</span>;
        }
    }

    const hasCover = book.cover && book.cover.trim() !== '' && !book.cover.includes('placeholder.com');

    return (
        <div className="animate-fade-in w-full pb-24">
            
            {/* Top Navigation Bar for Details */}
            <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center relative z-20">
                <button onClick={() => {
                    if (window.history.length > 1) {
                        navigate(-1);
                    } else {
                        navigate('/library');
                    }
                }} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] inline-flex items-center gap-2 text-sm font-medium transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back
                </button>
                <div className="flex gap-3">
                    <button onClick={handleResetLog} className="text-xs text-[var(--text-tertiary)] hover:text-red-500 transition-colors uppercase tracking-wider font-semibold">
                        Reset Log
                    </button>
                </div>
            </div>

            {/* Immersive Hero Header */}
            <div className="w-full bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] pt-8 pb-16 relative">
                <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-10">
                    {/* Cover Art */}
                    <div className="flex-shrink-0 relative group">
                        {hasCover ? (
                            <img src={book.cover} alt={book.title} className="w-48 md:w-56 object-cover shadow-2xl rounded-sm border border-[var(--border-subtle)]" />
                        ) : (
                            <div className="w-48 md:w-56 aspect-[2/3] bg-[var(--bg-tertiary)] border border-[var(--border-strong)] rounded-sm flex items-center justify-center shadow-2xl">
                                <span className="font-heading text-4xl text-[var(--text-muted)]">{book.title.charAt(0)}</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Editorial Titles */}
                    <div className="flex-1 text-center md:text-left pb-2">
                        <p className="text-[var(--accent-primary)] text-xs font-semibold uppercase tracking-widest mb-3">{book.category}</p>
                        <h1 className="text-4xl md:text-6xl font-heading text-[var(--text-primary)] leading-tight mb-2 flex items-center justify-center md:justify-start gap-4">
                            {book.title}
                            <button onClick={handleFavoriteClick} className="text-[var(--text-muted)] hover:text-red-500 transition-all duration-300 mt-2 hover:scale-110 active:scale-95" title={book.isFavorite ? "Remove Favorite" : "Add Favorite"}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${book.isFavorite ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </h1>
                        <p className="text-xl font-serif italic text-[var(--text-muted)]">by {book.author}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                
                {/* Left Column: Progress & Logging */}
                <div className="lg:col-span-2 space-y-12">
                    
                    {/* Progress Section */}
                    <section>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-tertiary)] mb-6 border-b border-[var(--border-subtle)] pb-2">Reading Progress</h2>
                        
                        <div className="flex items-end justify-between mb-3 text-[var(--text-primary)]">
                            <div className="font-heading text-4xl">{progress}% <span className="text-sm font-sans text-[var(--text-muted)] tracking-normal">read</span></div>
                            <div className="text-sm text-[var(--text-muted)]">{book.currentPage} / {book.totalPages} pages</div>
                        </div>
                        
                        <div className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-full h-2 mb-8">
                            <div className="bg-[var(--accent-primary)] h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>

                        {book.currentPage === book.totalPages && book.totalPages > 0 && (
                            <p className="text-[var(--accent-primary)] font-serif italic text-lg mb-8">
                                "A journey completed." — You finished reading this on {formatDate(book.finishedOn) || 'recently'}.
                            </p>
                        )}

                        {/* Session Logger */}
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6 md:p-8 rounded-sm">
                            <h3 className="text-lg font-heading text-[var(--text-primary)] mb-6">Log Today's Session</h3>
                            
                            <div className="flex items-center gap-4 mb-8">
                                <button onClick={() => handlePageChangeByButton(-1)} className="w-8 h-8 rounded-sm border border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] flex items-center justify-center font-mono text-sm transition-colors">-</button>
                                <input 
                                    type="range" min="0" max={book.totalPages} value={sliderCurrentPage} 
                                    onChange={(e) => handlePageChange(parseInt(e.target.value))} 
                                    className="flex-grow accent-[var(--accent-primary)] h-1 bg-[var(--bg-tertiary)] rounded-full appearance-none cursor-pointer" 
                                />
                                <button onClick={() => handlePageChangeByButton(1)} className="w-8 h-8 rounded-sm border border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] flex items-center justify-center font-mono text-sm transition-colors">+</button>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="text-center sm:text-left flex-1">
                                    <p className="text-sm text-[var(--text-muted)]">Currently on page <strong className="text-[var(--text-primary)] font-mono">{sliderCurrentPage}</strong></p>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button 
                                        onClick={handleUpdateProgress} 
                                        disabled={sliderCurrentPage === book.currentPage}
                                        className="w-full sm:w-auto px-6 py-2.5 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-semibold rounded-sm hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-[var(--accent-primary)] transition-colors"
                                    >
                                        Save Session
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Right Column: Metadata & Goals */}
                <div className="space-y-10">
                    
                    {/* Metadata Box */}
                    <section>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-tertiary)] mb-6 border-b border-[var(--border-subtle)] pb-2">Publication Details</h2>
                        <ul className="space-y-4 text-sm">
                            <li className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                                <span className="text-[var(--text-muted)]">Total Pages</span>
                                <span className="text-[var(--text-primary)] font-mono">{book.totalPages}</span>
                            </li>
                            {book.startedOn && (
                                <li className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                                    <span className="text-[var(--text-muted)]">Started Reading</span>
                                    <span className="text-[var(--text-primary)] font-mono">{formatDate(book.startedOn)}</span>
                                </li>
                            )}
                            {book.finishedOn && (
                                <li className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                                    <span className="text-[var(--text-muted)]">Finished Reading</span>
                                    <span className="text-[var(--text-primary)] font-mono">{formatDate(book.finishedOn)}</span>
                                </li>
                            )}
                        </ul>
                    </section>

                    {/* Deadline Goal Box */}
                    <section>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-tertiary)] mb-6 border-b border-[var(--border-subtle)] pb-2">Reading Goal</h2>
                        {!showGoalForm ? (
                            <button
                                onClick={() => { setShowGoalForm(true); localStorage.setItem(currentBookLocalStorageKey, 'true'); }}
                                className="w-full py-3 border border-dashed border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] rounded-sm text-sm transition-colors"
                            >
                                + Set a deadline
                            </button>
                        ) : (
                            <div className="p-5 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded-sm">
                                <p className="text-xs text-[var(--text-muted)] mb-3">Target Completion Date</p>
                                <DatePicker
                                    withPortal={isMobile}
                                    selected={newDeadline}
                                    onChange={(date) => setNewDeadline(date)}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Select deadline"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] px-3 py-2 rounded-sm text-sm focus:outline-none mb-4"
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleSaveDeadline} className="flex-1 py-1.5 bg-[var(--border-strong)] text-[var(--text-primary)] text-sm rounded-sm hover:bg-[var(--text-muted)] transition-colors">Save</button>
                                    <button onClick={handleCancelGoal} className="flex-1 py-1.5 border border-[var(--border-strong)] text-[var(--text-muted)] text-sm rounded-sm hover:text-[var(--text-primary)] transition-colors">Cancel</button>
                                </div>
                                {deadlineStatus && <div className="mt-4 text-xs pt-3 border-t border-[var(--border-subtle)]">{deadlineStatus}</div>}
                            </div>
                        )}
                    </section>

                </div>
            </div>

            {/* Confirm Modal */}
            {confirmModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-sm" onClick={() => setConfirmModal({ ...confirmModal, show: false })}></div>
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm p-6 max-w-md w-full relative z-10 shadow-2xl animate-fade-in">
                        <h3 className="text-lg font-heading text-[var(--text-primary)] mb-2">{confirmModal.title || 'Confirm Action'}</h3>
                        <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">{confirmModal.message}</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmModal({ ...confirmModal, show: false })} className="px-4 py-2 border border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm rounded-sm transition-colors">Cancel</button>
                            <button onClick={() => { confirmModal.onConfirm(); setConfirmModal({ show: false, title: '', message: '', onConfirm: null }); }} className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-semibold text-sm rounded-sm transition-colors">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetails;