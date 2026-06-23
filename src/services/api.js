// src/services/api.js

const API_BASE_URL = 'http://localhost:5000/api';


export async function fetchBooks() {
  const localBooks = JSON.parse(localStorage.getItem('bookwormBooks') || '[]');
  
  try {
    const response = await fetch(`${API_BASE_URL}/books`, { signal: AbortSignal.timeout(3000) });
    if (!response.ok) throw new Error('API error');
    
    const dbBooks = await response.json();
    
    // Map database models to application models, merging daily logs from localStorage
    const mergedBooks = dbBooks.map((book) => {
      const storedLog = localStorage.getItem(`book_${book.id}_dailyLog`);
      const dailyLog = storedLog ? JSON.parse(storedLog) : [];
      
      return {
        ...book,
        isFavorite: book.isFavorite === 1 || book.isFavorite === true,
        dailyLog,
        // Enforce null/string checks
        startedOn: book.startedOn || null,
        finishedOn: book.finishedOn || null,
        deadline: book.deadline || null,
      };
    });

    // Save to local cache for offline usage
    localStorage.setItem('bookwormBooks', JSON.stringify(mergedBooks));
    return mergedBooks;
  } catch (error) {
    console.warn('Backend API unreachable. Falling back to local storage cache.', error);
    // Ensure offline local books map properties correctly
    return localBooks.map(book => {
      const storedLog = localStorage.getItem(`book_${book.id}_dailyLog`);
      return {
        ...book,
        dailyLog: storedLog ? JSON.parse(storedLog) : (book.dailyLog || []),
        isFavorite: book.isFavorite === true || book.isFavorite === 1
      };
    });
  }
}

export async function createBook(book) {
  try {
    const payload = {
      title: book.title,
      author: book.author,
      cover: book.cover || '',
      category: book.category,
      totalPages: parseInt(book.totalPages) || 0,
      currentPage: parseInt(book.currentPage) || 0,
      startedOn: book.startedOn || null,
      finishedOn: book.finishedOn || null,
      deadline: book.deadline || null,
      isFavorite: book.isFavorite ? 1 : 0
    };

    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000)
    });

    if (!response.ok) throw new Error('POST failed');
    const data = await response.json();
    
    // Save daily log if any exists (should be empty for new book)
    localStorage.setItem(`book_${data.id}_dailyLog`, JSON.stringify(book.dailyLog || []));
    
    return {
      ...book,
      id: data.id, // MySQL inserted ID
    };
  } catch (error) {
    console.warn('Backend API post failed. Operating in local mode.', error);
    const localId = Date.now();
    localStorage.setItem(`book_${localId}_dailyLog`, JSON.stringify(book.dailyLog || []));
    return {
      ...book,
      id: localId,
    };
  }
}

export async function updateBook(book) {
  // Sync dailyLog to localStorage regardless of backend status
  localStorage.setItem(`book_${book.id}_dailyLog`, JSON.stringify(book.dailyLog || []));

  try {
    const payload = {
      title: book.title,
      author: book.author,
      cover: book.cover || '',
      category: book.category,
      totalPages: parseInt(book.totalPages) || 0,
      currentPage: parseInt(book.currentPage) || 0,
      startedOn: book.startedOn || null,
      finishedOn: book.finishedOn || null,
      deadline: book.deadline || null,
      isFavorite: book.isFavorite ? 1 : 0
    };

    // If it's a temporary local-only ID, skip backend save until connection is re-established
    if (book.id > 1000000000000) {
      throw new Error('Local temporary ID - update in local storage only');
    }

    const response = await fetch(`${API_BASE_URL}/books/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000)
    });

    if (!response.ok) throw new Error('PUT failed');
    return book;
  } catch (error) {
    console.warn('Backend API update failed. Saving changes locally.', error);
    return book;
  }
}

export async function deleteBook(bookId) {
  // Cleanup localStorage
  localStorage.removeItem(`book_${bookId}_dailyLog`);
  localStorage.removeItem(`book_${bookId}_showGoalForm`);

  try {
    if (bookId > 1000000000000) {
      return true; // Local temporary ID deleted locally only
    }

    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(3000)
    });

    if (!response.ok) throw new Error('DELETE failed');
    return true;
  } catch (error) {
    console.warn('Backend API delete failed. Removing from local cache only.', error);
    return true;
  }
}
