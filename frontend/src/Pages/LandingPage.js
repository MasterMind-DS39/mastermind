// src/Pages/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleGitHubLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  };

  return (
    <div className="container">
      <h2>Welcome to the App</h2>
      <button onClick={handleLogin} className="btn btn-primary">
        Login
      </button>
      <button onClick={handleSignUp} className="btn btn-secondary">
        Sign Up
      </button>
      <button onClick={handleGoogleLogin} className="btn btn-outline-primary">
        Login with Google
      </button>
      <button onClick={handleGitHubLogin} className="btn btn-outline-secondary">
        Login with GitHub
      </button>
    </div>
  );
}