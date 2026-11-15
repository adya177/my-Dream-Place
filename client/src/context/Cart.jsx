import { useState, useContext, createContext, useEffect } from "react";

const CartContext = createContext();
const readStoredCart = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem("cart") || "[]");
    return Array.isArray(stored) ? stored.filter((item) => item && typeof item === "object" && !Array.isArray(item)) : [];
  } catch {
    return [];
  }
};

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(readStoredCart());
  }, []);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
