import React, {useEffect, useRef} from "react";
import { useLocation } from "react-router-dom";
import './css/Bookingcode.css'; 

const Bookingcode = () => {
  const location = useLocation();
  const { filmName, seanceTime, hallName, selectedSeats } = location.state || {};

  const qrCodeContainer = useRef(null);

  const generateQRText = () => {
    return `Фильм: ${filmName}\nМеста: ${selectedSeats.join(", ")}\nЗал: ${hallName}\nНачало сеанса: ${seanceTime}`;
  };

  useEffect(() => {
    if (!qrCodeContainer.current || !filmName || !selectedSeats) {
      return; 
    }

    const qrText = generateQRText();

    if (typeof QRCreator !== "function") {
        console.error("QRCreator не определен. Убедитесь, что файл QRCreator.js правильно подключен.");
        return;
      }

    const qrcode = window.QRCreator(qrText, {
      mode: -1,
      eccl: 0,
      version: -1,
      mask: -1,
      image: "SVG",
      modsize: 4,
      margin: 4,
    });

    if (qrcode.error) {
      console.error("Ошибка при создании QR-кода:", qrcode.error, qrcode.errorSubcode);
      return;
    }

    qrCodeContainer.current.innerHTML = ""; 
    qrCodeContainer.current.append(qrcode.result);
  }, [filmName, seanceTime, hallName, selectedSeats]);

  if (!filmName || !selectedSeats) {
    return <div>Данные о бронировании недоступны</div>;
  }

  return (
    <div className="container booking-code-container">
      <div className="row row-header-hall">
        <div className="cul">
        <p className="text-heading-client">
          <strong>ИДЁМ</strong>
          <span className="span">В</span>
          <strong>КИНО</strong>
        </p>
        </div>
      </div>
      <main className="row row-main-container m-0">
          <div className="cul cul-frame-2">
            <div className="before-img"></div>
            <header className="section-header">
              <div className="heading-2">
                <h2 className="text-heading">Электронный билет:</h2>
              </div>
            </header>
            <div className="after-img"></div>
          </div>
          <div className="cul cul-frame-1">
            <div className="before-img"></div>
            <div className="booking-code">
              <div className="code-info">
              </div>
              <div className="ticket-info">
                <p>На фильм: <strong>{filmName}</strong></p>
              </div>
              <div className="ticket-info">
                <p>Места: <strong>{selectedSeats.join(", ")}</strong></p>
              </div>
              <div className="ticket-info">
                <p>В зале: <strong>{hallName}</strong></p>
              </div>
              <div className="ticket-info">
                <p>Начало сеанса: <strong>{seanceTime}</strong></p>
              </div>
              <div className="qr-code-container" ref={qrCodeContainer}></div>
              <div className="ticket-hint">
                <p className="text-info-ticket">Покажите QR-код нашему контроллеру для подтверждения бронирования.</p>
              </div>
              <div className="ticket-hint">
                <p className="text-info-ticket">Приятного просмотра!</p>
              </div>
            </div>
            <div className="after-img"></div>
          </div>
      </main>
    </div>
  );
};

export default Bookingcode;