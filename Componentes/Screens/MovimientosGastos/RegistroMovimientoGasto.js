import React, { useState, useContext,useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity,
    TextInput,KeyboardAvoidingView,Platform, Image, ActivityIndicator, Modal, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../../../AuthContext';

import { useApi } from '../../../Apis/useApi';

import Notificacion from '../../Notificacion/Notificacion';
import Esperando from '../../Procesando/Espera';
import CabeceraRegistros from '../../CabeceraRegistros/CabaceraRegistros';

const formatearFecha = (fecha) => `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
const obtenerFechaLocal = (fecha) => {
    const [anno, mes, dia] = String(fecha || formatearFecha(new Date())).split('-').map(Number);
    return new Date(anno, mes - 1, dia);
};

export default function RegistroMovimientoGasto({ navigation }){
    const { colors, fonts } = useTheme();
    const { navigate } = useNavigation();
    const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);
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
    const [observacion, setObservacion] = useState('');
    const [formularioReporteVisible, setFormularioReporteVisible] = useState(false);
    const [reportando, setReportando] = useState(false);
    const [extrayendo, setExtrayendo] = useState(false);
    const [modoRegistro, setModoRegistro] = useState('asistido');
    const [mediosPagoDisponibles, setMediosPagoDisponibles] = useState([]);
    const [canalesPagoDisponibles, setCanalesPagoDisponibles] = useState([]);
    const [mediosPago, setMediosPago] = useState([]);
    const [medioPagoAbierto, setMedioPagoAbierto] = useState(null);
    const [canalPagoAbierto, setCanalPagoAbierto] = useState(null);
    const [empresasUsuario, setEmpresasUsuario] = useState([]);
    const [empresaSeleccionadaId, setEmpresaSeleccionadaId] = useState(null);
    const [empresasAbiertas, setEmpresasAbiertas] = useState(false);
    const [busquedaEmpresa, setBusquedaEmpresa] = useState('');
    const [empresaPersonalizada, setEmpresaPersonalizada] = useState(false);
    const [cargandoEmpresas, setCargandoEmpresas] = useState(false);
    const [errorEmpresas, setErrorEmpresas] = useState('');
    const [fechaPickerVisible, setFechaPickerVisible] = useState(false);
    const [fechaTemporal, setFechaTemporal] = useState(new Date());

    const empresasFiltradas = empresasUsuario.filter(empresa => {
        const busqueda = busquedaEmpresa.trim().toLowerCase();
        if (!busqueda) return true;
        return [empresa.NombreEmpresa, empresa.Rubro, empresa.Ruc]
            .some(valor => String(valor || '').toLowerCase().includes(busqueda));
    });

    const cargarReferenciales = async () => {
        setCargandoEmpresas(true);
        setErrorEmpresas('');
        const result = await apiRequest('gastos-listados/referenciales-carga-gastos', 'GET', {});
        setCargandoEmpresas(false);
        if (result.sessionExpired) return;
        if (result.resp_correcta && result.data) {
            setEmpresasUsuario(Array.isArray(result.data.Empresas) ? result.data.Empresas : []);
            setMediosPagoDisponibles((Array.isArray(result.data.MediosPagos) ? result.data.MediosPagos : [])
                .filter(medio => medio.IsActive)
                .map(medio => ({
                    ...medio,
                    TipoMedioPago: { NombreTipo: medio.tipo_medio_pago || '' },
                    EntidadUsuario: medio.entidad_usuario ? { NombreEntidad: medio.entidad_usuario } : null,
                    MarcaTarjeta: medio.marca_tarjeta ? { NombreMarca: medio.marca_tarjeta } : null,
                })));
            setCanalesPagoDisponibles(Array.isArray(result.data.Canales) ? result.data.Canales : []);
            return;
        }
        const mensaje = obtenerMensajeApi(result.data, 'No se pudieron cargar los datos referenciales');
        setErrorEmpresas(mensaje);
        mostrarError(mensaje);
    };

    const seleccionarEmpresa = (empresa) => {
        setEmpresaSeleccionadaId(String(empresa.Id));
        setEmpresaPersonalizada(false);
        setEmpresasAbiertas(false);
        setBusquedaEmpresa('');
        setPayload(prev => ({
            ...prev,
            factura: {
                ...prev.factura,
                empresa: empresa.NombreEmpresa || '',
                rubro: empresa.Rubro || '',
                ruc_empresa: empresa.Ruc || '',
            },
        }));
    };

    const seleccionarEmpresaPersonalizada = () => {
        setEmpresaSeleccionadaId('otra');
        setEmpresaPersonalizada(true);
        setEmpresasAbiertas(false);
        setBusquedaEmpresa('');
        setPayload(prev => ({
            ...prev,
            factura: { ...prev.factura, empresa: '', rubro: '', ruc_empresa: '' },
        }));
    };

    const actualizarMedioPago = (indice, campo, valor) => {
        setMediosPago(prev => prev.map((medio, index) => (
            index === indice ? { ...medio, [campo]: valor } : medio
        )));
    };

    const obtenerSaldoMediosPago = (listaMedios) => {
        const totalFactura = Number(payload?.factura?.total) || 0;
        const totalAplicado = listaMedios.reduce((total, medio) => (
            medio.id_medio ? total + (Number(medio.monto_medio) || 0) : total
        ), 0);
        return String(Math.max(0, totalFactura - totalAplicado));
    };

    const agregarMedioPago = () => {
        setMediosPago(prev => [...prev, {
            id_medio: '',
            id_canal: '',
            monto_medio: obtenerSaldoMediosPago(prev),
        }]);
    };

    const quitarMedioPago = (indice) => {
        setMediosPago(prev => prev.filter((_, index) => index !== indice));
        setMedioPagoAbierto(null);
    };

    const crearPayloadManual = () => ({
        id: 0,
        factura: {
            empresa: '',
            rubro: '',
            ruc_empresa: '',
            fecha: formatearFecha(new Date()),
            numero_factura: '',
            total: '',
            iva_diez: 0,
            iva_cinco: 0,
            fiabilidad: '',
            detalle: [],
            Model: '',
            stats: null,
            success_registro: true,
            mensaje_error: '',
            data_correct: true,
        },
        clasificacion: {
            categoria: 'S/N',
            etiquetas: [],
            modelo_clasificador: '',
            stats: null,
        },
        tipo_registro: 'Manual',
        id_stas: 0,
        medio_pago: [],
    });

    const cambiarModoRegistro = (modo) => {
        setModoRegistro(modo);
        setComprobante(null);
        setPayload(modo === 'manual' ? crearPayloadManual() : null);
        setObservacion('');
        setFormularioReporteVisible(false);
        setMediosPago([]);
        setEmpresaSeleccionadaId(null);
        setEmpresaPersonalizada(false);
        setEmpresasAbiertas(false);
        setBusquedaEmpresa('');
        setTitulo(modo === 'manual' ? 'Nuevo Movimiento Gasto Manual' : 'Nuevo Movimiento Gasto');
    };

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

    const abrirSelectorFecha = () => {
        const fechaActual = obtenerFechaLocal(payload?.factura?.fecha);
        if (Platform.OS === 'web') return;
        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: fechaActual,
                mode: 'date',
                onChange: (evento, fecha) => {
                    if (evento.type === 'set' && fecha) actualizarFactura('fecha', formatearFecha(fecha));
                },
            });
            return;
        }
        setFechaTemporal(fechaActual);
        setFechaPickerVisible(true);
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

    const elegirComprobanteGaleria = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets?.[0]) {
            setComprobante(result.assets[0]);
            setPayload(null);
            setObservacion('');
            setFormularioReporteVisible(false);
            setMediosPago([]);
        }
    };

    const tomarFotoComprobante = async () => {
        try {
            const permiso = await ImagePicker.requestCameraPermissionsAsync();
            if (!permiso.granted) {
                mostrarError('Se necesita permiso para usar la cámara y fotografiar el comprobante.');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets?.[0]) {
                setComprobante(result.assets[0]);
                setPayload(null);
                setObservacion('');
                setFormularioReporteVisible(false);
                setMediosPago([]);
            }
        } catch {
            mostrarError('No se pudo abrir la cámara. Verifique los permisos del dispositivo.');
        }
    };

    const abrirOpcionesComprobante = () => {
        if (Platform.OS === 'web') {
            elegirComprobanteGaleria();
            return;
        }
        Alert.alert('Agregar comprobante', 'Elija cómo desea agregarlo', [
            { text: 'Tomar foto', onPress: tomarFotoComprobante },
            { text: 'Elegir de galería', onPress: elegirComprobanteGaleria },
            { text: 'Cancelar', style: 'cancel' },
        ]);
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
                setPayload({ ...result.data, medio_pago: [] });
                const totalFactura = Number(result.data.factura?.total);
                setMediosPago([{
                    id_medio: '',
                    id_canal: '',
                    monto_medio: totalFactura > 0 ? String(totalFactura) : '',
                }]);
                setEmpresasAbiertas(false);
                setBusquedaEmpresa('');
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

    const esRucIndefinido = (ruc) => !ruc?.trim() || ruc.trim() === '0-0';

    const validarFormulario = () => {
        if (!payload?.factura?.fecha?.trim()) return 'Ingrese la fecha del gasto';
        if (payload?.factura?.total === '' || isNaN(Number(payload?.factura?.total))) return 'Ingrese un total de gasto válido';
        const mediosPagoIngresados = mediosPago.filter(medio => medio.id_medio || medio.id_canal);
        if (mediosPagoIngresados.some(medio => (
            !medio.id_medio || !Number.isFinite(Number(medio.monto_medio)) || Number(medio.monto_medio) <= 0
        ))) {
            return 'Seleccione un medio de pago e ingrese un monto válido para cada uno';
        }
        if (modoRegistro === 'asistido') {
            if (!payload?.clasificacion?.categoria?.trim()) return 'Ingrese la categoría';
            if (!payload?.factura?.ruc_empresa?.trim() || payload.factura.ruc_empresa.trim() === '0-0') return 'Ingrese el RUC de la empresa';
            if (!payload?.factura?.numero_factura?.trim()) return 'Ingrese el número de factura';
        } else if (empresaPersonalizada && esRucIndefinido(payload?.factura?.ruc_empresa)) {
            return 'Ingrese el RUC de la empresa';
        } else if (empresaPersonalizada && !payload?.factura?.empresa?.trim()) {
            return 'Ingrese el nombre de la empresa';
        } else if (!empresaPersonalizada && !payload?.factura?.empresa?.trim()) {
            return 'Seleccione o ingrese una empresa';
        }
        return null;
    };

    const construirBodyGasto = () => ({
            ...payload,
            factura: {
                ...payload.factura,
                ruc_empresa: payload.factura.ruc_empresa?.trim() || '0-0',
                total: Number(payload.factura.total) || 0,
                iva_diez: Number(payload.factura.iva_diez) || 0,
                iva_cinco: Number(payload.factura.iva_cinco) || 0,
            },
            clasificacion: {
                ...payload.clasificacion,
                categoria: payload.clasificacion.categoria?.trim() || 'S/N',
            },
            tipo_registro: modoRegistro === 'manual' ? 'Manual' : 'Asistido',
            medio_pago: mediosPago.filter(medio => medio.id_medio).map(medio => ({
                id_medio: Number(medio.id_medio),
                ...(medio.id_canal ? { canal_pago_id: Number(medio.id_canal) } : {}),
                monto_medio: Number(medio.monto_medio),
            })),
        });

    const registrar_gasto = async () => {
        const error = validarFormulario();
        if (error) {
            mostrarError(error);
            return;
        }

        const body = construirBodyGasto();

        console.log("body => ", body);
        
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
            valor_estado:nuevo,
            omitirnavagacion: false,
            }));
            setEstadonotificacion(true)
        } else {
            setReady(true);
        console.error('Error gastos/registro:', result.data, 'Body enviado:', JSON.stringify(body, null, 2));
        const msj = obtenerMensajeApi(result.data, `Error en la solicitud (${result.resp || 'desconocido'})`);
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

    const reportarDesajuste = async () => {
        const observacionIngresada = observacion.trim();
        if (!observacionIngresada) {
            mostrarError('Ingrese una observación para reportar el desajuste');
            return;
        }

        const body = {
            ...construirBodyGasto(),
            observacion: observacionIngresada,
        };

        setReportando(true);
        actualizarEstadocomponente('tituloloading', 'Enviando reporte');
        actualizarEstadocomponente('loading', true);
        const result = await apiRequest('gastos/reportar-imagen', 'POST', body);
        actualizarEstadocomponente('tituloloading', '');
        actualizarEstadocomponente('loading', false);
        setReportando(false);

        if (result.sessionExpired) return;
        if (result.resp_correcta) {
            setBodynotificacion(prevState => ({
                ...prevState,
                titulo: 'REPORTE DE GASTOS',
                mensaje: 'El desajuste fue reportado correctamente',
                is_error: false,
                valor_estado: '',
                omitirnavagacion: true,
            }));
            setEstadonotificacion(true);
            setObservacion('');
            setFormularioReporteVisible(false);
            return;
        }

        mostrarError(obtenerMensajeApi(result.data, 'No se pudo reportar el desajuste'));
    };
    useEffect(() => {
        if (modoRegistro !== 'manual' || !payload || empresaSeleccionadaId || payload.factura.empresa?.trim()) return;
        const empresaIndefinida = empresasUsuario.find(empresa => empresa.NombreEmpresa?.trim().toLowerCase() === 'indefinido');
        if (empresaIndefinida) seleccionarEmpresa(empresaIndefinida);
    }, [empresasUsuario, modoRegistro, payload, empresaSeleccionadaId]);

    useEffect(() => {
        setTitulo('Nuevo Movimiento Gasto')
        setReady(true)
        cargarReferenciales();
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

                <Text style={[styles.tituloSeccion, { fontFamily: estilos.font_negrita, color: estilos.font_color }]}>Registrar gasto</Text>

                <View style={[styles.selectorModo, { borderColor: estilos.cards_color_border }]}> 
                    <TouchableOpacity
                        style={[styles.opcionModo, modoRegistro === 'asistido' && { backgroundColor: estilos.boton_color_fondo }]}
                        onPress={() => cambiarModoRegistro('asistido')}
                    >
                        <Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_color }}>Con comprobante</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.opcionModo, modoRegistro === 'manual' && { backgroundColor: estilos.boton_color_fondo }]}
                        onPress={() => cambiarModoRegistro('manual')}
                    >
                        <Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_color }}>Manual</Text>
                    </TouchableOpacity>
                </View>

                {modoRegistro === 'asistido' && <View>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: estilos.boton_color_fondo, borderColor: estilos.boton_color_borde }]}
                        onPress={abrirOpcionesComprobante}
                    >
                        <MaterialCommunityIcons name="image-plus-outline" size={20} color={estilos.font_importe_color} />
                        <Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_importe_color, textAlign: 'center' }}>
                            {comprobante ? 'CAMBIAR COMPROBANTE' : 'SELECCIONAR COMPROBANTE'}
                        </Text>
                    </TouchableOpacity>
                </View>}

                {modoRegistro === 'asistido' && comprobante?.uri && <Image source={{ uri: comprobante.uri }} style={styles.preview} resizeMode="contain" />}

                {modoRegistro === 'asistido' && <TouchableOpacity
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
                </TouchableOpacity>}

                {!payload && modoRegistro === 'asistido' && <Text style={[styles.ayuda, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>Seleccione un comprobante y ejecute la extracción para editar los datos.</Text>}

                {modoRegistro === 'manual' && <Text style={[styles.ayuda, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>Complete los datos del gasto. El RUC y el número de factura son opcionales.</Text>}

                {payload && <>
                <Text style={[styles.subtitulo, { fontFamily: estilos.font_negrita, color: estilos.font_color }]}>Datos de la factura</Text>

                {modoRegistro === 'asistido' && <>
                    <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>Empresa</Text>
                    <TextInput
                        value={payload.factura.empresa || ''}
                        onChangeText={(value) => actualizarFactura('empresa', value)}
                        placeholder="Nombre de empresa"
                        placeholderTextColor={estilos.font_sub_color}
                        style={[styles.textInput, { fontFamily: estilos.font_normal, color: estilos.font_color, borderColor: estilos.cards_color_border }]}
                    />
                </>}

                {(modoRegistro !== 'manual' || empresaPersonalizada) && <>
                    <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>RUC Empresa</Text>
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
                </>}
                {modoRegistro === 'manual' && !empresaPersonalizada && (
                    <>
                        <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>RUC Empresa</Text>
                        <Text style={[styles.valorEmpresa, { fontFamily: estilos.font_normal, color: estilos.font_color }]}>
                            {payload.factura.ruc_empresa || 'Seleccione una empresa'}
                        </Text>
                    </>
                )}

                <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>
                    Fecha (AAAA-MM-DD)
                </Text>
                {modoRegistro === 'manual' ? (
                    Platform.OS === 'web' ? (
                        <View style={[styles.textInput, { borderColor: estilos.cards_color_border }]}>
                            {React.createElement('input', {
                                type: 'date',
                                value: payload.factura.fecha || formatearFecha(new Date()),
                                'aria-label': 'Fecha del gasto',
                                onChange: (evento) => actualizarFactura('fecha', evento.target.value),
                                style: {
                                    boxSizing: 'border-box',
                                    width: '100%',
                                    border: 0,
                                    outline: 'none',
                                    backgroundColor: 'transparent',
                                    color: estilos.font_color,
                                    fontFamily: estilos.font_normal,
                                    fontSize: 14,
                                },
                            })}
                        </View>
                    ) : (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel={`Seleccionar fecha ${payload.factura.fecha}`}
                            onPress={abrirSelectorFecha}
                            style={[styles.selectorFecha, { borderColor: estilos.cards_color_border }]}
                        >
                            <Text style={{ fontFamily: estilos.font_normal, color: estilos.font_color }}>{payload.factura.fecha}</Text>
                            <Text style={{ color: estilos.font_sub_color }}>▾</Text>
                        </TouchableOpacity>
                    )
                ) : (
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
                )}

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

                {modoRegistro === 'manual' && <>
                    <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>Empresa</Text>
                        {!empresaPersonalizada && (
                            <>
                                <TouchableOpacity
                                    style={[styles.selectorEmpresa, { borderColor: estilos.cards_color_border }]}
                                    onPress={() => {
                                        setEmpresasAbiertas(!empresasAbiertas);
                                        setBusquedaEmpresa('');
                                    }}
                                >
                                    <Text style={{ fontFamily: estilos.font_normal, color: estilos.font_color }}>
                                        {payload.factura.empresa || (cargandoEmpresas ? 'Cargando empresas...' : 'Seleccione una empresa')}
                                    </Text>
                                </TouchableOpacity>
                                {empresasAbiertas && (
                                    <View style={[styles.listaEmpresas, { borderColor: estilos.cards_color_border }]}>
                                        <TextInput
                                            value={busquedaEmpresa}
                                            onChangeText={setBusquedaEmpresa}
                                            placeholder="Buscar por nombre, rubro o RUC"
                                            placeholderTextColor={estilos.font_sub_color}
                                            style={[styles.busquedaEmpresa, {
                                                fontFamily: estilos.font_normal,
                                                color: estilos.font_color,
                                                borderColor: estilos.cards_color_border,
                                            }]}
                                        />
                                        {empresasFiltradas.map(empresa => (
                                            <TouchableOpacity
                                                key={empresa.Id}
                                                style={[styles.opcionEmpresa, { borderColor: estilos.cards_color_border }]}
                                                onPress={() => seleccionarEmpresa(empresa)}
                                            >
                                                <Text style={{ fontFamily: estilos.font_normal, color: estilos.font_color }}>{empresa.NombreEmpresa}</Text>
                                                {!!empresa.Ruc && <Text style={{ fontFamily: estilos.font_normal, color: estilos.font_sub_color, fontSize: 12 }}>{empresa.Ruc}</Text>}
                                            </TouchableOpacity>
                                        ))}
                                        {empresasFiltradas.length === 0 && (
                                            <Text style={[styles.sinEmpresas, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>No hay empresas que coincidan.</Text>
                                        )}
                                        <TouchableOpacity
                                            style={[styles.opcionEmpresa, { borderColor: estilos.cards_color_border }]}
                                            onPress={seleccionarEmpresaPersonalizada}
                                        >
                                            <Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_importe_color }}>Otra empresa (no está en la lista)</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                {errorEmpresas ? <Text style={[styles.ayuda, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>{errorEmpresas}</Text> : null}
                                {!empresasAbiertas && (
                                    <TouchableOpacity onPress={seleccionarEmpresaPersonalizada} style={styles.otraEmpresa}>
                                        <Text style={{ fontFamily: estilos.font_normal, color: estilos.font_importe_color }}>+ Otra empresa</Text>
                                    </TouchableOpacity>
                                )}
                                {!!payload.factura.rubro && <Text style={[styles.valorEmpresa, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>{payload.factura.rubro}</Text>}
                            </>
                        )}
                        {empresaPersonalizada && (
                            <>
                                <TextInput
                                    value={payload.factura.empresa || ''}
                                    onChangeText={(value) => actualizarFactura('empresa', value)}
                                    placeholder="Nombre de empresa"
                                    placeholderTextColor={estilos.font_sub_color}
                                    style={[styles.textInput, { fontFamily: estilos.font_normal, color: estilos.font_color, borderColor: estilos.cards_color_border }]}
                                />
                                <TouchableOpacity onPress={() => {
                                    setEmpresaPersonalizada(false);
                                    setEmpresaSeleccionadaId(null);
                                    setPayload(prev => ({
                                        ...prev,
                                        factura: { ...prev.factura, empresa: '', rubro: '', ruc_empresa: '' },
                                    }));
                                }} style={styles.otraEmpresa}>
                                    <Text style={{ fontFamily: estilos.font_normal, color: estilos.font_importe_color }}>Elegir de la lista</Text>
                                </TouchableOpacity>
                            </>
                        )}
                </>}

                {(modoRegistro !== 'manual' || empresaPersonalizada) && <>
                    <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>Rubro</Text>
                    <TextInput value={payload.factura.rubro || ''} onChangeText={(value) => actualizarFactura('rubro', value)} placeholder="Rubro" placeholderTextColor={estilos.font_sub_color} style={[styles.textInput, { fontFamily: estilos.font_normal, color: estilos.font_color, borderColor: estilos.cards_color_border }]} />
                </>}

                {/* ── Etiquetas y conceptos ── */}
                {/* <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>
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
                <TouchableOpacity onPress={agregarEtiqueta} style={styles.agregarEtiqueta}><Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_importe_color }}>+ AGREGAR ETIQUETA</Text></TouchableOpacity> */}

                <Text style={[styles.subtitulo, { fontFamily: estilos.font_negrita, color: estilos.font_color }]}>Medios de pago</Text>
                {mediosPagoDisponibles.length === 0 ? (
                    <Text style={[styles.ayuda, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>
                        No hay medios de pago activos. Configure uno desde el menú.
                    </Text>
                ) : mediosPago.length === 0 ? (
                    <Text style={[styles.ayuda, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>
                        Opcional. Puede registrar el gasto sin asignar un medio de pago.
                    </Text>
                ) : mediosPago.map((medio, indice) => {
                    const medioSeleccionado = mediosPagoDisponibles.find(opcion => String(opcion.Id) === String(medio.id_medio));
                    const canalSeleccionado = canalesPagoDisponibles.find(opcion => String(opcion.Id) === String(medio.id_canal));
                    const nombreMedio = medioSeleccionado
                        ? [medioSeleccionado.TipoMedioPago?.NombreTipo, medioSeleccionado.EntidadUsuario?.NombreEntidad, medioSeleccionado.MarcaTarjeta?.NombreMarca].filter(Boolean).join(' · ')
                        : 'Seleccione un medio de pago';

                    return (
                        <View key={`medio-pago-${indice}`} style={[styles.etiquetaCard, { backgroundColor: estilos.cards_color_fondo, borderColor: estilos.cards_color_border }]}>
                            <View style={styles.filaEtiqueta}>
                                <TouchableOpacity
                                    style={[styles.selectorMedioPago, { borderColor: estilos.cards_color_border }]}
                                    onPress={() => setMedioPagoAbierto(medioPagoAbierto === indice ? null : indice)}
                                >
                                    <Text style={{ fontFamily: estilos.font_normal, color: estilos.font_color }}>{nombreMedio}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => quitarMedioPago(indice)}>
                                    <Text style={{ color: estilos.font_sub_color, fontSize: 18 }}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            {medioPagoAbierto === indice && mediosPagoDisponibles.map(opcion => {
                                const nombreOpcion = [opcion.TipoMedioPago?.NombreTipo, opcion.EntidadUsuario?.NombreEntidad, opcion.MarcaTarjeta?.NombreMarca].filter(Boolean).join(' · ');
                                return (
                                    <TouchableOpacity
                                        key={opcion.Id}
                                        style={[styles.opcionMedioPago, { borderColor: estilos.cards_color_border }]}
                                        onPress={() => {
                                            actualizarMedioPago(indice, 'id_medio', opcion.Id);
                                            setMedioPagoAbierto(null);
                                        }}
                                    >
                                        <Text style={{ fontFamily: estilos.font_normal, color: estilos.font_color }}>{nombreOpcion}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                            <Text style={[styles.label, { fontFamily: estilos.font_normal, color: estilos.font_sub_color, marginTop: 10 }]}>Canal (opcional)</Text>
                            <TouchableOpacity
                                style={[styles.selectorMedioPago, { borderColor: estilos.cards_color_border }]}
                                onPress={() => setCanalPagoAbierto(canalPagoAbierto === indice ? null : indice)}
                            >
                                <Text style={{ fontFamily: estilos.font_normal, color: canalSeleccionado ? estilos.font_color : estilos.font_sub_color }}>
                                    {canalSeleccionado?.NombreCanal || 'Sin seleccionar'}
                                </Text>
                            </TouchableOpacity>
                            {canalPagoAbierto === indice && (
                                <View>
                                    <TouchableOpacity
                                        style={[styles.opcionMedioPago, { borderColor: estilos.cards_color_border }]}
                                        onPress={() => {
                                            actualizarMedioPago(indice, 'id_canal', '');
                                            setCanalPagoAbierto(null);
                                        }}
                                    >
                                        <Text style={{ fontFamily: estilos.font_normal, color: estilos.font_sub_color }}>Sin seleccionar</Text>
                                    </TouchableOpacity>
                                    {canalesPagoDisponibles.map(opcion => (
                                        <TouchableOpacity
                                            key={opcion.Id}
                                            style={[styles.opcionMedioPago, { borderColor: estilos.cards_color_border }]}
                                            onPress={() => {
                                                actualizarMedioPago(indice, 'id_canal', opcion.Id);
                                                setCanalPagoAbierto(null);
                                            }}
                                        >
                                            <Text style={{ fontFamily: estilos.font_normal, color: estilos.font_color }}>{opcion.NombreCanal}</Text>
                                        </TouchableOpacity>
                                    ))}
                                    {canalesPagoDisponibles.length === 0 && (
                                        <Text style={[styles.sinEmpresas, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>No hay canales disponibles.</Text>
                                    )}
                                </View>
                            )}
                            <TextInput
                                value={String(medio.monto_medio)}
                                onChangeText={valor => actualizarMedioPago(indice, 'monto_medio', valor)}
                                keyboardType="numeric"
                                placeholder="Monto aplicado"
                                placeholderTextColor={estilos.font_sub_color}
                                style={[styles.textInput, { fontFamily: estilos.font_normal, color: estilos.font_color, borderColor: estilos.cards_color_border, marginTop: 10, marginBottom: 0 }]}
                            />
                        </View>
                    );
                })}
                {mediosPagoDisponibles.length > 0 && (
                    <TouchableOpacity onPress={agregarMedioPago} style={styles.agregarEtiqueta}>
                        <Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_importe_color }}>+ AGREGAR MEDIO DE PAGO</Text>
                    </TouchableOpacity>
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

                {modoRegistro === 'asistido' && <>
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Reportar desajuste"
                        accessibilityHint="Abre el campo para describir el desajuste"
                        accessibilityState={{ expanded: formularioReporteVisible }}
                        title={Platform.OS === 'web' ? '¿Notaste un desajuste? Reportarlo' : undefined}
                        onPress={() => setFormularioReporteVisible(prev => !prev)}
                        style={[styles.reporteBotonIcono, {
                            backgroundColor: estilos.cards_color_fondo,
                            borderColor: estilos.cards_color_border,
                        }]}
                    >
                        <MaterialCommunityIcons
                            name="message-alert-outline"
                            size={21}
                            color={estilos.font_sub_color}
                        />
                    </TouchableOpacity>
                    {formularioReporteVisible && <>
                        <TextInput
                            value={observacion}
                            onChangeText={setObservacion}
                            placeholder="Ej: el formato no es correcto"
                            placeholderTextColor={estilos.font_sub_color}
                            accessibilityLabel="Observación del desajuste"
                            multiline
                            maxLength={500}
                            textAlignVertical="top"
                            style={[styles.textInput, styles.textArea, {
                                fontFamily: estilos.font_normal,
                                color: estilos.font_color,
                                borderColor: estilos.cards_color_border,
                            }]}
                        />
                        <TouchableOpacity
                            style={[styles.btn, {
                                backgroundColor: estilos.boton_color_fondo,
                                borderColor: estilos.boton_color_borde,
                                opacity: reportando ? 0.65 : 1,
                            }]}
                            onPress={reportarDesajuste}
                            disabled={reportando}
                        >
                            {reportando ? (
                                <View style={styles.loadingButtonContent}>
                                    <ActivityIndicator size="small" color={estilos.font_importe_color} />
                                    <Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_importe_color }}>REPORTANDO...</Text>
                                </View>
                            ) : (
                                <Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_importe_color }}>ENVIAR REPORTE</Text>
                            )}
                        </TouchableOpacity>
                    </>}
                </>}
                </>}

            </ScrollView>
            {Platform.OS === 'ios' && (
                <Modal
                    transparent
                    visible={fechaPickerVisible}
                    animationType="fade"
                    onRequestClose={() => setFechaPickerVisible(false)}
                >
                    <View style={styles.modalFechaOverlay}>
                        <View style={[styles.modalFecha, { backgroundColor: estilos.cards_color_fondo, borderColor: estilos.cards_color_border }]}>
                            <DateTimePicker
                                value={fechaTemporal}
                                mode="date"
                                display="spinner"
                                onChange={(_, fecha) => { if (fecha) setFechaTemporal(fecha); }}
                            />
                            <View style={styles.accionesFecha}>
                                <TouchableOpacity onPress={() => setFechaPickerVisible(false)} style={styles.accionFecha}>
                                    <Text style={{ color: estilos.font_sub_color, fontFamily: estilos.font_normal }}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        actualizarFactura('fecha', formatearFecha(fechaTemporal));
                                        setFechaPickerVisible(false);
                                    }}
                                    style={styles.accionFecha}
                                >
                                    <Text style={{ color: estilos.font_importe_color, fontFamily: estilos.font_negrita }}>Aplicar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
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
    selectorModo: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 12,
        overflow: 'hidden',
    },
    opcionModo: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
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
    textArea: {
        minHeight: 96,
    },
    reporteBotonIcono: {
        alignSelf: 'flex-end',
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
    },
    selectorFecha: {
        minHeight: 42,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalFechaOverlay: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalFecha: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 14,
    },
    accionesFecha: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 18,
    },
    accionFecha: {
        paddingHorizontal: 8,
        paddingVertical: 10,
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
    selectorMedioPago: {
        flex: 1,
        minHeight: 42,
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    selectorEmpresa: {
        minHeight: 42,
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    listaEmpresas: {
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 8,
        overflow: 'hidden',
    },
    busquedaEmpresa: {
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 9,
        paddingHorizontal: 10,
        margin: 8,
        fontSize: 14,
    },
    sinEmpresas: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 13,
    },
    opcionEmpresa: {
        minHeight: 44,
        justifyContent: 'center',
        borderBottomWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    valorEmpresa: {
        marginBottom: 12,
        fontSize: 13,
    },
    otraEmpresa: {
        paddingVertical: 8,
        marginBottom: 8,
    },
    opcionMedioPago: {
        minHeight: 40,
        justifyContent: 'center',
        borderBottomWidth: 1,
        paddingHorizontal: 8,
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