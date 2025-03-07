import React, { useState } from 'react';
import '../App.css'; 

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDayClick = (date) => {
    setSelectedDate(date); 
    console.log('Выбран день:', date); 
  };

  return (
    <div className="container ">
      <nav className="row row-nav m-0">
        <div
          className={`cul cul-day small ${selectedDate === '2023-10-31' ? 'selected' : ''}`}
          data-date="2023-10-31"
          onClick={() => handleDayClick('2023-10-31')}
        >
          <div className="today">Сегодня</div>
          <div className="date">Пн, 31</div>
        </div>
        <div
          className={`cul cul-day ${selectedDate === '2023-11-01' ? 'selected' : ''}`}
          data-date="2023-11-01"
          onClick={() => handleDayClick('2023-11-01')}
        >
          <div className="week-day">Вт,</div>
          <div className="date">1</div>
        </div>

        <div
          className={`cul cul-day ${selectedDate === '2023-11-02' ? 'selected' : ''}`}
          data-date="2023-11-02"
          onClick={() => handleDayClick('2023-11-02')}
        >
          <div className="week-day">Ср,</div>
          <div className="date">2</div>
        </div>

        <div
          className={`cul cul-day ${selectedDate === '2023-11-03' ? 'selected' : ''}`}
          data-date="2023-11-03"
          onClick={() => handleDayClick('2023-11-03')}
        >
          <div className="week-day">Чт,</div>
          <div className="date">3</div>
        </div>

        <div
          className={`cul cul-day ${selectedDate === '2023-11-04' ? 'selected' : ''}`}
          data-date="2023-11-04"
          onClick={() => handleDayClick('2023-11-04')}
        >
          <div className="week-day">Пт,</div>
          <div className="date">4</div>
        </div>

        <div
          className={`cul cul-day weekend ${selectedDate === '2023-11-05' ? 'selected' : ''}`}
          data-date="2023-11-05"
          onClick={() => handleDayClick('2023-11-05')}
        >
          <div className="week-day">Сб,</div>
          <div className="date">5</div>
        </div>

        <div
          className={`cul cul-day weekend ${selectedDate === '2023-11-06' ? 'selected' : ''}`}
          data-date="2023-11-06"
          onClick={() => handleDayClick('2023-11-06')}
        >
          <div className="week-day">Вс,</div>
          <div className="date">6</div>
        </div>
      </nav>
    </div>
  );
};

export default Calendar;