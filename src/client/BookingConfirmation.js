import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import './css/BookingConfirmation.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { filmName, seanceTime, hallName, selectedSeats, rows } = location.state || {};

  if (!rows || !selectedSeats) {
    return <div>Данные о бронировании недоступны</div>;
  }

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    selectedSeats.forEach((seatId) => {
      const seat = rows.flat().find((seat) => seat.id === seatId);
      if (seat && seat.status === "vip") {
        totalPrice += 350; 
      } else if (seat && seat.status === "free") {
        totalPrice += 250; 
      }
    });
    return totalPrice;
  };

  const totalPrice = calculateTotalPrice();

  const handleGetBookingCode = () => {
    if (selectedSeats.length === 0) {
      alert("Нет выбранных мест!");
      return;
    }

    navigate("/client/BookingCode", {
      state: {
        filmName,
        seanceTime,
        hallName,
        selectedSeats,
        rows,
      },
    });
  };

  return (
    <>
    <div className="container">
    <div className="row row-header-hall">
      <div className="cul">
      <p className="text-heading-client">
          <strong>ИДЁМ</strong>
          <span className="span">В</span>
          <strong>КИНО</strong>
        </p>
      </div>
      </div>
      <main className="row row-main-container">
          <div className="cul cul-frame-2">
            <div className="before-img"></div>
            <header className="section-header">
              <div className="heading-2">
                <h2 className="text-heading">Вы выбрали билеты:</h2>
              </div> 
            </header>
            <div className="after-img"></div>
          </div>
          <div className="cul cul-frame-1">
            <div className="before-img"></div>
            <div className="booking-confirmation">
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
              <div className="ticket-info">
                <p>Стоимость: <strong>{totalPrice}</strong> руб.</p>
              </div>
              <button
                className="get-code-button"
                onClick={handleGetBookingCode}
              >
                <p className="text-get-code">Получить код бронирования</p>
              </button>
              <div className="ticket-hint">
                <p className="text-info-ticket">После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</p>
              </div>
              <div className="ticket-hint">
                <p className="text-info-ticket">Приятного просмотра!</p>
              </div>
            </div>
            <div className="after-img"></div>
          </div>
      </main>


    </div>
    
    </>
  );
};

export default BookingConfirmation;