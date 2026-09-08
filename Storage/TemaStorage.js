import AsyncStorage from "@react-native-async-storage/async-storage";

const TEMA_STORAGE_KEY = 'tema_usuario';
const TEMA_DEFAULT = 'tema_12';

/**
 * Obtiene el tema guardado en storage
 * @returns {Promise<string>} Nombre del tema (ej: 'tema_17')
 */
export const obtenerTemaStorage = async () => {
    try {
        const temaGuardado = await AsyncStorage.getItem(TEMA_STORAGE_KEY);
        
        if (temaGuardado !== null) {
            return temaGuardado;
        }
        
        // Si no existe, guardar el default y devolverlo
        await AsyncStorage.setItem(TEMA_STORAGE_KEY, TEMA_DEFAULT);
        return TEMA_DEFAULT;
        
    } catch (error) {
        console.error('Error al obtener tema del storage:', error);
        return TEMA_DEFAULT;
    }
};

/**
 * Guarda el tema en storage
 * @param {string} temaNombre - Nombre del tema (ej: 'tema_15')
 */
export const guardarTemaStorage = async (temaNombre) => {
    try {
        await AsyncStorage.setItem(TEMA_STORAGE_KEY, temaNombre);
    } catch (error) {
        console.error('Error al guardar tema en storage:', error);
    }
};