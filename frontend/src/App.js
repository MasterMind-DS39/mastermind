import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Layout/Navbar';
import Home from './Pages/Home';
import { Route, Routes } from 'react-router-dom';
import AddProfile from './Profiles/AddProfiles';
import EditProfile from './Profiles/EditProfile';
import ViewPeofile from './Profiles/ViewPeofile';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/addprofile" element={<AddProfile />} />
        <Route exact path="/editprofile/:id" element={<EditProfile />} />
        <Route exact path="/viewprofile/:id" element={<ViewPeofile />} />
      </Routes>
    </div>
  );
}

export default App;