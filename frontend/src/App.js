// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Layout/Navbar';
import LandingPage from './Pages/LandingPage';
import Home from './Pages/Home';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import AddProfile from './Profiles/AddProfiles';
import EditProfile from './Profiles/EditProfile';
import ViewProfile from './Profiles/ViewProfile';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/check-auth', {
          credentials: 'include',
        });

        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
          setIsAuthenticated(false);
      }
    };
    // Check auth status when route changes
    checkAuth();
  }, [location]); // Added dependency here

  return (
    <div className="App">
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <SignUp />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/addprofile" element={isAuthenticated ? <AddProfile /> : <Navigate to="/login" />} />
        <Route path="/editprofile/:id" element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />} />
        <Route path="/viewprofile/:id" element={isAuthenticated ? <ViewProfile /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;