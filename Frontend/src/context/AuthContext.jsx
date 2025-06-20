import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

/**
 * Provides a React context for user authentication state and actions.
 
 * @param {{children: React.ReactNode}} props
 * @returns {React.ReactElement}
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user = { name, role }
  const [loading, setLoading] = useState(true);

  // On mount, check for a token in local storage to initialize user state.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
    setLoading(false); // ✅ done loading
  }, []);

  /**
   * Logs in the user by setting the user in state and local storage.
   * @param {string} token - The JSON Web Token (JWT) from the server.
   */
  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  /**
   * Logs out the user by removing the user from state and local storage.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access auth context.
export const useAuth = () => useContext(AuthContext);
