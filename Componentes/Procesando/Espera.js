import React from 'react';
import { View, StyleSheet, Text, Modal } from 'react-native';
import { useTheme } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

function Esperando({ titulo }) {
    const { colors, fonts } = useTheme();

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={true}
            statusBarTranslucent={true} // Para que cubra también la barra de estado en Android
        >
            <View style={[
                styles.overlay,
                { backgroundColor: colors.screen_componente_estilos.color_fondo_cards }
            ]}>
                <Text style={[
                    styles.texto,
                    {
                        fontFamily: fonts.balsamiqregular.fontFamily,
                        color: colors.navigation_estilos.color_fondo
                    }
                ]}>
                    {titulo}
                </Text>

                <View style={styles.curvedContainer}>
                    <LottieView
                        source={require('../../assets/usdc-crypto-coin.json')}
                        style={styles.video}
                        autoPlay={true}
                        loop={true}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    curvedContainer: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        overflow: 'hidden',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    texto: {
        marginBottom: 20,
        fontSize: 30,
    },
});

export default Esperando;