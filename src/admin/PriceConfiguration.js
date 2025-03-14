import React, { useState, useEffect } from "react";
import "./css/PriceConfiguration.css";
import { debounce } from "lodash";

const PriceConfiguration = () => {
  const [selectedHallId, setSelectedHallId] = useState(null);
  const [hallPrices, setHallPrices] = useState({});
  const [halls, setHalls] = useState([]); // Состояние для хранения данных о залах
  const [isSectionOpen, setIsSectionOpen] = useState(true);

  // Функция для загрузки данных с сервера
  const fetchHallsFromServer = async () => {
    try {
      const response = await fetch("https://shfe-diplom.neto-server.ru/alldata");
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const data = await response.json();
      console.log("Ответ от сервера:", data); // Логирование для отладки

      // Проверка наличия данных о залах
      const rawHalls = data?.result?.halls || [];
      if (!Array.isArray(rawHalls)) {
        throw new Error("Данные о залах отсутствуют или имеют неверный формат.");
      }

      // Преобразуем данные о залах в удобный формат
      const hallsData = rawHalls.map((hall) => ({
        id: hall.id,
        name: hall.hall_name,
        priceStandart: hall.hall_price_standart,
        priceVip: hall.hall_price_vip,
      }));

      setHalls(hallsData); // Сохраняем данные о залах в состоянии

      // Инициализируем цены для залов
      const initialPrices = {};
      hallsData.forEach((hall) => {
        initialPrices[hall.id] = {
          regular: hall.priceStandart || 0,
          vip: hall.priceVip || 0,
        };
      });
      setHallPrices(initialPrices);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchHallsFromServer();
  }, []);

  // Получение цен выбранного зала
  const getHallPrices = (hallId) => {
    return hallPrices[hallId] || { regular: 0, vip: 0 };
  };

  const { regular, vip } = getHallPrices(selectedHallId);

  // Функция для обновления цен зала
  const debouncedUpdateHallPrices = debounce((hallId, prices) => {
    setHallPrices((prevPrices) => ({
      ...prevPrices,
      [hallId]: prices,
    }));
  }, 300);

  // Обработчик изменения цены обычных мест
  const handleRegularPriceChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value, 10));
    if (!isNaN(value)) {
      debouncedUpdateHallPrices(selectedHallId, {
        ...getHallPrices(selectedHallId),
        regular: value,
      });
    }
  };

  // Обработчик изменения цены VIP мест
  const handleVipPriceChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value, 10));
    if (!isNaN(value)) {
      debouncedUpdateHallPrices(selectedHallId, {
        ...getHallPrices(selectedHallId),
        vip: value,
      });
    }
  };

  // Обработчик отмены изменений
  const handleResetPrices = () => {
    if (selectedHallId) {
      const savedPrices = halls.find((hall) => hall.id === selectedHallId);
      if (savedPrices) {
        debouncedUpdateHallPrices(selectedHallId, {
          regular: savedPrices.priceStandart || 0,
          vip: savedPrices.priceVip || 0,
        });
      }
      alert("Изменения отменены. Возвращены сохраненные цены.");
    }
  };

  // Обработчик сохранения цен
  const handleSavePrices = () => {
    if (selectedHallId) {
      alert("Цены успешно сохранены!");
    } else {
      alert("Выберите зал для конфигурации цен.");
    }
  };

  // Обработчик сворачивания/разворачивания секции
  const toggleSection = () => {
    setIsSectionOpen((prev) => !prev);
  };

  return (
    <div className="container p-0">
      <section className="section-hall-3">
        <div className="row m-0">
          <header className="cul cul-header-directorate-section">
            <div className="line-2"></div>
            <h2 className="heading-directorate-section">конфигурация цен</h2>
            <div
              className="closed-content"
              onClick={toggleSection}
              style={{ cursor: "pointer" }}
            ></div>
          </header>
        </div>
        {isSectionOpen && (
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
                      className={`item-2 ${
                        selectedHallId === hall.id ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedHallId(hall.id);
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
        )}
      </section>
    </div>
  );
};

export default PriceConfiguration;