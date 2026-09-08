import React, { useContext, useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export default function Alerta({ navigation }) {
    const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);
    const { colors, fonts } = useTheme();
    

    const [coloricono, setColoricono] = useState('#2196f3');
    const [titulo, setTitulo] = useState('MENSAJE');
    const [mensaje, setMensaje] = useState('');
    const [isError, setIsError] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    const estilos = {
        font_normal: fonts.balsamiqregular.fontFamily,
        font_negrita: fonts.balsamiqbold.fontFamily,
        font_color: colors.screen_componente_estilos.color_texto,
        font_importe_color: colors.screen_componente_estilos.color_texto_importante,
        font_sub_color: colors.screen_componente_estilos.color_texto_subtitulo,
        pantalla_color_fondo: colors.screen_componente_estilos.color_fondo,
        cards_color_fondo: colors.screen_componente_estilos.color_fondo_cards,
        cards_color_border: colors.screen_componente_estilos.color_borde_cards,
        boton_color_fondo: colors.screen_componente_estilos.color_fondo_botones,
        boton_color_borde: colors.screen_componente_estilos.color_borde_botones,


    };

    const cargardatos = () => {
        setMensaje(estadocomponente.alerta_componente.mensaje);
        setTitulo(estadocomponente.alerta_componente.titulo);
        if (estadocomponente.alerta_componente.is_error) {
            setColoricono('red');
            setIsError(true);
        } else {
            setColoricono('#2196f3');
            setIsError(false);
        }
    };

    useEffect(() => {
        cargardatos();
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 80,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const hideDialog = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.85,
                duration: 180,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (!isError) {
                actualizarEstadocomponente(
                    estadocomponente.alerta_componente.estado_actualizar,
                    estadocomponente.alerta_componente.valor_estado
                );
                // navigate(estadocomponente.alerta_componente.nav_destino);
                // navigation.navigate(estadocomponente.alerta_componente.nav_grupo, {screen: estadocomponente.alerta_componente.nav_destino});
                navigation.navigate(estadocomponente.alerta_componente.nav_destino);
            }
            actualizarEstadocomponente('alerta_estado', false);
        });
    };

    return (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            <Animated.View
                style={[
                    styles.card,
                    {
                        backgroundColor: estilos.cards_color_fondo,
                        borderColor: isError ? '#ff4444' : estilos.cards_color_border,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <View
                    style={[
                        styles.colorBar,
                        { backgroundColor: isError ? '#ff4444' : estilos.cards_color_border },
                    ]}
                />

                <View style={[styles.iconContainer, { backgroundColor: isError ? '#fff0f0' : '#f0f7ff' }]}>
                    {isError ? (
                        <MaterialIcons name="report-gmailerrorred" size={40} color={coloricono} />
                    ) : (
                        <MaterialCommunityIcons name="information-variant" size={40} color={coloricono} />
                    )}
                </View>

                <Text
                    style={[
                        styles.titulo,
                        {
                            fontFamily: estilos.font_negrita,
                            color: estilos.font_color,
                        },
                    ]}
                >
                   NEW {titulo}
                </Text>

                <View style={[styles.separador, { backgroundColor: estilos.cards_color_border }]} />

                <Text
                    style={[
                        styles.mensaje,
                        {
                            fontFamily: estilos.font_normal,
                            color: estilos.font_sub_color,
                        },
                    ]}
                >
                    {mensaje}
                </Text>

                <TouchableOpacity
                    onPress={hideDialog}
                    style={[
                        styles.boton,
                        {
                            backgroundColor: isError ? '#ff4444' : estilos.pantalla_color_fondo,
                            borderColor: isError ? '#cc0000' : estilos.boton_color_borde,
                        },
                    ]}
                    // activeOpacity={0.8}
                >
                    <Text
                        style={[
                            styles.botonTexto,
                            { fontFamily: estilos.font_negrita 
                               ,color: isError ? '#fff' : estilos.font_importe_color  
                            },
                        ]}
                    >
                        OK
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    card: {
        width: width * 0.82,
        borderRadius: 16,
        borderWidth: 1.5,
        alignItems: 'center',
        overflow: 'hidden',
        paddingBottom: 24,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    colorBar: {
        width: '100%',
        height: 6,
        marginBottom: 20,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    titulo: {
        fontSize: 18,
        letterSpacing: 1.2,
        marginBottom: 12,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    separador: {
        width: '80%',
        height: 1,
        marginBottom: 12,
        opacity: 0.4,
    },
    mensaje: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    boton: {
        paddingVertical: 11,
        paddingHorizontal: 48,
        borderRadius: 10,
        borderWidth: 1.5,
    },
    botonTexto: {
        
        fontSize: 15,
        letterSpacing: 1.5,
    },
});