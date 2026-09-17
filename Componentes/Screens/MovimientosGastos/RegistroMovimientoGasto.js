import React, { useState, useContext,useEffect } from 'react';
import {
    View, StyleSheet, Text, ScrollView, TouchableOpacity,
    TextInput,KeyboardAvoidingView,Platform, Image, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
    const [comprobante, setComprobante] = useState(null);
    const [payload, setPayload] = useState(null);
    const [extrayendo, setExtrayendo] = useState(false);

    const actualizarFactura = (campo, valor) => {
        setPayload(prev => ({
            ...prev,
            factura: { ...prev.factura, [campo]: valor },
        }));
    };

    const actualizarClasificacion = (campo, valor) => {
        setPayload(prev => ({
            ...prev,
            clasificacion: { ...prev.clasificacion, [campo]: valor },
        }));
    };

    const mostrarError = (mensaje) => {
        setBodynotificacion(prev => ({
            ...prev,
            titulo: 'GASTOS',
            mensaje,
            is_error: true,
        }));
        setEstadonotificacion(true);
    };

    const obtenerMensajeApi = (data, mensajePredeterminado) => {
        if (data?.message) return data.message;
        if (data?.mensaje_error) return data.mensaje_error;
        if (typeof data?.detail === 'string') return data.detail;
        if (Array.isArray(data?.detail)) {
            return data.detail.map(error => `${error.loc?.join('.') || 'campo'}: ${error.msg}`).join('\n');
        }
        if (data?.error) return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        if (typeof data === 'string' && data.trim()) return data;
        if (data && Object.keys(data).length > 0) return JSON.stringify(data);
        return mensajePredeterminado;
    };

    const seleccionarComprobante = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets?.[0]) {
            setComprobante(result.assets[0]);
            setPayload(null);
        }
    };

    const extraerClasificar = async () => {
        if (!comprobante?.uri) {
            mostrarError('Seleccione una imagen del comprobante');
            return;
        }

        const formData = new FormData();
        const archivo = Platform.OS === 'web' && comprobante.file
            ? comprobante.file
            : {
                uri: comprobante.uri,
                name: comprobante.fileName || 'comprobante.jpg',
                type: comprobante.mimeType || 'image/jpeg',
            };
        formData.append('imagenes', archivo);

        setExtrayendo(true);
        setTitulo('Extrayendo comprobante');
        actualizarEstadocomponente('tituloloading', 'EXTRAYENDO Y CLASIFICANDO');
        actualizarEstadocomponente('loading', true);
        try {
            const result = await apiRequest('gastos/extraer-clasificar', 'POST', formData, { timeout: 60000 });
            console.error('Respuesta gastos/extraer-clasificar:', result);

            if (result.sessionExpired) return;
            if (result.resp_correcta && result.data) {
                setPayload(result.data);
                setTitulo('Editar movimiento gasto');
                return;
            }

            mostrarError(obtenerMensajeApi(result.data, 'No se pudo procesar el comprobante'));
        } finally {
            actualizarEstadocomponente('tituloloading', '');
            actualizarEstadocomponente('loading', false);
            setExtrayendo(false);
        }
    };

    const actualizarEtiqueta = (indice, campo, valor) => {
        setPayload(prev => ({
            ...prev,
            clasificacion: {
                ...prev.clasificacion,
                etiquetas: prev.clasificacion.etiquetas.map((etiqueta, index) => (
                    index === indice ? { ...etiqueta, [campo]: valor } : etiqueta
                )),
            },
        }));
    };

    const quitarEtiqueta = (indice) => {
        setPayload(prev => ({
            ...prev,
            clasificacion: {
                ...prev.clasificacion,
                etiquetas: prev.clasificacion.etiquetas.filter((_, index) => index !== indice),
            },
        }));
    };

    const agregarEtiqueta = () => {
        setPayload(prev => ({
            ...prev,
            clasificacion: {
                ...prev.clasificacion,
                etiquetas: [...(prev.clasificacion.etiquetas || []), { etiqueta: '', conceptos: [] }],
            },
        }));
    };

    const actualizarConcepto = (etiquetaIndex, conceptoIndex, valor) => {
        setPayload(prev => ({
            ...prev,
            clasificacion: {
                ...prev.clasificacion,
                etiquetas: prev.clasificacion.etiquetas.map((etiqueta, index) => (
                    index === etiquetaIndex
                        ? { ...etiqueta, conceptos: etiqueta.conceptos.map((concepto, idx) => idx === conceptoIndex ? valor : concepto) }
                        : etiqueta
                )),
            },
        }));
    };

    const validarFormulario = () => {
        if (!payload?.factura?.ruc_empresa?.trim()) return 'Ingrese el RUC de la empresa';
        if (!payload?.factura?.fecha?.trim()) return 'Ingrese la fecha del gasto';
        if (!payload?.factura?.numero_factura?.trim()) return 'Ingrese el número de factura';
        if (payload?.factura?.total === '' || isNaN(Number(payload?.factura?.total))) return 'Ingrese un total de gasto válido';
        if (!payload?.clasificacion?.categoria?.trim()) return 'Ingrese la categoría';
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
            ...payload,
            factura: {
                ...payload.factura,
                total: Number(payload.factura.total) || 0,
                iva_diez: Number(payload.factura.iva_diez) || 0,
                iva_cinco: Number(payload.factura.iva_cinco) || 0,
            },
            tipo_registro: payload.tipo_registro || 'Asistido',
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

                <Text style={[styles.tituloSeccion, { fontFamily: estilos.font_negrita, color: estilos.font_color }]}>Registrar Gasto con comprobante</Text>

                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: estilos.boton_color_fondo, borderColor: estilos.boton_color_borde }]}
                    onPress={seleccionarComprobante}
                >
                    <Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_importe_color }}>
                        {comprobante ? 'CAMBIAR COMPROBANTE' : 'SELECCIONAR COMPROBANTE'}
                    </Text>
                </TouchableOpacity>

                {comprobante?.uri && <Image source={{ uri: comprobante.uri }} style={styles.preview} resizeMode="contain" />}

                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: estilos.boton_color_fondo, borderColor: estilos.boton_color_borde, opacity: extrayendo ? 0.65 : 1 }]}
                    onPress={extraerClasificar}
                    disabled={extrayendo}
                >
                    {extrayendo ? (
                        <View style={styles.loadingButtonContent}>
                            <ActivityIndicator size="small" color={estilos.font_importe_color} />
                            <Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_importe_color }}>PROCESANDO...</Text>
                        </View>
                    ) : (
                        <Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_importe_color }}>EXTRAER Y CLASIFICAR</Text>
                    )}
                </TouchableOpacity>

                {!payload && <Text style={[styles.ayuda, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>Seleccione un comprobante y ejecute la extracción para editar los datos.</Text>}

                {payload && <>
                <Text style={[styles.subtitulo, { fontFamily: estilos.font_negrita, color: estilos.font_color }]}>Datos de la factura</Text>

                <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>
                    RUC Empresa
                </Text>
                <TextInput
                    value={payload.factura.ruc_empresa || ''}
                    onChangeText={(value) => actualizarFactura('ruc_empresa', value)}
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
                    value={payload.factura.fecha || ''}
                    onChangeText={(value) => actualizarFactura('fecha', value)}
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
                    value={payload.factura.numero_factura || ''}
                    onChangeText={(value) => actualizarFactura('numero_factura', value)}
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
                    value={String(payload.factura.total ?? '')}
                    onChangeText={(value) => actualizarFactura('total', value)}
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
                            value={String(payload.factura.iva_diez ?? 0)}
                            onChangeText={(value) => actualizarFactura('iva_diez', value)}
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
                            value={String(payload.factura.iva_cinco ?? 0)}
                            onChangeText={(value) => actualizarFactura('iva_cinco', value)}
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
                    value={payload.clasificacion.categoria || ''}
                    onChangeText={(value) => actualizarClasificacion('categoria', value)}
                    placeholder="Ej: Supermercados"
                    placeholderTextColor={estilos.font_sub_color}
                    style={[styles.textInput, {
                        fontFamily: estilos.font_normal,
                        color: estilos.font_color,
                        borderColor: estilos.cards_color_border,
                    }]}
                />

                <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>Empresa</Text>
                <TextInput value={payload.factura.empresa || ''} onChangeText={(value) => actualizarFactura('empresa', value)} placeholder="Empresa" placeholderTextColor={estilos.font_sub_color} style={[styles.textInput, { fontFamily: estilos.font_normal, color: estilos.font_color, borderColor: estilos.cards_color_border }]} />

                <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>Rubro</Text>
                <TextInput value={payload.factura.rubro || ''} onChangeText={(value) => actualizarFactura('rubro', value)} placeholder="Rubro" placeholderTextColor={estilos.font_sub_color} style={[styles.textInput, { fontFamily: estilos.font_normal, color: estilos.font_color, borderColor: estilos.cards_color_border }]} />

                {/* ── Etiquetas y conceptos ── */}
                <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>
                    Etiquetas y conceptos
                </Text>
                {payload.clasificacion.etiquetas?.map((etiqueta, etiquetaIndex) => (
                    <View key={`etiqueta-${etiquetaIndex}`} style={[styles.etiquetaCard, { backgroundColor: estilos.cards_color_fondo, borderColor: estilos.cards_color_border }]}>
                        <View style={styles.filaEtiqueta}>
                            <TextInput value={etiqueta.etiqueta || ''} onChangeText={(value) => actualizarEtiqueta(etiquetaIndex, 'etiqueta', value)} placeholder="Nombre de etiqueta" placeholderTextColor={estilos.font_sub_color} style={[styles.textInput, styles.inputEtiqueta, { fontFamily: estilos.font_normal, color: estilos.font_color, borderColor: estilos.cards_color_border }]} />
                            <TouchableOpacity onPress={() => quitarEtiqueta(etiquetaIndex)}><Text style={{ color: estilos.font_sub_color, fontSize: 18 }}>✕</Text></TouchableOpacity>
                        </View>
                        {etiqueta.conceptos?.map((concepto, conceptoIndex) => (
                            <TextInput key={`concepto-${etiquetaIndex}-${conceptoIndex}`} value={concepto} onChangeText={(value) => actualizarConcepto(etiquetaIndex, conceptoIndex, value)} placeholder="Concepto" placeholderTextColor={estilos.font_sub_color} style={[styles.textInput, { fontFamily: estilos.font_normal, color: estilos.font_color, borderColor: estilos.cards_color_border }]} />
                        ))}
                    </View>
                ))}
                <TouchableOpacity onPress={agregarEtiqueta} style={styles.agregarEtiqueta}><Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_importe_color }}>+ AGREGAR ETIQUETA</Text></TouchableOpacity>

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
                </>}

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
    subtitulo: {
        fontSize: 15,
        marginTop: 10,
        marginBottom: 12,
    },
    ayuda: {
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 12,
    },
    loadingButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    preview: {
        width: '100%',
        height: 190,
        marginBottom: 12,
        borderRadius: 10,
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
    etiquetaCard: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    agregarEtiqueta: {
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 8,
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