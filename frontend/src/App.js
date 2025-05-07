import React from 'react';
import UserProfile from './components/UserProfile';

function App() {
  // For demo, fixed userId = 1
  const userId = 1;

  return (
    <div style={{ maxWidth: 350, margin: 'auto', padding: 10 }}>
      <h2 style={{ textAlign: 'center', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
        User Profile
      </h2>
      <UserProfile userId={userId} />
    </div>
  );
}

export default App;
