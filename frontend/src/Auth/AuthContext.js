import React, { createContext, useContext, useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

//context for managing authentication
const AuthContext = createContext();

//hook for useContext
export const useAuth = () => useContext(AuthContext);

//Admin route to only allow users with admin role
export const AdminRoute = () => {
  const {currentUser} = useAuth();
  const isAdmin = currentUser && currentUser.Role === 'admin';
  return isAdmin ? <Outlet/> : <Navigate to='authorization-denied'/>
}
//Protected Routes for pages that you need to be logged in for 
export const ProtectedRoutes = () => {
  const isLoggedIn = !!localStorage.getItem('currentUser');
  return isLoggedIn ? <Outlet /> : <Navigate to='/login' />;
};
//Provides Authentication and manages user state 
export const AuthProvider = ({ children }) => {
  //sets current user from local storage so it maintains its session on reloads
  const [currentUser, setCurrentUser] = useState(() => {
    const userJson = localStorage.getItem('currentUser'); 
    return userJson ? JSON.parse(userJson) : null;
  });
  //useEffect to set currentUser in localStorage
  useEffect(() => {
    // Sync currentUser state with localStorage/sessionStorage
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser'); 
    }
  }, [currentUser]);

  //function to login users and updates currentUser
  const login = (userDetails) => {
    setCurrentUser(userDetails);
  };
  //function to logout users and clears currentUser
  const logout = () => {
    setCurrentUser(null);
  };



  return (
    //AuthContext Wrapped in app pages
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
