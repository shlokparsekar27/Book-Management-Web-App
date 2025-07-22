import React, { useState, useEffect } from 'react';

const genres = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Biography',
  'History',
  'Self-Help',
  'Dystopian',
  'Romance',
  'Horror'
];

const Profile = ({ books }) => {
  const totalBooks = books.length;
  const currentlyReading = books.filter(book => !book.finishedOn).length;
  const finishedBooks = books.filter(book => book.finishedOn).length;
  const favoriteBooks = books.filter(book => book.isFavorite).length;

  const [username, setUsername] = useState('');
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [genre, setGenre] = useState('');
  const [streak, setStreak] = useState(parseInt(localStorage.getItem('readoraStreak')) || 0);

  useEffect(() => {
    const savedName = localStorage.getItem('bookwormUsername');
    const savedAvatar = localStorage.getItem('bookwormAvatar');
    const savedGenre = localStorage.getItem('bookwormGenre');

    if (savedName) setUsername(savedName);
    if (savedAvatar) setAvatar(savedAvatar);
    if (savedGenre) setGenre(savedGenre);
  }, []);

  // Live sync for streak every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentStreak = parseInt(localStorage.getItem('readoraStreak')) || 0;
      setStreak(currentStreak);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('bookwormUsername', username);
    if (avatar) localStorage.setItem('bookwormAvatar', avatar);
    localStorage.setItem('bookwormGenre', genre);
  }, [username, avatar, genre]);

  const handleNameChange = (e) => setUsername(e.target.value);
  const handleGenreChange = (e) => setGenre(e.target.value);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => setEditing(false);

  const handleReset = () => {
    const confirmReset = window.confirm("Are you sure you want to reset your profile? This cannot be undone.");
    if (confirmReset) {
      localStorage.removeItem('bookwormUsername');
      localStorage.removeItem('bookwormAvatar');
      localStorage.removeItem('bookwormGenre');
      localStorage.removeItem('readoraStreak');
      setUsername('');
      setAvatar(null);
      setGenre('');
      setStreak(0);
      setEditing(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-[url('/images/img4.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 min-h-screen pt-20 flex justify-center items-start">
        <div className="bg-white/60 backdrop-blur-md shadow-2xl rounded-2xl p-10 max-w-xl w-full mx-4 mt-10">

          <div className="text-center mb-6">
            {/* Avatar */}
            <div className="mb-4">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="mx-auto w-28 h-28 rounded-full object-cover shadow-md border-2 border-gray-300"
                />
              ) : (
                <div className="w-28 h-28 mx-auto rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-3xl font-bold shadow-inner">
                  ?
                </div>
              )}
              {editing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="mt-2 block mx-auto"
                />
              )}
            </div>

            {/* Username */}
            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={username}
                  onChange={handleNameChange}
                  placeholder="Enter your name"
                  className="px-4 py-3 rounded-md border border-gray-400 focus:outline-none w-full text-lg"
                />
                <select
                  value={genre}
                  onChange={handleGenreChange}
                  className="px-4 py-3 rounded-md border border-gray-400 focus:outline-none w-full text-lg"
                >
                  <option value="">Select your favorite genre</option>
                  {genres.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <button
                  onClick={handleSave}
                  className="bg-cyan-700 text-white px-4 py-2 rounded-md hover:bg-cyan-800 transition w-full text-lg"
                >
                  Save Profile
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-gray-800">
                  {username ? `${username}` : 'Welcome!'}
                </h2>
                <p className="text-gray-600 text-lg mt-1">
                  {genre ? `Favorite Genre: ${genre}` : 'No genre set'}
                </p>
                <div className="mt-3 space-x-4">
                  <button
                    onClick={() => setEditing(true)}
                    className="text-blue-600 text-base hover:underline"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleReset}
                    className="text-red-600 text-base hover:underline"
                  >
                    Reset
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-4 max-w-xl w-full">

            <div className="space-y-4 text-xl text-gray-700 text-left mt-6 font-medium">
              <p>📚 <strong>Total Books:</strong> {totalBooks}</p>
              <p>📖 <strong>Currently Reading:</strong> {currentlyReading}</p>
              <p>✅ <strong>Finished Books:</strong> {finishedBooks}</p>
              <p>⭐ <strong>Favorites:</strong> {favoriteBooks}</p>
              <div className="text-xl font-semibold text-orange-600 mb-6">
                <p>🔥 <strong>Streak:</strong> {streak} {streak === 1 ? 'day' : 'days'}</p>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">More features & settings coming soon ✨</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
