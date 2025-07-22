import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Library from './pages/Library';
import Profile from './pages/Profile';
import BookDetails from './pages/BookDetails';

const getHardcodedDefaultBooks = () => [];

const App = () => {
  const getInitialBooks = () => {
    const storedBooks = localStorage.getItem('bookwormBooks');
    if (storedBooks) {
      const parsedBooks = JSON.parse(storedBooks);
      return parsedBooks.map(book => ({
        ...book,
        deadline: book.deadline ? book.deadline : null,
        dailyLog: book.dailyLog ? JSON.parse(book.dailyLog) : [],
        isFavorite: book.isFavorite === true || book.isFavorite === 1
      }));
    }
    return getHardcodedDefaultBooks();
  };

  const [books, setBooks] = useState(getInitialBooks);

  useEffect(() => {
    localStorage.setItem('bookwormBooks', JSON.stringify(books.map(book => ({
      ...book,
      dailyLog: JSON.stringify(book.dailyLog)
    }))));
  }, [books]);

  const handleAddBook = (book) => {
    const newBook = {
      ...book,
      id: Date.now(),
      isFavorite: false,
      currentPage: 0,
      dailyLog: [],
      startedOn: new Date().toISOString().split('T')[0],
      finishedOn: null,
      deadline: null
    };
    setBooks([newBook, ...books]);
  };

  // 🔥 Streak logic
  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const lastActiveDate = localStorage.getItem('readoraLastActiveDate');
    let currentStreak = parseInt(localStorage.getItem('readoraStreak')) || 0;

    if (lastActiveDate !== today) {
      if (lastActiveDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastActiveDate === yesterdayStr) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      localStorage.setItem('readoraLastActiveDate', today);
      localStorage.setItem('readoraStreak', currentStreak.toString());
    }
  };

  const handleUpdateBook = (updatedBook) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === updatedBook.id ? updatedBook : book
      )
    );
    updateStreak(); // 🔥 Trigger streak update
  };

  const handleRemoveBook = (bookId) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
    localStorage.removeItem(`book_${bookId}_showGoalForm`);
  };

  const handleToggleFavorite = (bookId) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === bookId ? { ...book, isFavorite: !book.isFavorite } : book
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home handleAddBook={handleAddBook} />} />
          <Route
            path="/library"
            element={<Library books={books} handleRemoveBook={handleRemoveBook} onToggleFavorite={handleToggleFavorite} />}
          />
          <Route path="/profile" element={<Profile books={books} />} />
          <Route
            path="/book/:id"
            element={<BookDetails books={books} onUpdateBook={handleUpdateBook} onToggleFavorite={handleToggleFavorite} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
