import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-4 md:gap-8">
        
        {/* Brand */}
        <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <img src="/images/img4.jpg" alt="BookWorm Logo" className="w-6 h-6 rounded-sm shadow-md object-cover" />
            <span className="text-lg font-heading font-semibold text-[var(--text-primary)] tracking-tight">
              BookWorm
            </span>
          </div>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs">
            A premium workspace for readers, collectors, and bibliophiles. Catalog your journey.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[var(--text-primary)] font-semibold text-sm mb-1 uppercase tracking-wider">Navigation</h4>
          <Link to="/" className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors">Home</Link>
          <Link to="/library" className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors">Library</Link>
          <Link to="/profile" className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors">Profile</Link>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-3 text-right md:text-left">
          <h4 className="text-[var(--text-primary)] font-semibold text-sm mb-1 uppercase tracking-wider">System</h4>
          <Link to="/docs" className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors">Documentation</Link>
          <Link to="/terms" className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)] transition-colors">Privacy Policy</Link>
        </div>

      </div>
      
      <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-tertiary)]">
        <p>&copy; 2026 BookWorm Platform. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 font-mono">v2.0.0-achromatic</p>
      </div>
    </footer>
  );
};

export default Footer;
