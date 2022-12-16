import { Box, Container } from '@mui/material';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
    <Container maxWidth='lg'>
        <Box sx={{ minHeight: '50px' }} />
        <Routes>
          <Route path='/home' element={<Home />} /> 
          <Route path='*' element={<Home />} />
        </Routes>
    </Container>
      </BrowserRouter>
  )
}
