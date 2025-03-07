import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/createHall.css";

const CreateHall = () => {
  const navigate = useNavigate();
  const [hallName, setHallName] = useState("");

  const handleSaveHall = () => {
    if (!hallName.trim()) {
      alert("Введите название зала!");
      return;
    }

    const currentHalls = JSON.parse(localStorage.getItem("halls")) || [];

    const newHall = { id: Date.now(), name: hallName };

    const updatedHalls = [...currentHalls, newHall];
    localStorage.setItem("halls", JSON.stringify(updatedHalls));

    navigate("/admin");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container"> 
      <div className="row row-create-hall-content">
        <div className="cul cul-popur-header">
          <div className="heading-popur">
            <p className="text-popur">Добавление зала</p>
            <button className="back-button" onClick={handleBack}></button>
          </div>
        </div>
        <form className="cul cul-form-contain-create">
          <label className="label-form-contain">
            <p className="text-label-contain">Название зала</p>
            <input
              type="text"
              value={hallName}
              onChange={(e) => setHallName(e.target.value)}
              placeholder="Например, Зал 1"
              className="input-form-contain"
            />
          </label>
        </form>
        <div className="cul cul-contain-create-buttons">
          <button className="save-button-2" onClick={handleSaveHall}>
            <p className="text-save-2">Добавить зал</p>
          </button>
          <button className="cancel-button" onClick={handleBack}>
            <p className="text-cancel">Отмена</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateHall;