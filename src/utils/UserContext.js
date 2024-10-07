import React, { createContext, useEffect, useState } from 'react';

// Create the UserContext
export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function to store user data and persist in localStorage
  const login = (userData) => {
    setUser(userData);
    try {
      // Store the user data as a JSON string
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  // Logout function to clear user data and remove from localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check if user is stored in localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        // Parse the stored user JSON back into an object
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
