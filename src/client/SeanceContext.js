import React, { createContext, useState } from 'react';
import './css/SeanceDetail.css'

export const SeanceContext = createContext();

export const SeanceProvider = ({ children }) => {
    const [selectedSeance, setSelectedSeance] = useState(null);

    return (
        <SeanceContext.Provider value={{ selectedSeance, setSelectedSeance }}>
            {children}
        </SeanceContext.Provider>
    );
};