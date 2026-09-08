import React, { createContext, useContext, useState, useCallback } from 'react';
import { guardarTemaStorage } from './Storage/TemaStorage';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children, temaInicial }) => {
    const [themeName, setThemeName] = useState(temaInicial);

    /**
     * Cambia el tema y lo persiste en storage
     * @param {string} nuevoTema - Nombre del nuevo tema
     */
    const setTheme = useCallback(async (nuevoTema) => {
        setThemeName(nuevoTema);
        await guardarTemaStorage(nuevoTema);
        // Aquí irá el POST al backend cuando implementes esa parte
    }, []);

    const value = {
        themeName,
        setTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook para consumir el tema en cualquier componente
 */
export const temaUser = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe usarse dentro de un ThemeProvider');
    }
    return context;
};