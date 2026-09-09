import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

export default function CabeceraRegistros({ title, navigation, onDelete, onEdit,showbottons }) {
    const { colors, fonts } = useTheme();
    
    const estilos = {
        pantalla_color_fondo: colors.screen_componente_estilos.color_fondo,
        font_normal: fonts.balsamiqregular.fontFamily,
        font_negrita: fonts.balsamiqbold.fontFamily,
        font_color: colors.screen_componente_estilos.color_texto,
        size_icon: 25
    };

    return (
        <View style={[styles.container,{backgroundColor: estilos.pantalla_color_fondo,}]}>   
            {/* Botón volver: ancho fijo mínimo */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnBack}>
                <MaterialCommunityIcons 
                    name="backburger" 
                    size={estilos.size_icon} 
                    color={estilos.font_color} 
                />
            </TouchableOpacity>
            
            {/* Título: 65% del ancho */}
            <Text 
                style={[
                    styles.title,
                    {
                        fontFamily: estilos.font_negrita,
                        color: estilos.font_color,
                    }
                ]}
                numberOfLines={1}
            >
                {title}
            </Text>
            
            {/* Contenedor derecho: el 35% restante, distribuido entre los iconos */}
            { showbottons && 
            <View style={styles.rightContainer}>
                <TouchableOpacity onPress={onDelete} style={styles.btnAction}>
                    <AntDesign name="delete" size={estilos.size_icon} color="rgb(205,92,92)" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onEdit} style={styles.btnAction}>
                    <AntDesign name="edit" size={estilos.size_icon} color={estilos.font_color} />
                </TouchableOpacity>
            </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 5,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 15, // margen derecho simétrico al left
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    btnBack: {
        width: 40,        // ancho fijo para el botón de volver
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop:5
    },
    title: {
        width: '90%',     // ← 65% del ancho total
        fontSize: 20,
        paddingLeft:5
    },
    rightContainer: {
        flex: 1,          // ← ocupa el 35% restante
        flexDirection: 'row',
        justifyContent: 'flex-end', // iconos pegados a la derecha
        alignItems: 'center',
        gap: 0,          // espacio entre iconos (React Native 0.71+) o usa margin
    },
    btnAction: {
        width: 40,        // cada botón tiene ancho fijo para distribución uniforme
        alignItems: 'center',
        justifyContent: 'center',
    },
});
