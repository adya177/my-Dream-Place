import { useState, useContext, createContext, useEffect } from "react";

const BookingContext = createContext();
const readStoredBookings = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem("booking") || "[]");
    return Array.isArray(stored) ? stored.filter((item) => item && typeof item === "object" && !Array.isArray(item)) : [];
  } catch {
    return [];
  }
};

const BookingProvider = ({ children }) => {
  const [book, setBook] = useState([]);

  useEffect(() => {
    setBook(readStoredBookings());
  }, []);

  return (
    <BookingContext.Provider value={[book, setBook]}>
      {children}
    </BookingContext.Provider>
  );
};

// custom hook
const useBook = () => useContext(BookingContext);

export { useBook, BookingProvider };
