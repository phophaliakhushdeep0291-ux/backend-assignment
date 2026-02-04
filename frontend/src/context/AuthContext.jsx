import { createContext, useState, useContext, useEffect } from "react";
import API from "../api/api.js"; // Your cookie-enabled axios instance

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
});
  const [loading, setLoading] = useState(true);

  // 1. Verify Session on Mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // You need a 'get-current-user' route in your backend
        // Your backend middleware (verifyJWT) will check the cookie
        const response = await API.get("/users/current-user");
        
        if (response.data.success) {
          setUser(response.data.data); // Set user from backend response
        }
      } catch (error) {
        // If 401, cookie is invalid/expired
        setUser(null);
        localStorage.removeItem("user"); // Clean up UI data only
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 2. Login helper
  const login = (userData) => {
    // We only store the user info (name, avatar, etc) for the UI
    // The cookies are handled automatically by the browser
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 3. Logout helper
  const logout = async () => {
    try {
      await API.post("/users/logout"); // Backend clears cookies
    } finally {
      localStorage.clear();
      setUser(null);
      window.location.href = "/login";
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};