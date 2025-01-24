import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './Header';
import Calendar from './Calendar';
import CinemaData from './CinemaData';
import SeanceDetail from './SeanceDetail'; 

  function HomePage() {
    return (
      <div>
        <Header />
        <Calendar />
        <CinemaData />
      </div>
    );
  }

  function App() {
    return (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/seance/:id" element={<SeanceDetail />} />
        </Routes>
    );
  }
  
  export default App;