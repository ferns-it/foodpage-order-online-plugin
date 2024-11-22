"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { setLocalStorageItem } from "../../_utils/ClientUtils";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [validationLoading, setValidationLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
    setLocalStorageItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("userToken");
    router.push("/");
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    try {
      setValidationLoading(true);
      const sessionUser = localStorage.getItem("userToken");
      if (sessionUser && sessionUser.length != 0) {
        const decodedToken = jwt.decode(sessionUser);
        const currentTime = Date.now() / 1000;
        setUser(sessionUser);
        return;
      }
    } finally {
      setValidationLoading(false);
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        validationLoading,
        setUser,
        setValidationLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
