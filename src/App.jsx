import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Library from './pages/Library';
import Profile from './pages/Profile';
import BookDetails from './pages/BookDetails';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Documentation from './pages/Documentation';
import { fetchBooks, createBook, updateBook, deleteBook } from './services/api';

const App = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('bookwormTheme') || 'dark');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bookwormTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [books, setBooks] = useState(() => {
    const cached = localStorage.getItem('bookwormBooks');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return parsed.map(book => ({
          ...book,
          dailyLog: Array.isArray(book.dailyLog) ? book.dailyLog : []
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    let active = true;
    fetchBooks().then(data => {
      if (active) setBooks(data);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('bookwormBooks', JSON.stringify(books));
  }, [books]);

  const handleAddBook = async (book) => {
    const newBook = {
      ...book,
      isFavorite: false,
      currentPage: 0,
      dailyLog: [],
      startedOn: book.startedOn || new Date().toISOString().split('T')[0],
      finishedOn: null,
      deadline: null
    };

    setBooks(prev => [newBook, ...prev]);
    const savedBook = await createBook(newBook);
    setBooks(prev => prev.map(b => b.title === newBook.title && b.author === newBook.author ? savedBook : b));
  };

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

  const handleUpdateBook = async (updatedBook) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === updatedBook.id ? updatedBook : book
      )
    );
    updateStreak();
    await updateBook(updatedBook);
  };

  const handleRemoveBook = async (bookId) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
    await deleteBook(bookId);
  };

  const handleToggleFavorite = async (bookId) => {
    const targetBook = books.find(b => b.id === bookId);
    if (!targetBook) return;

    const updatedBook = {
      ...targetBook,
      isFavorite: !targetBook.isFavorite
    };

    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === bookId ? updatedBook : book
      )
    );
    await updateBook(updatedBook);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans antialiased relative transition-colors duration-300">
      <Navbar books={books} theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex-1 w-full pt-12 pb-24 min-h-[100vh]">
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
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="*" element={<Home handleAddBook={handleAddBook} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
