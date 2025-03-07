import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SeanceContext } from "./SeanceContext";
import logo from "./img/Scheme.png";
import "./css/SeanceDetail.css";

const SeanceDetail = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [hallScheme, setHallScheme] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const { selectedSeance } = useContext(SeanceContext);
  const navigate = useNavigate();

  const [isContainerZoomed, setIsContainerZoomed] = useState(false);

  useEffect(() => {
    if (!selectedSeance || !selectedSeance.hallId) {
      setLoading(false);
      setError("Сеанс не выбран или hallId недоступен");
      return;
    }
  
    const fetchHallScheme = async () => {
      try {
        const response = await fetch("https://shfe-diplom.neto-server.ru/alldata");
        if (!response.ok) {
          throw new Error(`Не удалось загрузить данные. Статус: ${response.status}`);
        }
        const data = await response.json();
  
        if (!data.success || !data.result || !data.result.halls) {
          throw new Error("Некорректные данные о залах.");
        }
  
        const hall = data.result.halls.find((hall) => hall.id === selectedSeance.hallId);
  
        if (!hall || !hall.hall_config) {
          throw new Error("Зал не найден или отсутствует конфигурация.");
        }
  
        setHallScheme(hall.hall_config);
      } catch (error) {
        console.error("Ошибка при загрузке данных о зале:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    console.log("Запрос к alldata для получения схемы зала...");
    fetchHallScheme();
  }, [selectedSeance]);

  const handleSelectSeat = (rowIndex, seatIndex) => {
    const uniqueId = `${rowIndex}-${seatIndex}`;

    if (selectedSeats.includes(uniqueId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== uniqueId));
    } else {
      setSelectedSeats([...selectedSeats, uniqueId]);
    }
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Выберите хотя бы одно место!");
      return;
    }
    const flatRows = hallScheme.flatMap((row, rowIndex) =>
      row.map((seat, seatIndex) => ({
        id: `${rowIndex}-${seatIndex}`, 
        status: seat === "standart" ? "free" : seat === "vip" ? "vip" : "occupied",
      }))
    );

    navigate("/client/BookingConfirmation", {
      state: {
        filmName: selectedSeance.filmName,
        seanceTime: selectedSeance.seanceTime,
        hallName: selectedSeance.hallName,
        selectedSeats: selectedSeats,
        rows: flatRows,
      },
    });
  };

  const handleInfoDoubleClick = () => {
    setIsContainerZoomed(!isContainerZoomed); 
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleScreenResize = (e) => {
      if (e.matches) {
        setIsContainerZoomed(false);
      } else {
        setIsContainerZoomed(false);
      }
    };

    mediaQuery.addEventListener("change", handleScreenResize);

    if (mediaQuery.matches) {
      setIsContainerZoomed(false);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleScreenResize);
    };
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!selectedSeance || !selectedSeance.hallId) {
    return <div>Сеанс не выбран или данные о зале отсутствуют</div>;
  }

  return (
    <>
      <div className="container">
        <div className="row row-header-hall">
          <div className="cul p-0">
            <p className="text-heading-client">
              <strong>ИДЁМ</strong>
              <span className="span">В</span>
              <strong>КИНО</strong>
            </p>
          </div>
        </div>
        <section className="row row-section">
          <div
            className={`cul cul-buying_info ${isContainerZoomed ? "zoomed" : ""}`}
            onDoubleClick={handleInfoDoubleClick}
            style={{
              cursor: window.matchMedia("(max-width: 768px)").matches ? "zoom-in" : "default",
              position: "relative", 
            }}
          >
            <div className="buying__info-description">
              <p className="Heading_2">{selectedSeance.filmName}</p>
              <p className="Text-time">Начало сеанса: {selectedSeance.seanceTime}</p>
              <p className="Text-name">Зал: {selectedSeance.hallName}</p>
            </div>

            {isContainerZoomed && (
              <div className="additional-content">
                <img
                  src="https://via.placeholder.com/150" 
                  alt="Дополнительное изображение"
                  className="additional-image"
                />
                <p className="additional-text">
                  Это дополнительный текст, который появляется при увеличении!
                </p>
              </div>
            )}
          </div>
          <div className="cul-buying-scheme">
            <div className="buying-scheme__wrapper">
              <img src={logo} alt="Схема" className="logo" />
              {hallScheme.length > 0 ? (
                hallScheme.map((row, rowIndex) => (
                  <div key={rowIndex} className="buying-scheme__row">
                    {row.map((seat, seatIndex) => {
                      const uniqueId = `${rowIndex}-${seatIndex}`;
                      if (seat === "disabled") {
                        return (
                          <span
                            key={uniqueId}
                            className="buying-scheme-chair empty"
                            style={{ cursor: "default" }}
                          ></span>
                        );
                      }
                      return (
                        <span
                          key={uniqueId}
                          className={`buying-scheme-chair 
                            ${seat === "standart" && "free"} 
                            ${seat === "vip" && "vip"} 
                            ${seat === "occupied" && "occupied"} 
                            ${selectedSeats.includes(uniqueId) && "selected"}
                          `}
                          onClick={() =>
                            seat !== "occupied" &&
                            seat !== "disabled" &&
                            handleSelectSeat(rowIndex, seatIndex)
                          }
                          style={{
                            cursor:
                              seat === "occupied" || seat === "disabled"
                                ? "not-allowed"
                                : "pointer",
                          }}
                        ></span>
                      );
                    })}
                  </div>
                ))
              ) : (
                <p>Загрузка схемы зала...</p>
              )}
            </div>
            <div className="buying-scheme__legend">
              <div className="col-container">
                <div className="col">
                  <div className="buying-scheme__legend-price">
                    <span className="buying-scheme-chair-free"></span>
                    <p className="text-price">Свободно (250руб)</p>
                  </div>
                  <div className="buying-scheme__legend-price">
                    <span className="buying-scheme-chair-vip"></span>
                    <p className="text-price-vip">Свободно VIP (350руб)</p>
                  </div>
                </div>
              </div>
              <div className="col-container-2">
                <div className="col-2">
                  <div className="buying-scheme__legend-price">
                    <span className="buying-scheme-chair-occupied"></span>
                    <p className="text-occupied">Занято</p>
                  </div>
                  <div className="buying-scheme__legend-price">
                    <span className="buying-scheme-chair-selected"></span>
                    <p className="text-selected">Выбрано</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="cul cul-booking-button"
            onClick={handleBooking}
            disabled={selectedSeats.length === 0}
          >
            <p className="button-text">Забронировать</p>
          </button>
        </section>
      </div>
    </>
  );
};

export default SeanceDetail;