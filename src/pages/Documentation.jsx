import React from 'react';
import { Link } from 'react-router-dom';

const Documentation = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in text-[var(--text-primary)]">
      <div className="mb-8 border-b border-[var(--border-subtle)] pb-8">
        <h1 className="text-4xl md:text-5xl font-heading mb-4">Documentation</h1>
        <p className="text-[var(--text-muted)] text-lg">A comprehensive guide to mastering Bookworm.</p>
      </div>

      <div className="prose prose-invert prose-zinc max-w-none">
        
        <h2 className="text-2xl font-heading mt-10 mb-4 text-[var(--text-primary)]">Getting Started</h2>
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          Bookworm is designed to be your premium reading companion. To get started, press <code className="bg-[var(--bg-tertiary)] px-2 py-1 rounded text-sm text-[var(--text-primary)] font-mono border border-[var(--border-subtle)]">Cmd/Ctrl + K</code> anywhere in the app to open the Global Command Palette, where you can instantly search for and catalog new books.
        </p>

        <h2 className="text-2xl font-heading mt-10 mb-4 text-[var(--text-primary)]">Cataloging Books</h2>
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          Our intelligent cataloging system uses the Google Books API to instantly fetch high-resolution covers, precise page counts, and genres. Simply type the title or ISBN into the search bar, and select your book to add it to your library. If a book is exceptionally rare, you can always manually input its metadata.
        </p>

        <h2 className="text-2xl font-heading mt-10 mb-4 text-[var(--text-primary)]">Tracking Progress</h2>
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          Click on any book in your Library to view its dedicated details page. Here, you can log your daily reading sessions using the interactive slider. The app automatically calculates your reading percentage and tracks your reading streak, which you can monitor from your Profile dashboard.
        </p>

        <h2 className="text-2xl font-heading mt-10 mb-4 text-[var(--text-primary)]">Managing Favorites</h2>
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          You can curate a list of your all-time favorite reads. Simply click the heart icon on any book card or within the book details page to toggle its favorite status. Your favorites will be distinctly highlighted in your Library.
        </p>

        <div className="mt-16 pt-8 border-t border-[var(--border-subtle)]">
          <Link to="/" className="text-[var(--accent-primary)] hover:underline font-semibold tracking-wide uppercase text-sm">
            &larr; Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
