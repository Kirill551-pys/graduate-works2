// SeanceDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';

const SeanceDetail = () => {
  const { id } = useParams(); // Получаем id из URL

  return (
    <div>
      <h1>Детали сеанса</h1>
      <p>Вы выбрали сеанс с ID: {id}</p>
      {/* Здесь можно добавить больше информации о сеансе */}
    </div>
  );
};

export default SeanceDetail;