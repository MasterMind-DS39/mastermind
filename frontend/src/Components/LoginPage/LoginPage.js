import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "../firebase";
import './LoginPage.css';
import insta_logo from '../../images/logo2.jpg';
import SignInWithGoogle from '../SignIn/SignInWithGoogle';
import SignInWithGithub from '../SignIn/SignInWithGithub';

// SignIn Component as a functional component
const SignIn = () => {
  const [credentials, setCredentials] = useState({
    emailId: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const login = () => {
    signInWithEmailAndPassword(auth, credentials.emailId, credentials.password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem("users", JSON.stringify(user));
        window.location.reload();
      })
      .catch((error) => {
        console.error("Login error:", error.message);
        alert(`Login failed: ${error.message}`);
      });
  };

  return (
    <div className="form-container">
      <div className="input-group">
        <input
          className="auth-input"
          name="emailId"
          onChange={handleChange}
          type="text"
          placeholder="Email or username"
        />
      </div>
      <div className="input-group">
        <input
          className="auth-input"
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password"
        />
      </div>
      <button className="auth-button" onClick={login}>
        Log In
      </button>
      <div className="forgot-password">
        Forgot password?
      </div>
    </div>
  );
};

// SignUp Component as a functional component
const SignUp = () => {
  const [userData, setUserData] = useState({
    emailId: '',
    name: '',
    userName: '',
    password: ''
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const newSignUp = () => {
    createUserWithEmailAndPassword(auth, userData.emailId, userData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const payload = {
          userId: user.uid,
          userName: userData.userName,
          name: userData.name,
          profileImage: ""
        };

        fetch("http://localhost:8080/users", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
          .then(response => response.json())
          .then(data => {
            localStorage.setItem("users", JSON.stringify(user));
            window.location.reload();
          })
          .catch(error => {
            console.error("Error saving user:", error);
          });
      })
      .catch((error) => {
        console.error("Sign up error:", error.message);
        alert(`Sign up failed: ${error.message}`);
      });
  };

  return (
    <div className="form-container">
      <div className="input-group">
        <input
          className="auth-input"
          name="emailId"
          onChange={handleChange}
          type="text"
          placeholder="Email"
        />
      </div>
      <div className="input-group">
        <input
          className="auth-input"
          name="name"
          onChange={handleChange}
          type="text"
          placeholder="Full Name"
        />
      </div>
      <div className="input-group">
        <input
          className="auth-input"
          name="userName"
          onChange={handleChange}
          type="text"
          placeholder="Username"
        />
      </div>
      <div className="input-group">
        <input
          className="auth-input"
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password"
        />
      </div>
      <button className="auth-button" onClick={newSignUp}>
        Sign Up
      </button>
    </div>
  );
};

// Main LoginPage Component
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="split-container">
      {/* Left side: Branding */}
      <div className="split-left">
        <div className="branding">
          <h1>SkillShare App</h1>
          <p>
            Skip repetitive and manual tasks.<br />
            Get highly productive through automation<br />
            and save tons of time!
          </p>
        </div>
      </div>
      {/* Right side: Login card */}
      <div className="split-right">
        <div className="login-card">
          <div className="auth-header">
            <img className="auth-logo" src={insta_logo} alt="logo" />
            <h2>{isLogin ? "Sign in to your account" : "Create an account"}</h2>
          </div>
          {isLogin ? <SignIn /> : <SignUp />}
          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">
            <SignInWithGoogle />
            <SignInWithGithub />
          </div>


          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button className="toggle-auth" onClick={toggleAuthMode}>
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;