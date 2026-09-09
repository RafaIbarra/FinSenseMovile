import React, { useState, useContext,useEffect } from 'react';
import {
  View, StyleSheet, Text, ScrollView, TouchableOpacity,
  TextInput,KeyboardAvoidingView,Platform
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../../../AuthContext';

import { useApi } from '../../../Apis/useApi';

import Notificacion from '../../Notificacion/Notificacion';
import Esperando from '../../Procesando/Espera';
import CabeceraRegistros from '../../CabeceraRegistros/CabaceraRegistros';

export default function RegistroMovimientoGasto({ navigation }){
    const { colors, fonts } = useTheme();
    const { navigate } = useNavigation();
    const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);
    const { asignar_opciones_alerta } = useContext(AuthContext);
    const [ready, setReady] = useState(false);
    const { actualizacion_registro_movimiento_gasto } = useContext(AuthContext);
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { reiniciarvalores } = useContext(AuthContext);
    const [estadonotificacion,setEstadonotificacion]=useState(false)
    const [bodynotificacion,setBodynotificacion]=useState({ mensaje:'',
                                                          titulo:'',
                                                          is_error:false,
                                                          estado_actualizar:'',
                                                          valor_estado:'',
                                                          navnivel1:'',
                                                          navnivel2:'',
                                                          navnivel3:'',
                                                          type:'funcion',
                                                          funcion_name:actualizacion_registro_movimiento_gasto
                                                        })
    const [titulo,setTitulo]=useState('')

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

    // ── Campos del formulario ──
    const [rucEmpresa, setRucEmpresa] = useState('');
    const [fecha, setFecha] = useState('');
    const [numeroFactura, setNumeroFactura] = useState('');
    const [total, setTotal] = useState('');
    const [ivaDiez, setIvaDiez] = useState('0');
    const [ivaCinco, setIvaCinco] = useState('0');
    const [categoria, setCategoria] = useState('');
    const [etiquetaActual, setEtiquetaActual] = useState('');
    const [etiquetas, setEtiquetas] = useState([]);

    const agregarEtiqueta = () => {
        const valor = etiquetaActual.trim();
        if (!valor) return;
        if (etiquetas.includes(valor)) {
            setEtiquetaActual('');
            return;
        }
        setEtiquetas(prev => [...prev, valor]);
        setEtiquetaActual('');
    };

    const quitarEtiqueta = (valor) => {
        setEtiquetas(prev => prev.filter(e => e !== valor));
    };

    const validarFormulario = () => {
        if (!rucEmpresa.trim()) return 'Ingrese el RUC de la empresa';
        if (!fecha.trim()) return 'Ingrese la fecha del gasto';
        if (!numeroFactura.trim()) return 'Ingrese el número de factura';
        if (!total.trim() || isNaN(Number(total))) return 'Ingrese un total de gasto válido';
        if (!categoria.trim()) return 'Ingrese la categoría';
        return null;
    };

    const registrar_gasto = async () => {
        const error = validarFormulario();
        if (error) {
            asignar_opciones_alerta(true, 'ERROR', error, 'Gastos', 'bandera_registro_gasto', false);
            actualizarEstadocomponente('alerta_estado', true);
            return;
        }

        const body = {
            id: 0,
            factura: {
                empresa: '',
                rubro: '',
                ruc_empresa: rucEmpresa.trim(),
                fecha: fecha.trim(),
                numero_factura: numeroFactura.trim(),
                total: Number(total) || 0,
                iva_diez: Number(ivaDiez) || 0,
                iva_cinco: Number(ivaCinco) || 0,
                detalle: [],
                Model: '',
            },
            clasificacion: {
                categoria: categoria.trim(),
                etiquetas: etiquetas.map(e => ({ etiqueta: e })),
                modelo_clasificador: '',
            },
            imagenes: {},
            tipo_registro: 'Manual',
        };

        actualizarEstadocomponente('tituloloading', 'Registrando');
        actualizarEstadocomponente('loading', true);

        const endpoint = `gastos/registro`;
        const result = await apiRequest(endpoint, 'POST', body);

        actualizarEstadocomponente('tituloloading', '');
        actualizarEstadocomponente('loading', false);

        if (result.sessionExpired) {
            return; // SI LA SESION NO ES VALIDA
        }
        if (result.resp_correcta) {
            const nuevo = !estadocomponente.bandera_registro_gasto;
            const mensajeExito = 'Registro correcto del movimiento';
            setBodynotificacion(prevState => ({
            ...prevState,
            titulo:'REGISTRO GASTOS',
            mensaje: mensajeExito,
            is_error: false,
            valor_estado:nuevo
            }));
            setEstadonotificacion(true)
        } else {
            setReady(true);
        const msj = result.data?.message || 'Error en la solicitud';
        setBodynotificacion(prevState => ({
          ...prevState,
          titulo:'REGISTRO GASTOS',
          mensaje: msj,
          is_error: true,
          valor_estado:''
        }));
        setEstadonotificacion(true)
        }
    };
    useEffect(() => {
        setTitulo('Nuevo Movimiento Gasto')
        setReady(true)
    
  }, []);
    const onOk=()=>{
    setEstadonotificacion(false)
    }
    return(
        <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
            {/* Para ver la alerta */}
            {estadonotificacion && <Notificacion navigation={navigation} bodynotificacion={bodynotificacion} onOk={onOk} />}
            <CabeceraRegistros
                title={titulo}
                navigation={navigation}
                onDelete={() => {}}
                onEdit={() => {}}
                showbottons={false}
                
              />

            <ScrollView
                style={{ flex: 1, backgroundColor: estilos.pantalla_color_fondo }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
            >

                <Text style={[styles.tituloSeccion, { fontFamily: estilos.font_negrita, color: estilos.font_color }]}>
                    Registrar Gasto
                </Text>

                <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>
                    RUC Empresa
                </Text>
                <TextInput
                    value={rucEmpresa}
                    onChangeText={setRucEmpresa}
                    placeholder="0-0"
                    placeholderTextColor={estilos.font_sub_color}
                    style={[styles.textInput, {
                        fontFamily: estilos.font_normal,
                        color: estilos.font_color,
                        borderColor: estilos.cards_color_border,
                    }]}
                />

                <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>
                    Fecha (AAAA-MM-DD)
                </Text>
                <TextInput
                    value={fecha}
                    onChangeText={setFecha}
                    placeholder="2025-08-10"
                    placeholderTextColor={estilos.font_sub_color}
                    style={[styles.textInput, {
                        fontFamily: estilos.font_normal,
                        color: estilos.font_color,
                        borderColor: estilos.cards_color_border,
                    }]}
                />

                <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>
                    Número de Factura
                </Text>
                <TextInput
                    value={numeroFactura}
                    onChangeText={setNumeroFactura}
                    placeholder="252-002-0022401"
                    placeholderTextColor={estilos.font_sub_color}
                    style={[styles.textInput, {
                        fontFamily: estilos.font_normal,
                        color: estilos.font_color,
                        borderColor: estilos.cards_color_border,
                    }]}
                />

                <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>
                    Total Gasto
                </Text>
                <TextInput
                    value={total}
                    onChangeText={setTotal}
                    keyboardType="numeric"
                    placeholder="Monto"
                    placeholderTextColor={estilos.font_sub_color}
                    style={[styles.textInput, {
                        fontFamily: estilos.font_normal,
                        color: estilos.font_importe_color,
                        borderColor: estilos.cards_color_border,
                    }]}
                />

                <View style={styles.filaDoble}>
                    <View style={styles.inputMitad}>
                        <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>
                            IVA 10%
                        </Text>
                        <TextInput
                            value={ivaDiez}
                            onChangeText={setIvaDiez}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={estilos.font_sub_color}
                            style={[styles.textInput, {
                                fontFamily: estilos.font_normal,
                                color: estilos.font_color,
                                borderColor: estilos.cards_color_border,
                            }]}
                        />
                    </View>
                    <View style={styles.inputMitad}>
                        <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>
                            IVA 5%
                        </Text>
                        <TextInput
                            value={ivaCinco}
                            onChangeText={setIvaCinco}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={estilos.font_sub_color}
                            style={[styles.textInput, {
                                fontFamily: estilos.font_normal,
                                color: estilos.font_color,
                                borderColor: estilos.cards_color_border,
                            }]}
                        />
                    </View>
                </View>

                <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>
                    Categoría
                </Text>
                <TextInput
                    value={categoria}
                    onChangeText={setCategoria}
                    placeholder="Ej: Supermercados"
                    placeholderTextColor={estilos.font_sub_color}
                    style={[styles.textInput, {
                        fontFamily: estilos.font_normal,
                        color: estilos.font_color,
                        borderColor: estilos.cards_color_border,
                    }]}
                />

                {/* ── Etiquetas ── */}
                <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>
                    Etiquetas (opcional)
                </Text>
                <View style={styles.filaEtiqueta}>
                    <TextInput
                        value={etiquetaActual}
                        onChangeText={setEtiquetaActual}
                        onSubmitEditing={agregarEtiqueta}
                        placeholder="Ej: Bebidas"
                        placeholderTextColor={estilos.font_sub_color}
                        style={[styles.textInput, styles.inputEtiqueta, {
                            fontFamily: estilos.font_normal,
                            color: estilos.font_color,
                            borderColor: estilos.cards_color_border,
                        }]}
                    />
                    <TouchableOpacity
                        style={[styles.btnAgregar, { backgroundColor: estilos.boton_color_fondo, borderColor: estilos.boton_color_borde }]}
                        onPress={agregarEtiqueta}
                    >
                        <Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_importe_color, fontSize: 18 }}>
                            +
                        </Text>
                    </TouchableOpacity>
                </View>

                {etiquetas.length > 0 && (
                    <View style={styles.chipsWrap}>
                        {etiquetas.map((et) => (
                            <View
                                key={et}
                                style={[styles.chip, { backgroundColor: estilos.cards_color_fondo, borderColor: estilos.cards_color_border }]}
                            >
                                <Text style={[styles.chipText, { fontFamily: estilos.font_normal, color: estilos.font_color }]}>
                                    {et}
                                </Text>
                                <TouchableOpacity onPress={() => quitarEtiqueta(et)} style={styles.chipRemove}>
                                    <Text style={{ color: estilos.font_sub_color, fontSize: 14 }}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.btn,
                        { backgroundColor: estilos.boton_color_fondo, borderColor: estilos.boton_color_borde }
                    ]}
                    onPress={registrar_gasto}
                >
                    <Text style={[{ fontFamily: estilos.font_normal, color: estilos.font_importe_color }]}>
                        REGISTRAR GASTO
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
    scrollContenido: {
        padding: 16,
        paddingBottom: 60,
        flexGrow: 1,
    },
    tituloSeccion: {
        fontSize: 16,
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        marginBottom: 4,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 12,
        fontSize: 14,
    },
    filaDoble: {
        flexDirection: 'row',
        gap: 12,
    },
    inputMitad: {
        flex: 1,
    },
    filaEtiqueta: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    inputEtiqueta: {
        flex: 1,
    },
    btnAgregar: {
        borderWidth: 0.5,
        borderRadius: 10,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
        marginTop: -4,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    chipText: {
        fontSize: 12,
        marginRight: 6,
    },
    chipRemove: {
        padding: 2,
    },
    btn: {
        borderWidth: 0.5,
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        marginTop: 8,
    },
});