import React, { useState, useEffect } from "react";
import "./css/hallManagement.css";
import { useNavigate } from "react-router-dom";

const HallManagement = () => {
  const navigate = useNavigate();

  const [halls, setHalls] = useState([]);
  const [error, setError] = useState(null);
  const [isSectionOpen, setIsSectionOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://shfe-diplom.neto-server.ru/alldata");
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log("Ответ от сервера:", data);
        const rawHalls = data?.result?.halls || [];
        if (!Array.isArray(rawHalls)) {
          throw new Error("Данные о залах отсутствуют или имеют неверный формат.");
        }

        const openHalls = rawHalls
          .filter((hall) => hall.hall_open === 1)
          .map((hall) => ({
            id: hall.id,
            name: hall.hall_name,
            rows: hall.hall_rows,
            places: hall.hall_places,
            config: hall.hall_config,
            priceStandart: hall.hall_price_standart,
            priceVip: hall.hall_price_vip,
            open: hall.hall_open,
          }));

        setHalls(openHalls); 
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const handleCreateHallClick = () => {
    navigate("/admin/CreateHall");
  };

  const handleDeleteHall = (hallId) => {
    const updatedHalls = halls.filter((hall) => hall.id !== hallId);
    setHalls(updatedHalls);
  };

  const toggleSection = () => {
    setIsSectionOpen((prev) => !prev);
  };

  return (
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
          <div
            className="closed-content"
            onClick={toggleSection}
            style={{ cursor: "pointer" }}
          ></div>
        </header>
        {isSectionOpen && (
          <div className="cul cul-conf-step-wrapper">
            {error ? (
              <p className="error-message">{error}</p>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HallManagement;