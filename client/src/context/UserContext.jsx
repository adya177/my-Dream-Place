import { useState, useContext, createContext } from "react";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const storedAuth = JSON.parse(localStorage.getItem("auth") || "null");
      return storedAuth?.token
        ? { user: storedAuth.user ?? null, token: storedAuth.token }
        : { user: null, token: "" };
    } catch {
      localStorage.removeItem("auth");
      return { user: null, token: "" };
    }
  });

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
