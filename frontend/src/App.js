// App.js
import './App.css';
import LoginPage from './Components/LoginPage/LoginPage';
import Home from './Components/HomePage/Home';
import Profile from './Components/UserProfile/Profile';
import PublicProfile from './Components/UserProfile/PublicProfile'; // <-- NEW
import Conversations from './Components/Chat/Conversations';
import SavedPosts from './Components/SavedPosts/SavedPosts';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const isLoggedIn = localStorage.getItem("users") !== undefined && localStorage.getItem("users") !== null;

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/profile/:userId" element={isLoggedIn ? <PublicProfile /> : <Navigate to="/login" />} />
          <Route path="/conversations" element={isLoggedIn ? <Conversations /> : <Navigate to="/login" />} />
          <Route path="/saved" element={isLoggedIn ? <SavedPosts /> : <Navigate to="/login" />} />
          <Route path="*" element={isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
