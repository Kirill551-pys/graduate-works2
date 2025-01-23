import React, { useEffect, useState } from 'react';

const CinemaData = () => {
  const [halls, setHalls] = useState([]); 
  const [films, setFilms] = useState([]);
  const [seances, setSeances] = useState([]); 
  const [error, setError] = useState(''); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://shfe-diplom.neto-server.ru/alldata');
        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }
        const data = await response.json();
        setHalls(data.halls || []); 
        setFilms(data.films || []); 
        setSeances(data.seances || []); 
      } catch (err) {
        setError(err.message); 
      }
    };

    fetchData(); 
  }, []); 

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>} {}

      <h2>Кинозалы</h2>
      <ul>
        {halls.length > 0 ? (
          halls.map(hall => (
            <li key={hall.id}>
              <strong>{hall.hall_name}</strong> - {hall.hall_rows} рядов, {hall.hall_places} мест
              <br />
              Цена обычного билета: {hall.hall_price_standart} руб.
              <br />
              Цена ВИП билета: {hall.hall_price_vip} руб.
              <br />
              {hall.hall_open === 1 ? 'Кинозал открыт' : 'Кинозал закрыт'}
            </li>
          ))
        ) : (
          <li>Нет доступных залов</li> 
        )}
      </ul>

      <h2>Фильмы</h2>
      <ul>
        {films.length > 0 ? (
          films.map(film => (
            <li key={film.id}>
              <strong>{film.film_name}</strong> - {film.film_duration} минут
              <br />
              Страна: {film.film_origin}
              <br />
              <img src={film.film_poster} alt={film.film_name} style={{ width: '100px' }} />
            </li>
          ))
        ) : (
          <li>Нет доступных фильмов</li> 
        )}
      </ul>

      <h2>Сеансы</h2>
      <ul>
        {seances.length > 0 ? (
          seances.map(seance => (
            <li key={seance.id}>
              Сеанс фильма ID {seance.seance_filmid} в зале ID {seance.seance_hallid} в {seance.seance_time}
            </li>
          ))
        ) : (
          <li>Нет доступных сеансов</li> 
        )}
      </ul>
    </div>
  );
};

export default CinemaData;