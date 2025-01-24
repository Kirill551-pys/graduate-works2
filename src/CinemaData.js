import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link

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
        console.log('data', data);
        setFilms(data.result.films || []); 
        setSeances(data.result.seances || []); 
        setHalls(data.result.halls || []); 
      } catch (err) {
        setError(err.message); 
      }
    };

    fetchData(); 
  }, []); 

  return (
    <div className='contain'>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <>
        {films.length > 0 ? (
          films.map(film => (
            <div className='movie' key={film.id}>
              <img className='movie-img' src={film.film_poster} alt={film.film_name} />
              <div className='movie__description'> 
                <div className='movie-text'>
                  <strong>{film.film_name}</strong> 
                </div>
                <div className='movie-data'>
                  {film.film_duration} минут
                  Страна: {film.film_origin}
                </div>
              </div>
              <div className='movie-seances__hall'>
                {halls.length > 0 ? (
                  halls.map(hall => (
                    <div className='movie-seances' key={hall.id}>
                      <strong className='hall-name'>{hall.hall_name}</strong>
                      <div className='seances-name'>
                        {seances.length > 0 ? (
                          seances.map(seance => (
                            <Link to={`/seance/${seance.id}`} className='time' key={seance.id}>
                              {seance.seance_time}
                            </Link>
                          ))
                        ) : (
                          <div>Нет доступных сеансов</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div>Нет доступных залов</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <li>Нет доступных фильмов</li> 
        )}
      </>
    </div>
  );
};

export default CinemaData;