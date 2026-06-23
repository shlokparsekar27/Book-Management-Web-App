import React, { useState } from 'react';
import AddBookForm from '../components/AddBookForm';

const Home = ({ handleAddBook }) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [addedBookTitle, setAddedBookTitle] = useState('');

  const onBookAdded = (newBook) => {
    handleAddBook(newBook);
    setAddedBookTitle(newBook.title);
    setShowSuccessMessage(true);

    setTimeout(() => {
      setShowSuccessMessage(false);
      setAddedBookTitle('');
    }, 4000);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center animate-fade-in">

      {/* Editorial Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-6 text-center pt-16 pb-12">
        <h1 className="text-5xl md:text-7xl font-heading text-[var(--text-primary)] mb-6 leading-tight">
          Curate your reading <br className="hidden md:block" />
          <span className="italic text-[var(--text-muted)] font-serif">journey.</span>
        </h1>
      </section>

      {/* Interactive Catalog Block */}
      <section className="w-full max-w-2xl mx-auto px-6 pb-48 relative">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[var(--accent-primary)]/5 blur-3xl -z-10 rounded-full"></div>

        <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/90 backdrop-blur-xl p-8 md:p-10 rounded-xl shadow-2xl relative overflow-hidden">

          <div className="flex flex-col items-center mb-8 text-center">
            <h2 className="text-2xl font-heading text-[var(--text-primary)] mb-2">Catalog a New Book</h2>
            <p className="text-[var(--text-muted)] text-sm">Instantly fetch metadata or enter it manually.</p>
          </div>

          {showSuccessMessage && (
            <div className="mb-8 px-4 py-3 bg-[var(--accent-soft)]/10 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-sm rounded-md flex items-center justify-center gap-2 animate-fade-in">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>"{addedBookTitle}"</strong> has been added to your library.</span>
            </div>
          )}

          <div className="relative z-10">
            <AddBookForm onAdd={onBookAdded} />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
