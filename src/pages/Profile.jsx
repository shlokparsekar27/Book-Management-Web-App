import React, { useState, useEffect, useRef } from 'react';

const Profile = ({ books }) => {
  const totalBooks = books.length;
  const currentlyReading = books.filter(book => !book.finishedOn).length;
  const finishedBooks = books.filter(book => book.finishedOn).length;
  const [username, setUsername] = useState('');
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [bio, setBio] = useState('');
  const [streak, setStreak] = useState(0);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedName = localStorage.getItem('bookwormUsername');
    const savedAvatar = localStorage.getItem('bookwormAvatar');
    const savedBio = localStorage.getItem('bookwormBio');
    const savedStreak = localStorage.getItem('readoraStreak');

    if (savedName) setUsername(savedName);
    if (savedAvatar) setAvatar(savedAvatar);
    if (savedBio) setBio(savedBio);
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  const handleSave = () => {
    localStorage.setItem('bookwormUsername', username);
    localStorage.setItem('bookwormBio', bio);
    setEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem('bookwormAvatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const getInitial = () => username ? username.charAt(0).toUpperCase() : 'R';

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      
      {/* Identity Card */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16 mb-20">
        
        {/* Avatar Section */}
        <div className="relative group flex-shrink-0">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden flex items-center justify-center shadow-2xl relative z-10">
                {avatar ? (
                    <img src={avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-6xl font-heading text-[var(--text-muted)]">{getInitial()}</span>
                )}
            </div>
            
            {/* Elegant glow behind avatar */}
            <div className="absolute inset-0 bg-[var(--accent-primary)]/10 blur-2xl rounded-full scale-110 z-0"></div>

            <button 
                onClick={triggerFileInput} 
                className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-[var(--bg-primary)] border border-[var(--border-strong)] p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-all z-20 shadow-lg"
                title="Update Portrait"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        </div>

        {/* Identity Info */}
        <div className="flex-1 w-full text-center md:text-left">
            {!editing ? (
                <div>
                    <h1 className="text-4xl md:text-5xl font-heading text-[var(--text-primary)] mb-2">{username || 'Anonymous Reader'}</h1>
                    <p className="text-lg text-[var(--accent-primary)] font-serif italic mb-6">
                        {bio ? `"${bio}"` : 'Exploring the vast world of literature'}
                    </p>
                    <button 
                        onClick={() => setEditing(true)} 
                        className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] border-b border-transparent hover:border-[var(--text-primary)] transition-colors pb-1"
                    >
                        Edit Profile Identity
                    </button>
                </div>
            ) : (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6 rounded-sm w-full max-w-md mx-auto md:mx-0">
                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Pen Name</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] px-3 py-2 rounded-sm focus:outline-none" 
                            placeholder="Enter your name" 
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Bio / Quote</label>
                        <textarea 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)} 
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] px-3 py-2 rounded-sm focus:outline-none resize-none min-h-[80px]"
                            placeholder="Share a thought or quote..."
                        />
                    </div>
                    <button onClick={handleSave} className="w-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold py-2 rounded-sm hover:bg-[var(--text-muted)] transition-colors text-sm">
                        Save Identity
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Reading Statistics */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-tertiary)] mb-8 border-b border-[var(--border-subtle)] pb-2 text-center md:text-left">
            Literary Milestones
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="flex flex-col items-center md:items-start p-6 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded-sm">
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest mb-2">Total Collection</span>
                <span className="text-4xl font-heading text-[var(--text-primary)]">{totalBooks}</span>
            </div>

            <div className="flex flex-col items-center md:items-start p-6 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded-sm">
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest mb-2">Books Read</span>
                <span className="text-4xl font-heading text-[var(--text-primary)]">{finishedBooks}</span>
            </div>

            <div className="flex flex-col items-center md:items-start p-6 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded-sm">
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest mb-2">Reading Now</span>
                <span className="text-4xl font-heading text-[var(--text-primary)]">{currentlyReading}</span>
            </div>

            <div className="flex flex-col items-center md:items-start p-6 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--accent-primary)]/10 rounded-bl-full -z-0"></div>
                <span className="text-[var(--accent-primary)] text-xs uppercase tracking-widest mb-2 relative z-10 flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
                    Daily Streak
                </span>
                <span className="text-4xl font-heading text-[var(--text-primary)] relative z-10">{streak}</span>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;