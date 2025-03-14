import React, { useState, useEffect, useCallback } from "react";
import "./css/OpenSale.css";

const OpenSale = () => {
  const [selectedHallId, setSelectedHallId] = useState(null);
  const [hallsState, setHallsState] = useState([]); 
  const [isSectionOpen, setIsSectionOpen] = useState(true);

  const fetchHallsFromServer = async () => {
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

      const hallsData = rawHalls.map((hall) => ({
        id: hall.id,
        name: hall.hall_name,
        isActive: hall.hall_open === 1, 
      }));

      setHallsState(hallsData); 
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  useEffect(() => {
    fetchHallsFromServer();
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

  const toggleSection = () => {
    setIsSectionOpen((prev) => !prev);
  };

  return (
    <div className="container p-0">
      <section className="section-hall-5">
        <div className="row m-0">
          <header className="cul cul-header-directorate-section">
            <div className="line-3"></div>
            <h2 className="heading-directorate-section">открыть продажи</h2>
            <div
              className="closed-content"
              onClick={toggleSection}
              style={{ cursor: "pointer" }}
            ></div>
          </header>
        </div>
        {isSectionOpen && (
          <div className="row row-wrapper-open-sale m-0">
            <div className="cul cul-paragraph-open-sale">
              <p className="text-paragraph-open-sale">
                Выберите зал для открытия/закрытия продаж:
              </p>
            </div>
            <ul className="list-2">
              {hallsState.length > 0 ? (
                hallsState.map((hall) => (
                  <li
                    key={hall.id}
                    className={`item-2 ${
                      selectedHallId === hall.id ? "active" : ""
                    }`}
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
        )}
      </section>
    </div>
  );
};

export default OpenSale;