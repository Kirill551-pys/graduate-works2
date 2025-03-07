import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SeanceContext } from './SeanceContext';

function CinemaData() {
    const [films, setFilms] = useState([]);
    const [seances, setSeances] = useState([]);
    const [halls, setHalls] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setSelectedSeance } = useContext(SeanceContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://shfe-diplom.neto-server.ru/alldata');
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных');
                }
                const data = await response.json();
                const films = data?.result?.films || [];
                const rawSeances = data?.result?.seances || [];
                const halls = data?.result?.halls || [];
                const openHalls = halls.filter((hall) => hall.hall_open === 1);
                const filteredSeances = rawSeances
                    .filter((seance) =>
                        openHalls.some((hall) => hall.id === seance.seance_hallid)
                    )
                    .reduce((acc, seance) => {
                        const key = `${seance.seance_filmid}-${seance.seance_hallid}-${seance.seance_time}`;
                        if (!acc[key]) acc[key] = seance;
                        return acc;
                    }, {});
                const groupedSeances = Object.values(filteredSeances);
                const availableFilms = films.filter((film) =>
                    groupedSeances.some((seance) => seance.seance_filmid === film.id)
                );
                setFilms(availableFilms);
                setSeances(groupedSeances);
                setHalls(openHalls);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchData();
    }, []);

    const handleSelectSeance = (seance, film) => {
        const hall = halls.find((hall) => hall.id === seance.seance_hallid);
        setSelectedSeance({
            filmName: film.film_name,
            hallName: hall?.hall_name,
            hallId: hall?.id,
            seanceTime: seance.seance_time,
        });
        navigate('/client/SeanceDetail');
    };

    return (
        <div className="container"> 
            {error && <p style={{ color: 'red' }} className="text-center">{error}</p>}
            <>
                {films.length > 0 ? (
                    films.map((film) => (
                        <div className="row-movie" key={film.id}> 
                            <div className='cul'>
                                <img
                                    className="movie-img" 
                                    src={film.film_poster}
                                    alt={film.film_name}
                                />
                            </div>
                            <div className="cul cul-movie__description"> 
                                <div className="movie-text">
                                    <strong>{film.film_name}</strong>
                                </div>
                                <div className="film-description" dangerouslySetInnerHTML={{ __html: film.film_description }}></div>
                                <div className="movie-data">
                                    {film.film_duration} минут Страна: {film.film_origin}
                                </div>
                            </div>
                            <div className="cul cul-movie-seances__hall"> 
                                {halls.length > 0 ? (
                                    halls.map((hall) => {
                                        const filmSeances = seances.filter(
                                            (seance) =>
                                                seance.seance_filmid === film.id &&
                                                seance.seance_hallid === hall.id
                                        );
                                        if (filmSeances.length === 0) return null;
                                        return (
                                            <div className="movie-seances" key={hall.id}>
                                                <strong className="hall-name">
                                                    {hall.hall_name}
                                                </strong>
                                                <div className="seances-name"> 
                                                    {filmSeances.map((seance) => (
                                                        <button
                                                            onClick={() => handleSelectSeance(seance, film)}
                                                            className="time" 
                                                            key={seance.id}
                                                        >
                                                            {seance.seance_time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-danger">Нет доступных залов</div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <li className="text-center text-muted">Нет доступных фильмов</li>
                )}
            </>
        </div>
    );
}

export default CinemaData;