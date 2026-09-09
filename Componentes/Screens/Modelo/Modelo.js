import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Alert, ImageBackground,TouchableOpacity } from 'react-native';
import { TextInput, Button, Surface, Portal, Dialog, PaperProvider } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../../../AuthContext';

import Handelstorage from '../../../Storage/HandelStorage';
import { useApi } from '../../../Apis/useApi';

import Alerta from '../../Procesando/Alerta';

export default function Modelo({ navigation }){
    const { colors, fonts } = useTheme();
    const { navigate } = useNavigation();
    const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);
    const { asignar_opciones_alerta } = useContext(AuthContext);
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { reiniciarvalores } = useContext(AuthContext);
    
    const apiRequest = useApi({ setActivarsesion, reiniciarvalores, actualizarEstadocomponente });


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
    const peticion_get =async()=>{
        actualizarEstadocomponente('tituloloading', 'CARGANDO GASTOS');
        actualizarEstadocomponente('loading', true);
        const endpoint = `operaciones/ListadoMovimientoGastosMesUser/`;
    
        const result = await apiRequest(endpoint, 'GET', {});
        actualizarEstadocomponente('tituloloading', '');
        actualizarEstadocomponente('loading',  false);
        if (result.sessionExpired) {
            return; // SI LA SESION NO ES VALIDA
        }
        if (result.resp_correcta) {
            // console.log('respuesta correcta del backend')
            // console.log(result.data) // la data del backend
        }else {
            const msj = result.data?.message || 'Error en la solicitud'; // toma el error
            asignar_opciones_alerta(true, 'ERROR', msj, 'Gastos', 'bandera_registro_gasto', false); // muestra el mensaje en la alerta personalizada
            actualizarEstadocomponente('alerta_estado', true);
      }
   
    }



    const peticion_body =async()=>{
        const body = {
      
        };
        actualizarEstadocomponente('tituloloading', 'Registrando');
        actualizarEstadocomponente('loading', true);

        const endpoint = `operaciones/RegistroMovimientoGastoUser/`;
        const result = await apiRequest(endpoint, 'POST', body);

        await new Promise((resolve) => setTimeout(resolve, 1500));  // para añadir tiempo de espera opcional
        actualizarEstadocomponente('tituloloading', '');
        actualizarEstadocomponente('loading', false);

        if (result.sessionExpired) {
            return; // SI LA SESION NO ES VALIDA
        }
        if (result.resp_correcta) {
            // console.log('respuesta correcta del backend')
            // console.log(result.data) // la data del backend
            const nuevo_valor_bandera=!estadocomponente.bandera_registro_gasto // ES PARA CONTROLAR EL ESTADO DEL COMPONENTE PARA SU ACTUALIZACION
            asignar_opciones_alerta(false,'REGISTRO GASTOS','Registro correcto del movimiento','Gastos','bandera_registro_gasto',nuevo_valor_bandera)
            actualizarEstadocomponente('alerta_estado', true);
        }else {
        const msj = result.data?.message || 'Error en la solicitud'; // toma el error
        asignar_opciones_alerta(true, 'ERROR', msj, 'Gastos', 'bandera_registro_gasto', false); // muestra el mensaje en la alerta personalizada
        actualizarEstadocomponente('alerta_estado', true);
      }

    }

    const accion_boton=()=>{
        // console.log('boton')
    }

    const cargardatos =async()=>{
        
    }

    useEffect(() => {
        cargardatos();
      }, []);

    return(
        <View style={{ flex: 1, backgroundColor: estilos.pantalla_color_fondo}}>
            {/* Para ver la alerta */}
            {estadocomponente.alerta_estado && <Alerta />} 

            <Text style={[,{fontFamily:estilos.font_normal,color:estilos.font_color}]}>
                Texto normal
            </Text>
            <Text style={[,{fontFamily:estilos.font_negrita,color:estilos.font_color}]}>
                Texto negrita
            </Text>
            <Text style={[,{fontFamily:estilos.font_normal,color:estilos.font_sub_color}]}>
                Sub titulo
            </Text>
            <Text style={[,{fontFamily:estilos.font_normal,color:estilos.font_importe_color}]}>
                Texto importante
            </Text>

            
            <TouchableOpacity 
                style={[styles.btn,
                {backgroundColor: estilos.boton_color_fondo,
                borderColor: estilos.boton_color_borde
                }
                ]} 
                onPress={() => accion_boton()}
            >
                <Text style={[{ fontFamily: estilos.font_normal, color: estilos.font_importe_color}]}>
                BOTON
                </Text>
            </TouchableOpacity>
                
            <Surface
                style={[
                    styles.card,
                    { backgroundColor: estilos.cards_color_fondo,
                      borderColor:estilos.cards_color_border
                     },
                ]}
                    elevation={5} // para sombreado en los bordes
            >
                <Text style={[,{fontFamily:estilos.font_normal,color:estilos.font_color}]}>
                    Contenido Card
                </Text>
            </Surface>
            
        </View>
    )
}

const styles = StyleSheet.create({


btn: {
    borderWidth: 0.5,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
     width:200,
    marginTop: 4,
    left:10,
    right:10,
},
card:{
    height:100,
    width:200,
    left:10,
    right:10,
    borderRadius:20,
    
    
    justifyContent: 'center',    // Centrado vertical
    alignItems: 'center',        // Centrado horizontal

    borderWidth:0.5,
    marginTop:10
}
});