import React, { useState, useEffect } from "react";
import "./css/hallManagement.css";
import { useNavigate } from "react-router-dom";

const HallManagement = () => {
  const navigate = useNavigate();

  const [halls, setHalls] = useState([]);

  useEffect(() => {
    const savedHalls = JSON.parse(localStorage.getItem("halls")) || [];
    setHalls(savedHalls);
  }, []);

  useEffect(() => {
    localStorage.setItem("halls", JSON.stringify(halls));
  }, [halls]);

  const handleCreateHallClick = () => {
    navigate("/admin/CreateHall");
  };

  const handleDeleteHall = (hallId) => {
    const updatedHalls = halls.filter((hall) => hall.id !== hallId);
    setHalls(updatedHalls);
  };

  return (
    <>
    <div className="container p-0"> 
      <header className="row row-header-directorate">
        <div className="cul">
        <h1 className="heading-hall">
          <strong>ИДЁМ</strong>
          <span className="span">В</span>
          <strong>КИНО</strong>
        </h1>
        <p className="text-directorate">администраторская</p>
        </div>
      </header>
      <section className="row row-section-hall m-0">
        <header className="cul cul-header-directorate-section">
          <div className="line"></div>
          <h2 className="heading-directorate-section">управление залами</h2>
        </header>
        <div className="cul cul-conf-step-wrapper">
          <p className="text-available-halls">Доступные залы:</p>
          <ul className="list">
            {halls.length > 0 ? (
              halls.map((hall) => (
                <li key={hall.id} className="item">
                  <p className="text-item">{hall.name}</p>
                  <button
                    className="button-item delete-button"
                    onClick={() => handleDeleteHall(hall.id)}
                  >
                  </button>
                </li>
              ))
            ) : (
              <li className="item">
                <p className="text-item">Залы отсутствуют</p>
              </li>
            )}
          </ul>
          <button
            className="button-directorate"
            onClick={handleCreateHallClick}
          >
            <p className="text-create">Создать зал</p>
          </button>
        </div>
      </section>
      </div>
    </>
  );
};

export default HallManagement;