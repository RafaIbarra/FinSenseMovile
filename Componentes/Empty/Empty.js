import React, {  } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

import LottieView from 'lottie-react-native';
function Empty({  }) {
    
    const { colors, fonts } = useTheme();
    return (
        <View style={[styles.overlay,{backgroundColor:colors.screen_componente_estilos.color_fondo}]}>
            <Text style={[styles.texto, { fontFamily: fonts.balsamiqregular.fontFamily,color:colors.navigation_estilos.color_fondo }]}>
                Sin Datos
            </Text>

            <View style={[styles.curvedContainer,{backgroundColor:colors.background}]}>
                <LottieView
                    source={require('../../assets/vacio.json')}
                    
                    style={styles.video}
                    autoPlay={true}
                    loop={true}
                    
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center', // Centra verticalmente
        alignItems: 'center', // Centra horizontalmente
        
        
    },
    curvedContainer: {
        width: 300, // Tamaño del contenedor
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100, // Hace el contenedor completamente redondo
        overflow: 'hidden', // Asegura que el contenido se ajuste al borde redondeado
        // backgroundColor: '#fff', // Color de fondo opcional para contraste
    },
    video: {
        width: '100%',
        height: '100%',
    },
    texto: {
        marginBottom: 20, // Espacio entre el texto y el LottieView
        fontSize:30,
        
    },
});

export default Empty;
