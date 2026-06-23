import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in text-[var(--text-primary)]">
      <div className="mb-8 border-b border-[var(--border-subtle)] pb-8">
        <h1 className="text-4xl md:text-5xl font-heading mb-4">Privacy Policy</h1>
        <p className="text-[var(--text-muted)] text-lg">Last updated: June 2026</p>
      </div>

      <div className="prose prose-invert prose-zinc max-w-none">
        <p className="text-lg leading-relaxed text-[var(--text-secondary)] mb-8">
          At Bookworm, we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our premium cataloging service.
        </p>

        <h2 className="text-2xl font-heading mt-10 mb-4 text-[var(--text-primary)]">1. Information We Collect</h2>
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          We collect information that you provide directly to us when you create an account, log reading sessions, or build your library. This includes your book catalog, reading progress, and personal preferences. All metadata fetched from third-party services like Google Books is stored securely.
        </p>

        <h2 className="text-2xl font-heading mt-10 mb-4 text-[var(--text-primary)]">2. How We Use Your Data</h2>
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          Your data is exclusively used to provide and improve the Bookworm experience. This includes tracking your reading streaks, generating analytical insights on your reading habits, and keeping your library synced across devices. We do not sell your personal reading habits to advertisers.
        </p>

        <h2 className="text-2xl font-heading mt-10 mb-4 text-[var(--text-primary)]">3. Data Security</h2>
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          We implement enterprise-grade security measures to maintain the safety of your personal information. Your reading data is encrypted at rest and in transit.
        </p>

        <h2 className="text-2xl font-heading mt-10 mb-4 text-[var(--text-primary)]">4. Third-Party Services</h2>
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          We utilize APIs such as Google Books to fetch metadata. These services may collect basic telemetry regarding the queries made. Please refer to their respective privacy policies for more details.
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

export default Privacy;
