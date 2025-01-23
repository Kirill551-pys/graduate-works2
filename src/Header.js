import React from 'react';
import './App.css'

const Header = ({ onButtonClick }) => {
  return (
    <header className='header'>
      <h1>
        <strong>ИДЁМ</strong>
        <span className='span'>В</span>
        <strong>КИНО</strong>
      </h1>
      <button className="button"  onClick={onButtonClick}>Войти</button>
    </header>
  );
};


export default Header;