import React, { useState } from "react";
import "./css/AddFilm.css";
import { useNavigate } from "react-router-dom";

const AddFilm = () => {

    const [filmTitle, setFilmTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState("");
    const [poster, setPoster] = useState(null);

    const navigate = useNavigate();

    const handleTitleChange = (event) => setFilmTitle(event.target.value);
    const handleDurationChange = (event) => setDuration(event.target.value);
    const handleDescription = (event) => setDescription(event.target.value);
    const handleCountry = (event) => setCountry(event.target.value);

    const handlePosterChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPoster(file);
        }
    };

    const handleSaveFilm = () => {
        if (!filmTitle || !duration || !description || !country || !poster) {
            alert("Заполните все поля!");
            return;
        }

        const newFilm = {
            title: filmTitle,
            duration: duration,
            description: description,
            country: country,
            poster: URL.createObjectURL(poster),
        };

        let films = [];
        const storedFilms = localStorage.getItem("films");
        if (storedFilms) {
            films = JSON.parse(storedFilms);
        }

        films.push(newFilm);

        localStorage.setItem("films", JSON.stringify(films));
        navigate("/admin");
    };
    
    const handleBack = () => {
        navigate(-1);
    };

    const handleUploadPoster = () => {
        document.getElementById("hidden-file-input").click();
    };

    return (
        <div className="container" >
            <div className="row row-popur-content">
                <div className="cul cul-popur-header">
                    <div className="heading-popur">
                        <p className="text-popur">Добавление фильма</p>
                        <button className="back-button" onClick={handleBack}>
                        </button>
                    </div>
                </div>
                <div className="cul cul-popur-form">
                    <label htmlFor="film-title" className="label-title">
                        <p className="text-title">Название фильма</p>
                        <input
                            type="text"
                            id="film-title"
                            value={filmTitle}
                            onChange={handleTitleChange}
                            placeholder="Например, Планета Обезьян"
                            className="title-input"
                        />
                    </label>
                    <label htmlFor="film-duration" className="label-duraction">
                        <p className="text-duraction">Продолжительность фильма (мин.)</p>
                        <input
                            type="number"
                            id="film-duration"
                            value={duration}
                            onChange={handleDurationChange}
                            className="form-input"
                        />
                    </label>
                    <label htmlFor="film-description" className="label-description">
                        <p className="text-title">Описание фильма</p>
                        <textarea
                            id="film-description"
                            value={description}
                            onChange={handleDescription}
                            className="form-textarea"
                            ></textarea>
                    </label>
                    <label htmlFor="film-country" className="label-duraction">
                        <p className="text-country">Страна</p>
                        <input
                            type="text"
                            id="film-country"
                            value={country}
                            onChange={handleCountry}
                            className="form-input"
                        />
                    </label>
                </div>
                <div className="cul cul-conf-step-buttons">
                    <button className="save-button-2" onClick={handleSaveFilm}>
                        <p className="text-save-2">Добавить фильм</p>     
                    </button>
                    <button className="label-poster" onClick={handleUploadPoster}>
                        <p className="text-poster"> Добавить постер</p>
                        <input
                            type="file"
                            id="hidden-file-input"
                            accept="image/*"
                            onChange={handlePosterChange}
                            style={{display: "none"}}
                        />
                    </button>
                    <button className="cancel-button" onClick={handleBack}>
                        <p className="text-cancel">Отмена</p>
                    </button>     
                </div>
            </div>
        </div>
    );
};

export default AddFilm;