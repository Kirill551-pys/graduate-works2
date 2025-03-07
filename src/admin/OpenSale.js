import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./css/OpenSale.css";

const OpenSale = () => {
  const [selectedHallId, setSelectedHallId] = useState(null);
  const [hallsState, setHallsState] = useState([]);

  const halls = useMemo(() => JSON.parse(localStorage.getItem("halls")) || [], []);

  useEffect(() => {
    setHallsState(halls);
  }, [halls]);

  useEffect(() => {
    const savedHalls = JSON.parse(localStorage.getItem("halls"));
    if (!Array.isArray(savedHalls)) {
      console.warn("Некорректные данные о залах в localStorage. Используется пустой массив.");
      localStorage.setItem("halls", JSON.stringify([]));
    }
  }, []); 

  useEffect(() => {
    const handleStorageChange = () => {
      const savedHalls = JSON.parse(localStorage.getItem("halls")) || [];
      if (!Array.isArray(savedHalls)) {
        console.warn("Некорректные данные о залах в localStorage. Используется пустой массив.");
        localStorage.setItem("halls", JSON.stringify([]));
      }
      setHallsState(savedHalls);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleHallClick = useCallback((hallId) => {
    setSelectedHallId((prevSelectedHallId) =>
      prevSelectedHallId === hallId ? null : hallId
    );
  }, []);

  const toggleSaleStatus = () => {
    if (!selectedHallId) {
      alert("Выберите зал для управления продажами.");
      return;
    }

    const updatedHalls = hallsState.map((hall) =>
      hall.id === selectedHallId
        ? {
            ...hall,
            isActive: !hall.isActive, 
          }
        : hall
    );

    setHallsState(updatedHalls);

    localStorage.setItem("halls", JSON.stringify(updatedHalls));

    const hallName = updatedHalls.find((hall) => hall.id === selectedHallId)?.name;
    const status = updatedHalls.find((hall) => hall.id === selectedHallId)?.isActive
      ? "открыт"
      : "закрыт";

    alert(`Статус зала "${hallName}" успешно ${status}!`);
  };

  return (
    <div className="container p-0">
    <section className="section-hall-5">
      <div className="row m-0"> 
      <header className="cul cul-header-directorate-section">
        <div className="line-3"></div>
        <h2 className="heading-directorate-section">открыть продажи</h2>
      </header>
      </div>
      <div className="row row-wrapper-open-sale m-0">
        <div className="cul cul-paragraph-open-sale">
          <p className="text-paragraph-open-sale">
            Выберите зал для открытия/закрытия продаж:
          </p>
        </div>
        <ul className="list-2">
          {Array.isArray(hallsState) && hallsState.length > 0 ? (
            hallsState.map((hall) => (
              <li
                key={hall.id}
                className={`item-2 ${selectedHallId === hall.id ? "active" : ""}`}
                onClick={() => handleHallClick(hall.id)}
                style={{ cursor: "pointer" }}
              >
                <span className="conf-step-selector">
                  <p className="text-selector">{hall.name}</p>
                </span>
              </li>
            ))
          ) : (
            <li className="item-2">
              <p className="text-selector">Залы отсутствуют</p>
            </li>
          )}
        </ul>
        <div className="cul cul-paragraph-open-sale-2">
          <p className="text-this-open">Все готово к открытию</p>
        </div>
        {selectedHallId && (
          <button
            onClick={toggleSaleStatus}
            disabled={!hallsState.find((hall) => hall.id === selectedHallId)}
            className="open-sale-button"
          >
        <span
    className={
      hallsState.find((hall) => hall.id === selectedHallId)?.isActive
        ? "text-pause"
        : "text-open"
    }
  >
    {hallsState.find((hall) => hall.id === selectedHallId)?.isActive
      ? "Приостановить продажу билетов"
      : "Открыть продажу билетов"}
  </span>
          </button>
        )}
      </div>
    </section>
    </div>
  );
};

export default OpenSale;