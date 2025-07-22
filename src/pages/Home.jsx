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
    // Outermost container to cover entire viewport with background image
    <div className="fixed inset-0 bg-[url('/images/img2.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Content wrapper: pushed down with pt-16 (adjust if Navbar height changes) */}
      {/* Added pt-16 to push content below the fixed Navbar */}
       <div className="relative z-10 min-h-screen flex justify-center pt-16"> {/* Removed min-h-[calc(100vh-80px)], added min-h-screen for centering */}

        <div className="w-full max-w-lg bg-transparent p-8 rounded-2xl shadow-none border-none text-white"> {/* Made transparent, removed shadow/border, text white */}

          <h1 className="text-4xl font-extrabold text-center  text-cyan-900 mb-6">Add New Book</h1> {/* Changed text color to white */}


          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-gray-600 border border-gray-800 text-white px-5 py-3 rounded-lg relative mb-6 text-center shadow-md animate-fade-in-down">
              <span className="block sm:inline ml-2">"{addedBookTitle}" was successfully added to your library.</span>
            </div>
          )}

          {/* AddBookForm component */}
          <AddBookForm onAdd={onBookAdded} />
        </div>
      </div>
    </div>
  );
};

export default Home;