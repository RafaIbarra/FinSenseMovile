
import React, { useState, useEffect,useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import { Surface } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { temaUser } from '../../../ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { colores_temas } from '../../../Utils/Temas';
import { guardarTemaStorage } from '../../../Storage/TemaStorage';

import { useApi } from '../../../Apis/useApi';
import { AuthContext } from '../../../AuthContext';


import Esperando from '../../Procesando/Espera';
import Notificacion from '../../Notificacion/Notificacion';

const { width } = Dimensions.get('window');

// Lista de temas disponibles (hardcodeada por ahora)
const LISTA_TEMAS = [
    { nombre: 'tema_1', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_2', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_3', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_4', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_5', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_6', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_7', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_8', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_9', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_10', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_11', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_12', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_13', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_14', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_15', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_16', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
    { nombre: 'tema_17', tipo: 'oscuro-verde', descripcion: 'Tema oscuro con acentos verdes, ideal para uso nocturno' },
];

export default function SeleccionTema({navigation}) {
    const { themeName, setTheme } = temaUser();
    const { colors, fonts } = useTheme();
    const { navigate } = useNavigation();
    const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { reiniciarvalores } = useContext(AuthContext);

    const [ready, setReady] = useState(false);
    const [tituloespera, setTituloespera] = useState('');
    const [listatemas,setListatemas]=useState([])
    const [estadonotificacion, setEstadonotificacion] = useState(false);
    const [bodynotificacion, setBodynotificacion] = useState({
        mensaje: '',
        titulo: '',
        is_error: false,
        estado_actualizar: '',
        valor_estado: '',
        navnivel1: '',
        navnivel2: '',
        navnivel3: '',
        omitirnavagacion:true
      });
    
    const apiRequest = useApi({ setActivarsesion, reiniciarvalores, actualizarEstadocomponente });
    
    // Estado para el tema seleccionado en la UI (no aplicado aún)
    const [seleccionado, setSeleccionado] = useState(themeName);
    // Estado para saber si hubo cambios
    const [hayCambios, setHayCambios] = useState(false);
    const estilos = {
    font_normal: fonts.balsamiqregular.fontFamily,
    font_negrita: fonts.balsamiqbold.fontFamily,
    font_color: colors.screen_componente_estilos.color_texto,
    font_importe_color: colors.screen_componente_estilos.color_texto_importante,
    pantalla_color_fondo: colors.screen_componente_estilos.color_fondo,
    boton_color_borde: colors.screen_componente_estilos.color_borde_botones,
    cards_color_fondo: colors.screen_componente_estilos.color_fondo_cards,
  };
    // Sincronizar cuando themeName cambia desde fuera
    useEffect(() => {
        setSeleccionado(themeName);
    }, [themeName]);

    const handleSeleccionar = (nombreTema) => {
        setSeleccionado(nombreTema);
        setHayCambios(nombreTema !== themeName);
    };

    const handleConfirmar = async () => {
        if (seleccionado !== themeName) {
            await setTheme(seleccionado);
            setHayCambios(false);
            // Aquí irá el POST al backend en el futuro
        }
    };

    const renderTema = ({ item }) => {
        const esSeleccionado = item.NombreTema === seleccionado;
        const esTemaActual = item.NombreTema === themeName;
        
        // Obtener colores del tema para la preview
        const temaObj = colores_temas[item.NombreTema] || colores_temas.tema_17;
        
        const colorFondo = temaObj.navigation_estilos?.color_fondo || '#ccc';
        const colorPrimario = temaObj.screen_componente_estilos?.color_fondo || '#666';
        const colorTexto = temaObj.screen_componente_estilos?.color_texto_importante || '#000';
        const colorTextoPrueba = temaObj.screen_componente_estilos?.color_texto || '#000';

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSeleccionar(item.NombreTema)}
                style={styles.cardContainer}
            >
                <Surface
                    style={[
                        styles.card,
                        esSeleccionado && styles.cardSeleccionado,
                    ]}
                    elevation={esSeleccionado ? 4 : 2}
                >
                    {/* Preview del tema */}
                    <View style={[styles.preview, { backgroundColor: colorFondo }]}>
                        
                        <View style={[styles.previewBarra, { backgroundColor: colorPrimario }]} >
                            <Text style={[styles.textprueba,{fontFamily:estilos.font_normal,color:colorTextoPrueba}]}> 
                                Texto de muestra 
                            </Text>
                        </View>
                        {/* <View style={[styles.previewCirculo, { backgroundColor: colorPrimario }]} /> */}
                    </View>

                    {/* Info del tema */}
                    <View style={styles.infoContainer}>
                        <Text style={[styles.nombreTema, { color: colorTexto }]}>
                            {item.NombreTema.replace('_', ' ').toUpperCase()}
                        </Text>
                        <Text style={styles.tipoTema}>{item.Tipo}</Text>
                        <Text style={styles.descripcionTema} numberOfLines={2}>
                            {item.Descripcion}
                        </Text>
                    </View>

                    {/* Indicador de selección */}
                    <View style={styles.indicadorContainer}>
                        {esSeleccionado && (
                            <View style={styles.checkContainer}>
                                <Text style={styles.checkText}>✓</Text>
                            </View>
                        )}
                        {esTemaActual && !esSeleccionado && (
                            <View style={styles.actualContainer}>
                                <Text style={styles.actualText}>ACTUAL</Text>
                            </View>
                        )}
                    </View>
                </Surface>
            </TouchableOpacity>
        );
    };
    const onOk = () => {
    setEstadonotificacion(false);
     };
    const carga_temas = async () => {
        setTituloespera('Carga de Temas');
        const endpoint = `user-config/temas`;
        const result = await apiRequest(endpoint, 'GET', {});

        try {
        if (result.sessionExpired) return;
        if (result.resp_correcta) {
            setListatemas(result.data);
        } else {
            const msj = result.data?.message || 'Error en la solicitud';
            setBodynotificacion(prev => ({
            ...prev,
            titulo: 'REGISTRO GASTO',
            mensaje: msj,
            is_error: true,
            valor_estado: '',
            }));
            setEstadonotificacion(true);
        }
        } catch (e) {
        setBodynotificacion(prev => ({
            ...prev,
            titulo: 'REGISTRO GASTO',
            mensaje: 'Error cargando categorías',
            is_error: true,
            valor_estado: '',
        }));
        setEstadonotificacion(true);
        }
    };
    useEffect(() => {
        const inicializar = async () => {
            setReady(false);
            
            await carga_temas();
            
            setReady(true);
        };

        inicializar();
    }, []);

    const guardar = async () => {
        if (!seleccionado.trim()) {
        setBodynotificacion(prev => ({
            ...prev,
            titulo: 'REGISTRO GASTO',
            mensaje: 'El nombre del gasto es requerido.',
            is_error: true,
            valor_estado: '',
        }));
        setEstadonotificacion(true);
        return;
        }
        if (seleccionado !== themeName) {

            setReady(false);
            const formData = new FormData();
            formData.append('tema', seleccionado);
            try{
                
                setTituloespera('Aplicando Tema');
                const endpoint='user-config/usuario-movile-theme'
                const result = await apiRequest(endpoint, 'POST', formData);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                if (result.sessionExpired) return;
                if (result.resp_correcta) {
                    await setTheme(seleccionado);
                    setHayCambios(false);
                    setReady(true);
                    const mensajeExito = 'Tema aplicado'
                    setBodynotificacion(prev => ({
                    ...prev,
                    titulo: 'Temas',
                    mensaje: mensajeExito,
                    is_error: false,
                    
                    }));
                    setEstadonotificacion(true);
                }else {
                const msj = result.data?.message || 'Error en la solicitud';
                setReady(true);
                setBodynotificacion(prev => ({
                ...prev,
                titulo: 'Cambio de tema',
                mensaje: msj,
                is_error: true,
                valor_estado: '',
                }));
                setEstadonotificacion(true);   
                
            }
        }catch (e) {
            setReady(true);
            setBodynotificacion(prev => ({
                ...prev,
                titulo: 'REGISTRO GASTO',
                mensaje: 'Ocurrió un error al guardar.',
                is_error: true,
                valor_estado: '',
            }));
            setEstadonotificacion(true);
        } finally {
            
            setReady(true);
         }
    }
    }

    

    return (
        <View style={[styles.container,{backgroundColor:colors.screen_componente_estilos.color_fondo}]}>

            {estadonotificacion && (
                    <Notificacion
                      navigation={navigation}
                      bodynotificacion={bodynotificacion}
                      onOk={onOk}
                    />
                  )}
            <Text style={[styles.titulo,{color:estilos.font_importe_color,fontFamily: estilos.font_negrita}]}>Seleccionar Tema</Text>
            <Text style={[styles.subtitulo,{color:estilos.font_color,fontFamily: estilos.font_normal}]}>
                Tema actual: {themeName.replace('_', ' ').toUpperCase()}
            </Text>

            <FlatList
                data={listatemas}
                renderItem={renderTema}
                keyExtractor={(item) => item.NombreTema}
                numColumns={2}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.lista}
            />

            {/* Botón de confirmación */}
            <View style={[styles.footer,{backgroundColor:estilos.pantalla_color_fondo}]}>
                <TouchableOpacity
                    style={[
                        styles.botonConfirmar,
                        !hayCambios && styles.botonDeshabilitado,
                        
                    ]}
                    onPress={guardar}
                    disabled={!hayCambios}
                    activeOpacity={0.8}
                >
                    <Text style={styles.textoBoton}>
                        {hayCambios ? 'Aplicar Tema' : 'Tema Aplicado'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
        
    },
    titulo: {
        fontSize: 24,
        
        marginBottom: 4,
        
    },
    subtitulo: {
        fontSize: 14,
        
        marginBottom: 20,
    },
    lista: {
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    cardContainer: {
        width: (width - 48) / 2, // 2 columnas con padding
    },
    card: {
        borderRadius: 16,
        padding: 12,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    cardSeleccionado: {
        borderColor: '#fb7185',
        backgroundColor: '#fff5f5',
    },
    preview: {
        height: 60,
        borderRadius: 12,
        marginBottom: 10,
        // flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        alignContent:'center',
        padding: 10,
        //overflow: 'hidden',
    },
    previewBarra: {
        width: '90%',
        height: '80%',
        borderRadius: 5,
        //marginRight: 8,
        justifyContent:'center',
        alignItems:'center'
    },
    textprueba: {
        fontSize:8,
        
    },
    previewCirculo: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    infoContainer: {
        marginBottom: 8,
    },
    nombreTema: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    tipoTema: {
        fontSize: 11,
        color: '#888',
        marginBottom: 4,
    },
    descripcionTema: {
        fontSize: 10,
        color: '#aaa',
        lineHeight: 14,
    },
    indicadorContainer: {
        alignItems: 'flex-end',
    },
    checkContainer: {
        backgroundColor: '#fb7185',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actualContainer: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    actualText: {
        color: '#666',
        fontSize: 9,
        fontWeight: 'bold',
    },
    footer: {
        paddingVertical: 16,
        borderTopWidth: 1,
        // borderTopColor: '#e0e0e0',
        // backgroundColor: '#f5f5f5',
    },
    botonConfirmar: {
        backgroundColor: '#fb7185',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonDeshabilitado: {
        backgroundColor: '#ccc',
    },
    textoBoton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});