import { Box, Container } from '@mui/material';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import NavBar from './features/NavBar';
import Registrations from './pages/Registrations';

export default function App() {
  return (
    <BrowserRouter>
    <NavBar />
    <Container maxWidth='lg'>
        <Box sx={{ minHeight: '50px' }} />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/registrations' element={<Registrations />} />

          <Route path='*' element={<Home />} />
        </Routes>
    </Container>
      </BrowserRouter>
  )
}
