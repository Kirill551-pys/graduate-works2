import React, { useEffect, useState } from "react";
import "./css/SesionGrid.css";
import { useNavigate } from "react-router-dom";
import * as interact  from "interactjs";

const SesionGrid = () => {
    const navigate = useNavigate();
    const [films, setFilms] = useState([]);
    const [seances, setSeances] = useState({}); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [selectedFilm, setSelectedFilm] = useState(null); 
    const [selectedHall, setSelectedHall] = useState(null); 
    const [startTime, setStartTime] = useState(""); 

    const [selectedFilmId, setSelectedFilmId] = useState("");
    const [selectedHallId, setSelectedHallId] = useState("");
    
    const loadFilmsFromStorage = () => {
        const storedFilms = localStorage.getItem("films");
        if (storedFilms) {
            try {
                const filmsArray = JSON.parse(storedFilms);
                if (Array.isArray(filmsArray)) {
                    setFilms(filmsArray);
                } else {
                    console.error("Неверный формат данных в localStorage.");
                }
            } catch (error) {
                console.error("Ошибка при чтении данных из localStorage:", error);
            }
        }
    };
    useEffect(() => {
        loadFilmsFromStorage();

        interact(".draggable-film").draggable({
            listeners: {
                move(event) {
                    const target = event.target;
                    const x = parseFloat(target.getAttribute("data-x")) || 0;
                    const y = parseFloat(target.getAttribute("data-y")) || 0;

                    target.style.transform = `tranlate(${x + event.dx}px, ${y + event.dy}px)`;
                    target.setAttribute("data-x", x + event.dx);
                    target.setAttribute("data-y", y + event.dy);
                },
            },
            autoScroll: true,
        });

        interact(".droppable-hall").dropzone({
            accept: "draggable-film",
            overlap: 0.5,
            ondrop: (event) => {
                const filmId = event.relatedTarget.dataset.filmId;
                const film = films.find((f) => f.id === filmId);

                if (film) {
                    setSelectedFilm(film);
                    setSelectedHall(event.target.dataset.hallId);
                    setIsModalOpen(true);
                }
            },
        });

        return () => {
            interact(".draggable-film").unset();
            interact(".draggable-hall").unset();
        };
    }, []);

    const saveFilmsToStorage = () => {
        localStorage.setItem("films", JSON.stringify(films));
    };

    const saveSeancesToStorage = () => {
        localStorage.setItem("seances", JSON.stringify(seances));
    };

    const handleDeleteFilm = (index) => {
        const updatedFilms = films.filter((_, i) => i !== index);
        setFilms(updatedFilms);
        saveFilmsToStorage();
        localStorage.setItem("films", JSON.stringify(updatedFilms));
    };

    const handleDragStart = React.useCallback ((event, index) => {
        event.dataTransfer.setData("text", index.toString());
    }, []);


    const handleDrop = React.useCallback((event, hallId) => {
        event.preventDefault();
        const filmId = event.dataTransfer.getData("text"); 
        const film = films.find((f, idx) => idx === parseInt(filmId, 10)); 

        if (film) {
            setSelectedFilm(film); 
            setSelectedHall(hallId); 
            setIsModalOpen(true); 
        }
    }, [films, setSelectedFilm, setSelectedHall, setIsModalOpen]);

    const allowDrop = (event) => {
        event.preventDefault();
    };

    const addSession = () => {
        if (!startTime.trim()) {
            alert("Укажите время начала сеанса!");
            return;
        }
        const existingSession = seances[selectedHall]?.find(
            (session) => session.startTime === startTime
        );

        if (existingSession) {
            alert(`Сеанс в это время (${startTime}) уже существует в Зале ${selectedHall}.`);
            return;
        }
        
        setSeances((prevSeances) => {
            const newSeances = { ...prevSeances };
            if (!newSeances[selectedHall]) {
                newSeances[selectedHall] = [];
            }
            newSeances[selectedHall].push({
                ...selectedFilm,
                startTime: startTime, 
            });
            return newSeances;
        });

        setIsModalOpen(false);
        setSelectedFilm(null);
        setSelectedHall(null);
        setStartTime("");
        saveFilmsToStorage();
    };

    const cancelSession = () => {
        setIsModalOpen(false);
        setSelectedFilm(null);
        setSelectedHall(null);
        setStartTime("");
    };

    const handleSaveAll = () => {
        saveFilmsToStorage();
        saveSeancesToStorage();
        alert("Данные успешно сохраненые");
    };

    const handleBack = () => {
        cancelSession();
    }

    
    useEffect(() => {
        loadFilmsFromStorage();
        console.log("Текущие фильмы:", films);
    }, []);

    const onButtonClick = () => {
        navigate("/admin/AddFilm");
    };

    return (
        <div className="container p-0">
        <section className="section-hall-4">
            <div className="row m-0">
            <header className="cul cul-header-directorate-section">
                <div className="line-2"></div>
                <h2 className="heading-directorate-section">Сетка сеансов</h2>
            </header>
            </div>
            <div className="row row-conf-step-wrapper-4 m-0">
                <div className="cul cul-sesion-paragraph">
                    <button className="button-sesion" onClick={onButtonClick}>
                        <p className="text-sesion">Добавить фильм</p>
                    </button>
                </div>
                <div className="cul cul-film-list">
                    {films.length > 0 ? (
                        films.map((film, index) => (
                            <div
                                key={index}
                                className="film-card"
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)} 
                            >
                                <img
                                    src={film.poster}
                                    alt={film.title}
                                    style={{ width: "38px", height: "50px" }}
                                />
                                <div className="Frame-12">
                                    <div className="film-card-2">
                                        <h3 className="text-card">{film.title}</h3>
                                        <p className="text-time">{film.duration} минут</p>
                                    </div>
                                </div>
                                <button
                                    className="delete-film"
                                    onClick={() => handleDeleteFilm(index)}
                                ></button>
                            </div>
                        ))
                    ) : (
                        <p>Фильмы не найдены</p>
                    )}
                </div>
                <div className="cul cul-conf-step-seances">
                    {[1, 2].map((hallId) => (
                        <div key={hallId} className="conf-step-seances-hall">
                            <div className="conf-step-seances-hall-heading">
                                <h3 className="text-hall-heading">Зал {hallId}</h3>
                            </div>
                            <div
                                className="timeline"
                                onDrop={(e) => handleDrop(e, hallId)} 
                                onDragOver={allowDrop} 
                            >
                                {seances[hallId]?.map((session, sessionIndex) => (
                                    <div
                                        key={sessionIndex}
                                        className="session-item"
                                    >
                                        <div className="session-item-title">
                                            <p className="session-item-title-text">{session.title}</p>
                                        </div>
                                        <div className="session-item-time">
                                            <p className="session-item-time-text">{session.startTime}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {isModalOpen && (
                    <div className="container modal-overlay">
                        <div className="row row-modal-content">
                            <div className="cul cul-modal-header">
                                <div className="modal-heading"> 
                                    <h3>Добавление сеанса</h3>
                                    <button className="back-button" onClick={handleBack}>
                                    </button>
                                </div>
                            </div>
                            <div className="cul cul-modal-form">
                            <label className="label-modal-form">
                                <p className="text-label-modal-form">Название зала</p>
                                <select
                                    value={selectedHallId}
                                    onChange={(e) => setSelectedHallId(e.target.value)}
                                    className="select-modal-form"
                                >
                                    <option value="" disabled hidden className="option-select">
                                        <p className="text-option-select">Выберите зал</p>
                                    </option>
                                    {[1, 2].map((hallId) => (
                                        <option key={hallId} value={hallId}>
                                            Зал {hallId}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="label-modal-form">
                                <p className="text-label-modal-form">Название фильма</p>                 
                                <select
                                    value={selectedFilmId}
                                    onChange={(e) => setSelectedFilmId(e.target.value)}
                                    className="select-modal-form"
                                >
                                    <option value="" disabled hidden>
                                        <p className="text-option-select">Выберите фильма</p>
                                    </option>
                                    {films.map((film) => (
                                        <option key={film.id || film.title} value={film.id || film.title}>
                                            {film.title}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="label-modal-form">
                            <p className="text-label-modal-form">Время начала</p>                 
                            <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="select-modal-form"
                                />
                            </label>
                            </div>
                            <div className="cul cul-modal-buttons">
                                <button onClick={addSession} className="button-modal-1">
                                    <p className="text-button-mods">Добавить фильм</p>
                                </button>
                                <button onClick={cancelSession} className="button-modal-2">Отмена</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="cul cul-fieldset-grid-seances">
                <button onClick={cancelSession} className="button-modal-2">Отмена</button>
                <button onClick={handleSaveAll} className="save-button">
                <p className="text-save">Сохранить</p>
                    </button>
                </div>
            </div>
        </section>
        </div>
    );
};

export default SesionGrid;