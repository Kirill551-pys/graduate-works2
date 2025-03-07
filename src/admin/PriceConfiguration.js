import React, { useState, useEffect, useMemo } from "react";
import "./css/PriceConfiguration.css";
import { debounce } from "lodash";

const PriceConfiguration = () => {
  const [selectedHallId, setSelectedHallId] = useState(null);
  const [hallPrices, setHallPrices] = useState({});

  const halls = useMemo(() => JSON.parse(localStorage.getItem("halls")) || [], []);

  useEffect(() => {
    const savedHallPrices = {};
    halls.forEach((hall) => {
      if (hall.prices) {
        savedHallPrices[hall.id] = hall.prices;
      }
    });

    if (JSON.stringify(savedHallPrices) !== JSON.stringify(hallPrices)) {
      setHallPrices(savedHallPrices);
    }
  }, [halls]);

  const handleSelectHall = (hallId) => {
    setSelectedHallId(hallId);
  };

  const getHallPrices = (hallId) => {
    return hallPrices[hallId] || { regular: 0, vip: 0 };
  };

  const { regular, vip } = getHallPrices(selectedHallId);

  const debouncedUpdateHallPrices = debounce((hallId, prices) => {
    setHallPrices((prevPrices) => ({
      ...prevPrices,
      [hallId]: prices,
    }));

    const updatedHalls = halls.map((hall) =>
      hall.id === hallId ? { ...hall, prices } : hall
    );
    localStorage.setItem("halls", JSON.stringify(updatedHalls));
  }, 300);

  const handleRegularPriceChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value, 10));
    if (!isNaN(value)) {
      debouncedUpdateHallPrices(selectedHallId, {
        ...getHallPrices(selectedHallId),
        regular: value,
      });
    }
  };

  const handleVipPriceChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value, 10));
    if (!isNaN(value)) {
      debouncedUpdateHallPrices(selectedHallId, {
        ...getHallPrices(selectedHallId),
        vip: value,
      });
    }
  };

  const handleResetPrices = () => {
    if (selectedHallId) {
      const savedPrices = hallPrices[selectedHallId] || { regular: 0, vip: 0 };
      debouncedUpdateHallPrices(selectedHallId, savedPrices);
      alert("Изменения отменены. Возвращены сохраненные цены.");
    }
  };

  const handleSavePrices = () => {
    if (selectedHallId) {
      alert("Цены успешно сохранены!");
    } else {
      alert("Выберите зал для конфигурации цен.");
    }
  };

  return (
    <div className="container p-0">
    <section className="section-hall-3">
      <div className="row m-0">
      <header className="cul cul-header-directorate-section">
        <div className="line-2"></div>
        <h2 className="heading-directorate-section">конфигурация цен</h2>
      </header>
      </div>
      <div className="row row-conf-step-wrapper-3">
        <div className="cul cul-configure">
          <div className="conf-step-paragraph">
            <p className="text-paragraph">Выберите зал для конфигурации:</p>
          </div>
          <ul className="list-2">
            {halls.length > 0 ? (
              halls.map((hall) => (
                <li
                  key={hall.id}
                  className={`item-2 ${selectedHallId === hall.id ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectHall(hall.id);
                  }}
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
        </div>
        {selectedHallId ? (
          <>
            <div className="cul cul-conf-step-paragraph-4">
              <p className="text-paragraph-4">Установите цены для типов кресел:</p>
            </div>
            <div className="cul cul-price-input-group">
              <label htmlFor="regular-price" className="price-label">
                <p className="text-price-2">Цена, рублей</p>
                <input
                  type="number"
                  id="regular-price"
                  name="regular-price"
                  className="price-input"
                  value={regular}
                  onChange={handleRegularPriceChange}
                  min="0"
                />
              </label>
              <p className="text-after-price"> за </p>
              <span className="conf-step-chair-4"></span>
              <p className="text-chairs">обычные кресла</p>
            </div>
            <div className="cul cul-price-input-group">
              <label htmlFor="vip-price" className="price-label">
                <p className="text-price-2">Цена, рублей</p>
                <input
                  type="number"
                  id="vip-price"
                  name="vip-price"
                  className="price-input-2"
                  value={vip}
                  onChange={handleVipPriceChange}
                  min="0"
                />
              </label>
              <p className="text-after-price"> за </p>
              <span className="conf-step-chair-5"></span>
              <p className="text-chairs">VIP кресла</p>
            </div>
            <div className="cul cul-fieldset">
              <button onClick={handleResetPrices} className="reset-button">
                <p className="text-reset">Отмена</p>
              </button>
              <button onClick={handleSavePrices} className="save-button">
                <p className="text-save">Сохранить</p>
              </button>
            </div>
          </>
        ) : (
         <div className="cul"> 
         <p className="no-hall-message">Выберите зал для настройки цен.</p>
         </div>
        )}
      </div>
    </section>
    </div>
  );
};

export default PriceConfiguration;