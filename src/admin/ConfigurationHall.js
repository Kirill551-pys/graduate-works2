import React, { useState, useEffect } from "react";
import "./css/ConfigurationHall.css";
import { debounce } from "lodash";

const ConfigurationHall = () => {
  const [selectedHallId, setSelectedHallId] = useState(null);
  const [hallsConfig, setHallsConfig] = useState({});

  const halls = JSON.parse(localStorage.getItem("halls")) || [];

  const debouncedUpdateHallConfig = debounce((hallId, config) => {
    setHallsConfig((prevConfig) => ({
      ...prevConfig,
      [hallId]: config,
    }));

    const updatedHalls = halls.map((hall) =>
      hall.id === hallId ? { ...hall, config } : hall
    );
    localStorage.setItem("halls", JSON.stringify(updatedHalls));
  }, 300);

  const debouncedToggleSeatStatus = debounce((rowIndex, seatIndex) => {
    if (selectedHallId) {
      const updatedLayout = [...(layout || [])];
      const currentStatus = updatedLayout[rowIndex][seatIndex];
      let newStatus;

      if (currentStatus === "free") {
        newStatus = "vip";
      } else if (currentStatus === "vip") {
        newStatus = "occupied";
      } else {
        newStatus = "free";
      }

      updatedLayout[rowIndex][seatIndex] = newStatus;
      debouncedUpdateHallConfig(selectedHallId, {
        rows: rows,
        seatsPerRow: seatsPerRow,
        layout: updatedLayout,
      });
    }
  }, 300);

  useEffect(() => {
    const currentHalls = JSON.parse(localStorage.getItem("halls")) || [];
    if (JSON.stringify(currentHalls) !== JSON.stringify(halls)) {
      const savedHallsConfig = currentHalls.reduce((acc, hall) => {
        if (hall.config) {
          acc[hall.id] = hall.config;
        }
        return acc;
      }, {});
      setHallsConfig(savedHallsConfig);
    }
  }, [halls]);

  const handleSelectHall = (hallId) => {
    setSelectedHallId(hallId);
  };

  const getHallConfig = (hallId) => {
    return hallsConfig[hallId] || {
      rows: "",
      seatsPerRow: "",
      layout: [],
    };
  };

  const { rows, seatsPerRow, layout } = getHallConfig(selectedHallId);

  const handleReset = () => {
    if (selectedHallId) {
      const savedLayout = hallsConfig[selectedHallId]?.layout || [];
      debouncedUpdateHallConfig(selectedHallId, {
        rows: savedLayout.length.toString(),
        seatsPerRow: savedLayout[0]?.length?.toString() || "",
        layout: savedLayout,
      });
    }
  };

  const handleSave = () => {
    if (selectedHallId) {
      debouncedUpdateHallConfig(selectedHallId, {
        rows: layout.length.toString(),
        seatsPerRow: layout[0]?.length?.toString() || "",
        layout: layout,
      });
      alert("Состояние зала успешно сохранено!");
    } else {
      alert("Выберите зал для конфигурации.");
    }
  };

  const handleRowsChange = (e) => {
    const newRows = e.target.value;

    if (newRows === "") {
      debouncedUpdateHallConfig(selectedHallId, {
        rows: "",
        seatsPerRow: "",
        layout: [],
      });
    } else {
      const parsedRows = parseInt(newRows, 10);
      if (!isNaN(parsedRows) && parsedRows >= 0) {
        const parsedSeats = seatsPerRow ? parseInt(seatsPerRow, 10) : 0;
        if (!isNaN(parsedSeats)) {
          debouncedUpdateHallConfig(selectedHallId, {
            rows: parsedRows.toString(),
            seatsPerRow: parsedSeats.toString(),
            layout:
              parsedRows > 0 && parsedSeats > 0
                ? Array.from({ length: parsedRows }, () =>
                    Array(parsedSeats).fill("free")
                  )
                : [],
          });
        }
      }
    }
  };

  const handleSeatsPerRowChange = (e) => {
    const newSeats = e.target.value;

    if (newSeats === "") {
      debouncedUpdateHallConfig(selectedHallId, {
        rows: "",
        seatsPerRow: "",
        layout: [],
      });
    } else {
      const parsedSeats = parseInt(newSeats, 10);
      if (!isNaN(parsedSeats) && parsedSeats >= 0) {
        const parsedRows = rows ? parseInt(rows, 10) : 0;
        if (!isNaN(parsedRows)) {
          debouncedUpdateHallConfig(selectedHallId, {
            rows: parsedRows.toString(),
            seatsPerRow: parsedSeats.toString(),
            layout:
              parsedRows > 0 && parsedSeats > 0
                ? Array.from({ length: parsedRows }, () =>
                    Array(parsedSeats).fill("free")
                  )
                : [],
          });
        }
      }
    }
  };

  const handleSeatClick = (rowIndex, seatIndex) => {
    debouncedToggleSeatStatus(rowIndex, seatIndex);
  };

  return (
    <div className="container p-0">
  <section className="section-hall-2">
    <div className="row row-section-hall-2 m-0">
    <header className="cul cul-header-directorate-section">
        <div className="line-2"></div>
        <div className="cul">
        <h2 className="heading-directorate-section">конфигурация залов</h2>
        </div>
        </header>
    </div>
      <div className="row row-conf-step-wrapper-2 m-0">
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
        <div className="cul cul-places">
          <div className="conf-step-paragraph-2">
            <p className="text-paragraph-2">
              Укажите количество рядов и максимальное количество кресел в ряду:
            </p>
          </div>
          <div className="conf-step-legend">
            <div className="input-group">
              <label htmlFor="rows" className="label-rows">
                <p className="text-input">Рядов,шт:</p>
              </label>
              <input
                type="number"
                id="rows"
                name="rows"
                className="input-rows"
                value={rows}
                onChange={handleRowsChange}
              />
            </div>
            <p className="text-group">Х</p>
            <div className="input-group">
              <label htmlFor="seats" className="label-seats">
                <p className="text-input">Мест,шт</p>
              </label>
              <input
                type="number"
                id="seats"
                name="seats"
                className="input-seats"
                value={seatsPerRow}
                onChange={handleSeatsPerRowChange}
              />
            </div>
          </div>
        </div>
        <div className="cul cul-frame-10">
          <div className="conf-step-paragraph-3">
            <p className="text-paragraph-3">
              Теперь вы можете указать типы кресел на схеме зала:
            </p>
          </div>
          <div className="frame-9">
            <div className="frame-6">
              <div className="conf-step-chair"></div>
              <p className="text-chair">-обычные кресла</p>
            </div>
            <div className="frame-7">
              <div className="conf-step-chair-2"></div>
              <p className="text-chair-2">-VIP кресла</p>
            </div>
            <div className="frame-8">
              <div className="conf-step-chair-3"></div>
              <p className="text-chair-3">- заблокированные (нет кресла)</p>
            </div>
          </div>
          <div className="conf-step-hint">
            <p className="text-hint d-none d-xs-block">
              Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши
            </p>
            <p className="text-hint d-block d-xs-none">
              Чтобы изменить вид кресла, нажмите по нему
            </p>
          </div>
          {layout.length > 0 ? (
            <div className="conf-step-hall">
              <div className="hall-scheme">
                {layout.map((row, rowIndex) => (
                  <div key={rowIndex} className="hall-row">
                    {row.map((seat, seatIndex) => (
                      <div
                        key={seatIndex}
                        onClick={() => handleSeatClick(rowIndex, seatIndex)}
                        className={`hall-seat ${
                          seat === "free"
                            ? "seat-free"
                            : seat === "vip"
                            ? "seat-vip"
                            : "seat-occupied"
                        }`}
                        title={
                          seat === "free"
                            ? "Свободное место"
                            : seat === "vip"
                            ? "VIP место"
                            : "Занятое место"
                        }
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="no-hall-message">
              Схема зала не настроена (ряды: {rows}, места: {seatsPerRow})
            </p>
          )}
        </div>
        <div className="cul cul-fieldset">
          <button onClick={handleReset} className="reset-button">
            <p className="text-reset">Отмена</p>
          </button>
          <button onClick={handleSave} className="save-button">
            <p className="text-save">Сохранить</p>
          </button>
        </div>
      </div>
    </section>


    </div>
  
  );
};

export default ConfigurationHall;