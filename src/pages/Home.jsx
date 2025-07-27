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
    <div className="fixed inset-0 bg-[url('/images/img2.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black opacity-30"></div>

      <div className="relative z-10 min-h-screen flex justify-center pt-20 px-4 sm:px-8">
        <div className="w-full max-w-lg bg-transparent p-4 sm:p-8 rounded-2xl text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-4 sm:mb-6">
            Add New Book
          </h1>

          {showSuccessMessage && (
            <div className="bg-gray-600 border border-gray-800 text-white px-4 py-3 rounded-lg relative mb-4 sm:mb-6 text-center shadow-md animate-fade-in-down text-sm sm:text-base">
              <span className="block ml-2">"{addedBookTitle}" was successfully added to your library.</span>
            </div>
          )}

          <AddBookForm onAdd={onBookAdded} />
        </div>
      </div>
    </div>
  );
};

export default Home;
