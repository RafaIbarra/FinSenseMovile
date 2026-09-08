import React, {  useRef,useState,useEffect } from 'react';
import {View,StyleSheet,Text,TouchableOpacity,Animated,Dimensions} from 'react-native';
import { useTheme } from '@react-navigation/native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export default function Confirmacion({ title,question, navigation, onYes, onNo }) {
    
    const { colors, fonts } = useTheme();
    
    const [coloricono, setColoricono] = useState('#2196f3');
  

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

    useEffect(() => {
            
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
    

    return (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            <Animated.View
                style={[
                    styles.card,
                    {
                        backgroundColor: estilos.cards_color_fondo,
                        borderColor: estilos.cards_color_border,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <View
                    style={[
                        styles.colorBar,
                        { backgroundColor: estilos.cards_color_border },
                    ]}
                />

                <View style={[styles.iconContainer, { backgroundColor:  '#f0f7ff' }]}>
                    
                        <AntDesign name="question" size={40} color={coloricono} />
                    
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
                    {title}
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
                    {question}
                </Text>
                <View style={{flexDirection:'row', gap:80}}>

                    <TouchableOpacity 
                        onPress={onNo}
                        style={[styles.boton,{backgroundColor:  estilos.pantalla_color_fondo,borderColor:  estilos.boton_color_borde,},]}
                    >
                        <Text style={[ styles.botonTexto,{ fontFamily: estilos.font_negrita ,color:  estilos.font_importe_color  },]}>
                            NO
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={onYes} 
                        style={[styles.boton,{backgroundColor:  estilos.pantalla_color_fondo,borderColor:  estilos.boton_color_borde,},]}
                        
                    >
                        <Text style={[styles.botonTexto,{ fontFamily: estilos.font_negrita ,color: estilos.font_importe_color  },]}>
                            SI
                        </Text>
                    </TouchableOpacity>
                </View>
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
        
        borderRadius: 10,
        borderWidth: 1.5,
        width:70,
        height:45,
        justifyContent: 'center',  // Alinea verticalmente (centra el contenido en el eje Y)
        alignItems: 'center',      // Alinea horizontalmente (centra el contenido en el eje X)
    },
    botonTexto: {
        
        fontSize: 15,
        letterSpacing: 1.5,
    },
});