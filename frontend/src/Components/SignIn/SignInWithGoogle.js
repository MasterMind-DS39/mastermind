import React from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function SignInWithGoogle() {
  const handleGoogleSignIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const payload = {
        userId: user.uid,
        userName: user.email.split('@')[0],
        name: user.displayName,
        profileImage: user.photoURL || ""
      };

      // First, check if user exists
      fetch(`http://localhost:8080/users/${user.uid}`)
        .then(response => {
          if (response.status === 200) {
            // User exists, log in
            localStorage.setItem("users", JSON.stringify(user));
            window.location.reload();
          } else if (response.status === 404) {
            // User does not exist, create new user
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
          } else {
            throw new Error("Unexpected response from backend");
          }
        })
        .catch(error => {
          console.error("Error checking/creating user:", error);
        });
    })
    .catch((error) => {
      console.error("Google Sign-In error:", error.message);
      alert(`Google Sign-In failed: ${error.message}`);
    });
};


  return (
    <button className="login__button" style={{ marginTop: '10px', background: '#fff', color: '#444', border: '1px solid #ddd' }} onClick={handleGoogleSignIn}>
      <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google logo" style={{ marginRight: 8 }} />
      Sign in with Google
    </button>
  );
}

export default SignInWithGoogle;
