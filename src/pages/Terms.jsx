import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in text-[var(--text-primary)]">
      <div className="mb-8 border-b border-[var(--border-subtle)] pb-8">
        <h1 className="text-4xl md:text-5xl font-heading mb-4">Terms of Service</h1>
        <p className="text-[var(--text-muted)] text-lg">Effective Date: June 2026</p>
      </div>

      <div className="prose prose-invert prose-zinc max-w-none">
        <p className="text-lg leading-relaxed text-[var(--text-secondary)] mb-8">
          Welcome to Bookworm. By accessing or using our platform, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
        </p>

        <h2 className="text-2xl font-heading mt-10 mb-4 text-[var(--text-primary)]">1. Use of Service</h2>
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          Bookworm is a personal cataloging and reading progress tracking application. You agree to use the service only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the service.
        </p>

        <h2 className="text-2xl font-heading mt-10 mb-4 text-[var(--text-primary)]">2. User Accounts</h2>
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. We reserve the right to terminate accounts, remove or edit content, or cancel service at our sole discretion.
        </p>

        <h2 className="text-2xl font-heading mt-10 mb-4 text-[var(--text-primary)]">3. Intellectual Property</h2>
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          The service and its original content (excluding user-provided book metadata and cover art fetched from third parties), features, and functionality are and will remain the exclusive property of Bookworm and its licensors. Book metadata and cover art remain the intellectual property of their respective owners.
        </p>

        <h2 className="text-2xl font-heading mt-10 mb-4 text-[var(--text-primary)]">4. Limitation of Liability</h2>
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          In no event shall Bookworm, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
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

export default Terms;
