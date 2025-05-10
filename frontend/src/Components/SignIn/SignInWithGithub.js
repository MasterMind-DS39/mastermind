import React from 'react';
import { auth } from '../firebase';
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";

function SignInWithGithub() {
  const handleGithubSignIn = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        // GitHub profile data is in user.reloadUserInfo.screenName and user.displayName
        const payload = {
          userId: user.uid,
          userName: user.reloadUserInfo.screenName || user.email?.split('@')[0] || "", // GitHub username or fallback
          name: user.displayName || user.reloadUserInfo.screenName || "", // Full name or fallback
          profileImage: user.photoURL || ""
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
        console.error("GitHub Sign-In error:", error.message);
        alert(`GitHub Sign-In failed: ${error.message}`);
      });
  };

  return (
    <button className="login__button" style={{ marginTop: '10px', background: '#24292e', color: '#fff' }} onClick={handleGithubSignIn}>
      <img src="https://img.icons8.com/ios-glyphs/16/ffffff/github.png" alt="GitHub logo" style={{ marginRight: 8 }} />
      Sign in with GitHub
    </button>
  );
}

export default SignInWithGithub;
