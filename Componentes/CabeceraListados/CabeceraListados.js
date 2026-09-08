import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Surface } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';

export default function CabeceraListados({ 
  titulo,
  data_resumen,
  destinoNavegacion,
  parametroNavegacion = { Id: 0 },
  busquedaActiva,
  activar_busqueda,
  desactivar_busqueda

}) {
  const { colors, fonts } = useTheme();
  const { navigate } = useNavigation();

  const { 
    titulo_total = '', 
    totalGeneral = 0, 
    titulo_cantidad = '', 
    cantidadRegistros = 0 
  } = data_resumen || {};

  const estilos = {
    font_normal: fonts.balsamiqregular.fontFamily,
    font_negrita: fonts.balsamiqbold.fontFamily,
    font_color: colors.screen_componente_estilos.color_texto,
    font_importe_color: colors.screen_componente_estilos.color_texto_importante,
    pantalla_color_fondo: colors.screen_componente_estilos.color_fondo,
    boton_color_borde: colors.screen_componente_estilos.color_borde_botones,
    cards_color_fondo: colors.screen_componente_estilos.color_fondo_cards,
  };

  return (
    <View style={styles.container}>
      
      <View style={[styles.headerRow,{borderColor:estilos.boton_color_borde}]}>
        <Text style={[
          styles.titulo, 
          { fontFamily: estilos.font_negrita, color: estilos.font_color }
        ]}>
          {titulo}
        </Text>

        <View style={styles.botonesRow}>


          
          <TouchableOpacity 
            onPress={busquedaActiva ? desactivar_busqueda : activar_busqueda}
            activeOpacity={0.7}
            style={styles.iconoBoton}
          >
            {busquedaActiva ? (
              <MaterialIcons name="search-off" size={32} color={estilos.font_color} />
            ) : (
              <MaterialIcons name="manage-search" size={32} color={estilos.font_color} />
            )}
          </TouchableOpacity>

          
          <TouchableOpacity
            // style={[
            //   styles.botonAgregar,
            //   {
            //     backgroundColor: colors.navigation_estilos.color_fondo,
            //     borderColor: estilos.boton_color_borde,
            //   }
            // ]}
            onPress={() => navigate(destinoNavegacion, parametroNavegacion)}
            activeOpacity={0.8}
          >
            {/* <Text style={{ 
              fontFamily: estilos.font_negrita, 
              color: colors.navigation_estilos.color_texto, 
              fontSize: 30 
            }}>
              +
            </Text> */}
            <Entypo name="circle-with-plus" size={40} color={colors.navigation_estilos.color_fondo} />
          </TouchableOpacity>
          
        </View>
      </View>

      
      <Surface 
        style={[styles.card, { backgroundColor: estilos.pantalla_color_fondo }]} 
        elevation={3}
      >
        <View style={styles.resumenBarra}>
          <View style={styles.resumenItem}>
            <Text style={[styles.resumenLabel, { fontFamily: estilos.font_normal }]}>
              {titulo_total}
            </Text>
            <Text style={[
              styles.resumenMonto, 
              { fontFamily: estilos.font_negrita, color: estilos.font_importe_color }
            ]}>
              Gs. {Number(totalGeneral).toLocaleString('es-ES')}
            </Text>
          </View>

          <View style={styles.resumenSeparador} />

          <View style={styles.resumenItem}>
            <Text style={[styles.resumenLabel, { fontFamily: estilos.font_normal }]}>
              {titulo_cantidad}
            </Text>
            <Text style={[
              styles.resumenMonto, 
              { fontFamily: estilos.font_negrita, color: estilos.font_color }
            ]}>
              {Number(cantidadRegistros).toLocaleString('es-ES')}
            </Text>
          </View>
        </View>
      </Surface>
    </View>
  );


}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    marginTop:5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
     marginBottom: 12,
     paddingBottom:5,
    borderBottomWidth:StyleSheet.hairlineWidth
    
  },
  titulo: {
    fontSize: 20,
    flex: 1,
  },
  botonesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconoBoton: {
    padding: 4,
  },
  botonAgregar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1.5,
    //justifyContent: 'center',
    // alignItems: 'center',
  },
  card: {
    //marginBottom: 15,
    marginHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  resumenBarra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    backgroundColor: '#EEE9FD',
    borderRadius: 10,



    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-around',
    // marginHorizontal: 12,
    // marginTop: 10,
    // marginBottom: 8,
    // paddingVertical: 10,
    // backgroundColor: '#EEE9FD',
    // borderRadius: 10,
  },
  resumenItem: {
    alignItems: 'center',
    flex: 1,
  },
  resumenSeparador: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  resumenLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  resumenMonto: {
    fontSize: 16,
  },
});