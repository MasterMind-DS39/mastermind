import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import Home from './pages/Home';
import SkillsBrowse from './pages/skills/SkillsBrowse';
import SkillDetail from './pages/skills/SkillDetail';
import SkillCreate from './pages/skills/SkillCreate';
import SkillEdit from './pages/skills/SkillEdit';
import CategoriesList from './pages/categories/CategoriesList';
import CategoryDetail from './pages/categories/CategoryDetail';
import CategoryCreate from './pages/categories/CategoryCreate';
import CategoryEdit from './pages/categories/CategoryEdit';
import NotFound from './pages/NotFound';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 120px)', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Skill Routes */}
            <Route path="/skills" element={<SkillsBrowse />} />
            <Route path="/skills/create" element={<SkillCreate />} />
            <Route path="/skills/:id" element={<SkillDetail />} />
            <Route path="/skills/:id/edit" element={<SkillEdit />} />
            
            {/* Category Routes */}
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/categories/create" element={<CategoryCreate />} />
            <Route path="/categories/:id" element={<CategoryDetail />} />
            <Route path="/categories/:id/edit" element={<CategoryEdit />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;