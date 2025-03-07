import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const navigate = useNavigate();

  const onButtonClick = () => {
    navigate("/admin/login")
  }

  return (
    <div className='container'> 
          <div className='row row-header m-0'>
      <div className='col'>
      <p className='text-heading-client'>
        <strong>ИДЁМ</strong>
        <span className='span'>В</span>
        <strong>КИНО</strong>
      </p>
      </div>
      <div className='col cul-button'>
      <button className="button"  onClick={onButtonClick}>Войти</button>
      </div>
          </div>
          </div>
  );
};


export default Header;