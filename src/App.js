import React, { useEffect } from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './client/Header';
import Calendar from './client/Calendar';
import CinemaData from './client/CinemaData';
import SeanceDetail from './client/SeanceDetail';
import { SeanceProvider } from './client/SeanceContext';
import BookingConfirmation from "./client/BookingConfirmation";
import Bookingcode from './client/Bookingcode';
import Login from './admin/login';
import HallManagement from './admin/hallManagement';
import ConfigurationHall from './admin/ConfigurationHall';
import PrirceConfiguration from './admin/PriceConfiguration';
import SesionGrid from './admin/SesionGrid';
import AddFilm from './admin/AddFilm';
import OpenSale from './admin/OpenSale';
import CreateHall from './admin/createHall';
import backgroundImageClient from './client/img/background.png';
import backgroundImageAdmin from './admin/img/admin.jpg'

const BodyBackground = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
      if (location.pathname.startsWith ('/client')) {
          document.body.style.backgroundImage = `url(${backgroundImageClient})`;
      } else if (location.pathname.startsWith ('/admin')) {
          document.body.style.backgroundImage = `url(${backgroundImageAdmin})`;
          document.body.style.backgroundSize = 'cover'; 
          document.body.style.backgroundRepeat = 'no-repeat';
          document.body.style.backgroundPosition = 'center';
          document.body.style.backgroundColor ="rgba(0, 0, 0, 0.5)";
      }

      return () => {
          document.body.style.backgroundImage = '';
      };
  }, [location]);

  return <>{children}</>;
};

function HomePage() {
  return (
    <div> 
      <Header />
      <Calendar />
      <CinemaData />
    </div>
  );
}

function AdminPart(){
  return (
    <main className='main-admin'>
      <HallManagement />
      <ConfigurationHall />
      <PrirceConfiguration />
      <SesionGrid />
      <OpenSale />
    </main>
  )
}

function App() { 
  return (
    <SeanceProvider>
      <BodyBackground>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/client/SeanceDetail" element={<SeanceDetail />} />
      <Route path="/client/BookingConfirmation" element={ <BookingConfirmation />} />
      <Route path="/client/BookingCode" element={<Bookingcode />} /> 
      <Route path='/admin/login' element={<Login />} />
      <Route path='/admin/AddFilm' element={<AddFilm/>} />
      <Route path='/admin' element={< AdminPart/>} />
      <Route path='/admin/CreateHall' element={<CreateHall/>} />
      </Routes>
      </BodyBackground>
    </SeanceProvider>
  );
}

export default App;