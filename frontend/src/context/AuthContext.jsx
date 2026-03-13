import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // LOGIN OR REGISTER
  const login = (jwtToken) => {

    try {

      const decoded = jwtDecode(jwtToken);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logout();
        alert("Session expired");
        return;
      }

      // save token
      localStorage.setItem("token", jwtToken);

      setToken(jwtToken);

      setUser({
        id: decoded.id,
        email: decoded.email
      });

    } catch (error) {
      console.log("Invalid token");
      logout();
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  // LOAD TOKEN WHEN APP STARTS
  useEffect(() => {

    const savedToken = localStorage.getItem("token");

    if (!savedToken) return;

    try {

      const decoded = jwtDecode(savedToken);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logout();
        return;
      }

      setToken(savedToken);

      setUser({
        id: decoded.id,
        email: decoded.email
      });

    } catch (error) {
      logout();
    }

  }, []);

  // AUTO LOGOUT WHEN TOKEN EXPIRES
  useEffect(() => {

    if (!token) return;

    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp * 1000;
    const remainingTime = expiryTime - Date.now();

    const timer = setTimeout(() => {
      logout();
      alert("Session expired. Please login again.");
    }, remainingTime);

    return () => clearTimeout(timer);

  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {
  return useContext(AuthContext);
};