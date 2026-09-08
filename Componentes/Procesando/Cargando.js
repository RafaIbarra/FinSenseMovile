import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../../AuthContext';
import LottieView from 'lottie-react-native';
function Cargando({ navigation }) {
    const { estadocomponente } = useContext(AuthContext);
    const { colors, fonts } = useTheme();
    return (
        <View style={[styles.overlay,{backgroundColor:colors.screen_componente_estilos.color_fondo_cards}]}>
            <Text style={[styles.texto, { fontFamily: fonts.balsamiqregular.fontFamily,color:colors.navigation_estilos.color_fondo }]}>
                {estadocomponente.tituloloading}
            </Text>

            <View style={
                [styles.curvedContainer
                // ,{backgroundColor:colors.background}
                ]
                }>
                <LottieView
                    source={require('../../assets/usdc-crypto-coin.json')}
                    
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        
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

export default Cargando;
