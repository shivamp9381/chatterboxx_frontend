import { createContext, useContext, useEffect, useState } from "react";
import { validateTokenApi } from "../services/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);   // { username, token }
  const [authLoading, setAuthLoading] = useState(true); // checking token on load

  // On app load, check if a valid token exists in localStorage
  useEffect(() => {
    async function checkToken() {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      if (token && username) {
        try {
          await validateTokenApi();
          setAuthUser({ token, username });
        } catch {
          // Token invalid or expired — clear it
          localStorage.removeItem("token");
          localStorage.removeItem("username");
        }
      }
      setAuthLoading(false);
    }
    checkToken();
  }, []);

  const login = (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setAuthUser({ token, username });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => useContext(AuthContext);
export default useAuthContext;