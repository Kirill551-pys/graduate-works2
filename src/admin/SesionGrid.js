import React, { useEffect, useState } from "react";
import "./css/SesionGrid.css";
import { useNavigate } from "react-router-dom";
import * as interact from "interactjs";

const SesionGrid = () => {
  const navigate = useNavigate();

  // Состояния для хранения данных
  const [films, setFilms] = useState([]);
  const [seances, setSeances] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [selectedHall, setSelectedHall] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [selectedFilmId, setSelectedFilmId] = useState("");
  const [selectedHallId, setSelectedHallId] = useState("");
  const [isSectionOpen, setIsSectionOpen] = useState(true);

  // Функция для загрузки данных с сервера
  const fetchFilmsFromServer = async () => {
    try {
      const response = await fetch("https://shfe-diplom.neto-server.ru/alldata");
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const data = await response.json();
      console.log("Ответ от сервера:", data); // Логирование для отладки

      // Проверка наличия данных о фильмах
      const rawFilms = data?.result?.films || [];
      if (!Array.isArray(rawFilms)) {
        throw new Error("Данные о фильмах отсутствуют или имеют неверный формат.");
      }

      // Преобразуем данные о фильмах в удобный формат
      const filmsData = rawFilms.map((film) => ({
        id: film.id,
        title: film.film_name,
        duration: film.film_duration,
        poster: film.film_poster,
      }));

      setFilms(filmsData); // Сохраняем данные о фильмах в состоянии
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchFilmsFromServer();
  }, []);

  // Сохранение фильмов в localStorage
  const saveFilmsToStorage = () => {
    localStorage.setItem("films", JSON.stringify(films));
  };

  // Сохранение сеансов в localStorage
  const saveSeancesToStorage = () => {
    localStorage.setItem("seances", JSON.stringify(seances));
  };

  // Удаление фильма
  const handleDeleteFilm = (index) => {
    const updatedFilms = films.filter((_, i) => i !== index);
    setFilms(updatedFilms);
    saveFilmsToStorage();
  };

  // Обработчик начала перетаскивания фильма
  const handleDragStart = React.useCallback((event, index) => {
    event.dataTransfer.setData("text", index.toString());
  }, []);

  // Обработчик добавления сеанса
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

  // Обработчик отмены добавления сеанса
  const cancelSession = () => {
    setIsModalOpen(false);
    setSelectedFilm(null);
    setSelectedHall(null);
    setStartTime("");
  };

  // Обработчик сохранения всех данных
  const handleSaveAll = () => {
    saveFilmsToStorage();
    saveSeancesToStorage();
    alert("Данные успешно сохранены!");
  };

  // Обработчик сворачивания/разворачивания секции
  const toggleSection = () => {
    setIsSectionOpen((prev) => !prev);
  };

  return (
    <div className="container p-0">
      <section className="section-hall-4">
        <div className="row m-0">
          <header className="cul cul-header-directorate-section">
            <div className="line-2"></div>
            <h2 className="heading-directorate-section">Сетка сеансов</h2>
            <div
              className="closed-content"
              onClick={toggleSection}
              style={{ cursor: "pointer" }}
            ></div>
          </header>
        </div>
        {isSectionOpen && (
          <div className="row row-conf-step-wrapper-4 m-0">
            <div className="cul cul-sesion-paragraph">
              <button className="button-sesion" onClick={() => navigate("/admin/AddFilm")}>
                <p className="text-sesion">Добавить фильм</p>
              </button>
            </div>
            <div className="cul cul-film-list">
              {films.length > 0 ? (
                films.map((film, index) => (
                  <div
                    key={film.id}
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
                  <div className="timeline">
                    {seances[hallId]?.map((session, sessionIndex) => (
                      <div key={sessionIndex} className="session-item">
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
                      <button className="back-button" onClick={cancelSession}></button>
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
                        <option value="" disabled hidden>
                          Выберите зал
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
                          Выберите фильм
                        </option>
                        {films.map((film) => (
                          <option key={film.id} value={film.id}>
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
                    <button onClick={cancelSession} className="button-modal-2">
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="cul cul-fieldset-grid-seances">
              <button onClick={cancelSession} className="button-modal-2">
                <p className="text-reset">Отмена</p>
              </button>
              <button onClick={handleSaveAll} className="save-button">
                <p className="text-save">Сохранить</p>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SesionGrid;