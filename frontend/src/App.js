import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';

import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Auth from './pages/AuthPage';

const App = () => {
  return (
    <BrowserRouter>
      <Container maxWidth="lg">
        {/* Navbar handles its own "user" state using useLocation */}
        <Navbar />
        <Routes>
          {/* Default path redirects to posts */}
          <Route path="/" element={<Navigate to="/posts" />} />
          
          {/* Main Feed */}
          <Route path="/posts" element={<Home />} />
          
          {/* Auth Page: We allow the component to handle logic internally 
              to avoid the stale localStorage variable issue */}
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;