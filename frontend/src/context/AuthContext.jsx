import { createContext, useContext, useState, useEffect } from "react";
// Make sure you install: npm install jwt-decode@3.1.2
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Track auth initialization

  // LOGIN FUNCTION
  const login = (jwtToken) => {
    try {
      const decoded = jwtDecode(jwtToken);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logout();
        alert("Session expired");
        return;
      }

      localStorage.setItem("token", jwtToken);
      setToken(jwtToken);

      setUser({
        id: decoded.id,
        email: decoded.email,
      });

      console.log("Login successful, token stored:", localStorage.getItem("token"));
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
    }
  };

  // LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    console.log("Logged out, token removed from localStorage");
  };

  // LOAD TOKEN ON APP START
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(savedToken);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logout();
        setLoading(false);
        return;
      }

      setToken(savedToken);
      setUser({
        id: decoded.id,
        email: decoded.email
      });
      console.log("Auto-login successful, token loaded:", savedToken);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // AUTO LOGOUT WHEN TOKEN EXPIRES
  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);
    const remainingTime = decoded.exp * 1000 - Date.now();

    const timer = setTimeout(() => {
      logout();
      alert("Session expired. Please login again.");
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);