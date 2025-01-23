import React from 'react';
import Header from './Header';
import Calendar from './Calendar';
import CinemaData from './CinemaData';
import './App.css'; 

function App() {
  const handleClick = () => {
    alert('Кнопка нажата!');
  };

  return (
    <div className="App">
      <Header onButtonClick={handleClick} />
      <Calendar />
      <CinemaData />
    </div>
  );
}

export default App;
