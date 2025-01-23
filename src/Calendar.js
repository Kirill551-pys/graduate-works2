import React from 'react';
import './App.css'; 

const Calendar = () => {
  return (
    <nav className='nav'>
      <div className="day" data-date="2023-10-31">
        <div className="today">Сегодня</div>
        <div className="date">Пн, 31</div>
      </div>
      <div className="day" data-date="2023-11-01">
        <div className="week-day">Вт,</div>
        <div className="date">1</div>
      </div>
      <div className="day" data-date="2023-11-02">
        <div className="week-day">Ср,</div>
        <div className="date">2</div>
      </div>
      <div className="day" data-date="2023-11-03">
        <div className="week-day">Чт,</div>
        <div className="date">3</div>
      </div>
      <div className="day" data-date="2023-11-04">
        <div className="week-day">Пт,</div>
        <div className="date">4</div>
      </div>
      <div className="day weekend" data-date="2023-11-05">
        <div className="week-day">Сб,</div>
        <div className="date">5</div>
      </div>
      <div className="day weekend" data-date="2023-11-06">
        <div className="week-day">Вс,</div>
        <div className="date">6</div>
      </div>
    </nav>
  );
};

export default Calendar;