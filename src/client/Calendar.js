import React, { useState } from 'react';
import '../App.css';

const Calendar = () => {
  // Устанавливаем начальное состояние на дату кнопки "Сегодня"
  const [selectedDate, setSelectedDate] = useState('2023-10-31'); // Дата кнопки "Сегодня"

  // Массив с данными о днях
  const days = [
    { date: '2023-10-31', label: 'Пн, 31', isToday: true },
    { date: '2023-11-01', label: 'Вт, 1' },
    { date: '2023-11-02', label: 'Ср, 2' },
    { date: '2023-11-03', label: 'Чт, 3' },
    { date: '2023-11-04', label: 'Пт, 4' },
    { date: '2023-11-05', label: 'Сб, 5', isWeekend: true },
    { date: '2023-11-06', label: 'Вс, 6', isWeekend: true },
  ];

  // Обработчик клика по дню
  const handleDayClick = (date) => {
    setSelectedDate(date);
    console.log('Выбран день:', date);
  };

  return (
    <div className="container">
      <nav className="row row-nav m-0">
        {days.map(({ date, label, isToday, isWeekend }) => (
          <div
            key={date}
            className={`cul cul-day ${isWeekend ? 'weekend' : ''} ${
              selectedDate === date ? 'selected' : ''
            }`}
            onClick={() => handleDayClick(date)}
          >
            {isToday && <div className="today">Сегодня</div>}
            <div className="date">{label}</div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Calendar;