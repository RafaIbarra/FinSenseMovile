import React, { useCallback, useContext, useRef, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { AuthContext } from '../../../AuthContext';
import { useApi } from '../../../Apis/useApi';
import Esperando from '../../Procesando/Espera';

const formatoGs = (valor) => `Gs. ${Number(valor || 0).toLocaleString('es-ES')}`;
const formatoFechaISO = (fecha) => `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
const formatoFechaVisible = (fecha) => `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()}`;
const TODOS_LOS_MEDIOS = '__todos__';
const SIN_MEDIO_PAGO = '__sin_medio_pago__';
const obtenerNombreMedioPago = (medio) => {
  const nombres = [
    medio.TipoMedioPago?.NombreTipo,
    medio.EntidadUsuario?.NombreEntidad,
    medio.MarcaTarjeta?.NombreMarca,
  ].filter(Boolean);
  const canal = medio.CanalPago?.NombreCanal || medio.CanalPago?.Nombre || (typeof medio.CanalPago === 'string' ? medio.CanalPago : '');
  return nombres.join(' · ') || canal || 'Otro medio de pago';
};
const obtenerMontoMedioPago = (medio) => Number(medio.MontoMedio ?? medio.monto_medio) || 0;

export default function InformeGastos() {
  const { colors, fonts } = useTheme();
  const { setActivarsesion, reiniciarvalores, actualizarEstadocomponente } = useContext(AuthContext);
  const apiRequest = useApi({ setActivarsesion, reiniciarvalores, actualizarEstadocomponente });
  const fechaActual = new Date();
  const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
  const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
  const [desdeSeleccionado, setDesdeSeleccionado] = useState(primerDiaMes);
  const [hastaSeleccionado, setHastaSeleccionado] = useState(ultimoDiaMes);
  const [fechaActiva, setFechaActiva] = useState(null);
  const [fechaTemporal, setFechaTemporal] = useState(primerDiaMes);
  const [selectorFechaVisible, setSelectorFechaVisible] = useState(false);
  const [movimientos, setMovimientos] = useState([]);
  const [medioPagoSeleccionado, setMedioPagoSeleccionado] = useState(TODOS_LOS_MEDIOS);
  const [selectorMedioPagoVisible, setSelectorMedioPagoVisible] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const rangoSeleccionadoRef = useRef({ desde: primerDiaMes, hasta: ultimoDiaMes });
  rangoSeleccionadoRef.current = { desde: desdeSeleccionado, hasta: hastaSeleccionado };

  const estilos = {
    fondo: colors.screen_componente_estilos.color_fondo,
    texto: colors.screen_componente_estilos.color_texto,
    subtitulo: colors.screen_componente_estilos.color_texto_subtitulo,
    importante: colors.screen_componente_estilos.color_texto_importante,
    card: colors.screen_componente_estilos.color_fondo_cards,
    borde: colors.screen_componente_estilos.color_borde_cards,
    boton: colors.screen_componente_estilos.color_fondo_botones,
    fuente: fonts.balsamiqregular.fontFamily,
    fuenteNegrita: fonts.balsamiqbold.fontFamily,
  };
  const cargarInforme = useCallback(async (desde, hasta) => {
    const desdeParametro = formatoFechaISO(desde);
    const hastaParametro = formatoFechaISO(hasta);
    if (desdeParametro > hastaParametro) {
      setError('La fecha desde no puede ser posterior a la fecha hasta.');
      return;
    }
    setCargando(true);
    setError('');
    const resultado = await apiRequest(`gastos-listados/movimientos-usuario?desde=${desdeParametro}&hasta=${hastaParametro}`, 'GET', {});

    if (resultado.sessionExpired) {
      setCargando(false);
      return;
    }

    const registros = resultado.data?.data_registro;
    if (resultado.resp_correcta && Array.isArray(registros)) {
      setMovimientos(registros);
      setMedioPagoSeleccionado(TODOS_LOS_MEDIOS);
    } else {
      setError(resultado.data?.message || resultado.data?.error || 'No se pudo cargar el informe.');
    }
    setCargando(false);
  }, [apiRequest]);

  useFocusEffect(
    useCallback(() => {
      cargarInforme(rangoSeleccionadoRef.current.desde, rangoSeleccionadoRef.current.hasta);
    }, [cargarInforme]),
  );

  const actualizarFecha = (tipo, fecha) => {
    if (!fecha) return;
    if (tipo === 'desde') setDesdeSeleccionado(fecha);
    else setHastaSeleccionado(fecha);
  };

  const abrirSelectorFecha = (tipo) => {
    const valorActual = tipo === 'desde' ? desdeSeleccionado : hastaSeleccionado;
    const limites = tipo === 'desde'
      ? { maximumDate: hastaSeleccionado }
      : { minimumDate: desdeSeleccionado };
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: valorActual,
        mode: 'date',
        ...limites,
        onChange: (evento, fecha) => {
          if (evento.type === 'set' && fecha) actualizarFecha(tipo, fecha);
        },
      });
      return;
    }
    setFechaActiva(tipo);
    setFechaTemporal(valorActual);
    setSelectorFechaVisible(true);
  };

  const cancelarSelectorFecha = () => {
    setSelectorFechaVisible(false);
    setFechaActiva(null);
  };

  const aplicarSelectorFecha = () => {
    actualizarFecha(fechaActiva, fechaTemporal);
    cancelarSelectorFecha();
  };

  const limitesSelectorFecha = fechaActiva === 'desde'
    ? { maximumDate: hastaSeleccionado }
    : { minimumDate: desdeSeleccionado };

  const renderSelectorFecha = (tipo, fecha) => {
    const etiqueta = tipo === 'desde' ? 'Desde' : 'Hasta';
    const minimo = tipo === 'hasta' ? formatoFechaISO(desdeSeleccionado) : undefined;
    const maximo = tipo === 'desde' ? formatoFechaISO(hastaSeleccionado) : undefined;
    if (Platform.OS === 'web') {
      return (
        <View key={tipo} style={[styles.selector, { backgroundColor: estilos.card, borderColor: estilos.borde }]}>
          <Text style={[styles.selectorLabel, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>{etiqueta}</Text>
          {React.createElement('input', {
            type: 'date',
            value: formatoFechaISO(fecha),
            min: minimo,
            max: maximo,
            'aria-label': `${etiqueta} del informe`,
            onChange: (evento) => {
              const valor = evento.target.value;
              if (!valor) return;
              const [anno, mes, dia] = valor.split('-').map(Number);
              actualizarFecha(tipo, new Date(anno, mes - 1, dia));
            },
            style: {
              boxSizing: 'border-box',
              width: '100%',
              padding: '4px 0',
              border: 0,
              outline: 'none',
              backgroundColor: 'transparent',
              color: estilos.texto,
              fontFamily: estilos.fuenteNegrita,
              fontSize: 12,
            },
          })}
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={tipo}
        accessibilityRole="button"
        accessibilityLabel={`Seleccionar fecha ${etiqueta.toLowerCase()} ${formatoFechaVisible(fecha)}`}
        onPress={() => abrirSelectorFecha(tipo)}
        style={[styles.selector, { backgroundColor: estilos.card, borderColor: estilos.borde }]}
      >
        <Text style={[styles.selectorLabel, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>{etiqueta}</Text>
        <Text style={[styles.selectorValor, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>{formatoFechaVisible(fecha)}  ▾</Text>
      </TouchableOpacity>
    );
  };

  const opcionesMedioPago = [...new Set(movimientos.flatMap(movimiento => {
    const medios = Array.isArray(movimiento.medios_pagos) ? movimiento.medios_pagos : [];
    return medios.length ? medios.map(obtenerNombreMedioPago) : [SIN_MEDIO_PAGO];
  }))].sort((a, b) => {
    if (a === SIN_MEDIO_PAGO) return 1;
    if (b === SIN_MEDIO_PAGO) return -1;
    return a.localeCompare(b, 'es');
  });
  const etiquetaMedioPago = (medio) => medio === SIN_MEDIO_PAGO ? 'Sin medio de pago' : medio;
  const movimientosFiltrados = movimientos.filter(movimiento => {
    if (medioPagoSeleccionado === TODOS_LOS_MEDIOS) return true;
    const medios = Array.isArray(movimiento.medios_pagos) ? movimiento.medios_pagos : [];
    if (medioPagoSeleccionado === SIN_MEDIO_PAGO) return medios.length === 0;
    return medios.some(medio => obtenerNombreMedioPago(medio) === medioPagoSeleccionado);
  });
  const totalFiltrado = movimientosFiltrados.reduce((total, movimiento) => {
    if (medioPagoSeleccionado === TODOS_LOS_MEDIOS) return total + (Number(movimiento.total_gasto) || 0);
    const medios = Array.isArray(movimiento.medios_pagos) ? movimiento.medios_pagos : [];
    if (medios.length === 0) return total + (Number(movimiento.total_gasto) || 0);
    return total + medios
      .filter(medio => medioPagoSeleccionado === TODOS_LOS_MEDIOS || obtenerNombreMedioPago(medio) === medioPagoSeleccionado)
      .reduce((subtotal, medio) => subtotal + obtenerMontoMedioPago(medio), 0);
  }, 0);

  if (cargando && movimientos.length === 0) return <Esperando titulo="Cargando informe" />;

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: estilos.fondo }} contentContainerStyle={styles.contenido}>
        <Text style={[styles.titulo, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>Informe de gastos</Text>
        <View style={styles.periodoBox}>
          {renderSelectorFecha('desde', desdeSeleccionado)}
          {renderSelectorFecha('hasta', hastaSeleccionado)}
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => cargarInforme(desdeSeleccionado, hastaSeleccionado)}
            style={[styles.botonCargar, { backgroundColor: estilos.boton, borderColor: estilos.borde }]}
          >
            <Text style={{ color: estilos.texto, fontFamily: estilos.fuenteNegrita }}>Ver</Text>
          </TouchableOpacity>
        </View>

      {error ? (
        <View style={[styles.mensajeError, { backgroundColor: estilos.card, borderColor: estilos.borde }]}>
          <Text style={{ color: estilos.texto, fontFamily: estilos.fuente }}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.filtroSeccion}>
        <Text style={[styles.etiquetaTotal, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>Medio de pago</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Filtrar gastos por medio de pago"
          onPress={() => setSelectorMedioPagoVisible(!selectorMedioPagoVisible)}
          style={[styles.selectorMedioPago, { backgroundColor: estilos.card, borderColor: estilos.borde }]}
        >
          <Text numberOfLines={1} style={[styles.selectorValor, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>
            {medioPagoSeleccionado === TODOS_LOS_MEDIOS ? 'Todos los medios' : etiquetaMedioPago(medioPagoSeleccionado)}
          </Text>
          <Text style={{ color: estilos.subtitulo }}>▾</Text>
        </TouchableOpacity>
        {selectorMedioPagoVisible && (
          <View style={[styles.opcionesMedioPago, { backgroundColor: estilos.card, borderColor: estilos.borde }]}>
            {[TODOS_LOS_MEDIOS, ...opcionesMedioPago].map(medio => (
              <TouchableOpacity
                key={medio}
                accessibilityRole="button"
                onPress={() => {
                  setMedioPagoSeleccionado(medio);
                  setSelectorMedioPagoVisible(false);
                }}
                style={[styles.opcionMedioPago, { borderBottomColor: estilos.borde }]}
              >
                <Text style={{ color: estilos.texto, fontFamily: medio === medioPagoSeleccionado ? estilos.fuenteNegrita : estilos.fuente }}>
                  {medio === TODOS_LOS_MEDIOS ? 'Todos los medios' : etiquetaMedioPago(medio)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.resumen, { backgroundColor: estilos.card, borderColor: estilos.borde }]}>
        <View style={styles.resumenTexto}>
          <Text style={[styles.etiquetaTotal, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>Gasto total</Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.numeroTotal, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>{formatoGs(totalFiltrado)}</Text>
        </View>
        <View style={[styles.resumenCantidad, { borderLeftColor: estilos.borde }]}>
          <Text style={[styles.etiquetaTotal, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>Registros</Text>
          <Text style={[styles.numeroTotal, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>{movimientosFiltrados.length}</Text>
        </View>
      </View>

      <View style={styles.seccion}>
        <Text style={[styles.tituloSeccion, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>Movimientos</Text>
        {movimientosFiltrados.length ? movimientosFiltrados.map((movimiento, indice) => {
          const medios = Array.isArray(movimiento.medios_pagos) ? movimiento.medios_pagos : [];
          const monto = medioPagoSeleccionado === TODOS_LOS_MEDIOS || medios.length === 0
            ? Number(movimiento.total_gasto) || 0
            : medios
              .filter(medio => obtenerNombreMedioPago(medio) === medioPagoSeleccionado)
              .reduce((total, medio) => total + obtenerMontoMedioPago(medio), 0);
          const nombreMedios = medios.length ? medios.map(obtenerNombreMedioPago).join(', ') : 'Sin medio de pago';
          return (
            <View key={`${movimiento.id ?? movimiento.numero_factura ?? 'movimiento'}-${indice}`} style={[styles.movimiento, { borderBottomColor: estilos.borde }]}>
              <View style={styles.filaEncabezado}>
                <Text numberOfLines={1} style={[styles.nombreDesglose, { color: estilos.texto, fontFamily: estilos.fuente }]}>
                  {movimiento.empresa?.nombre || 'Empresa sin nombre'}
                </Text>
                <Text style={[styles.valor, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>{formatoGs(monto)}</Text>
              </View>
              <Text style={[styles.detalle, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>
                {[movimiento.fecha_gasto, movimiento.categoria?.nombre, medioPagoSeleccionado === TODOS_LOS_MEDIOS ? nombreMedios : null].filter(Boolean).join('  ·  ')}
              </Text>
            </View>
          );
        }) : <Text style={[styles.vacio, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>No hay gastos para este período y medio de pago.</Text>}
      </View>
      </ScrollView>
      {Platform.OS === 'ios' && (
        <Modal
          transparent
          visible={selectorFechaVisible}
          animationType="fade"
          onRequestClose={cancelarSelectorFecha}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.dateModal, { backgroundColor: estilos.card, borderColor: estilos.borde }]}>
              <Text style={[styles.tituloSeccion, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>
                Seleccionar fecha {fechaActiva === 'desde' ? 'desde' : 'hasta'}
              </Text>
              <DateTimePicker
                value={fechaTemporal}
                mode="date"
                display="spinner"
                {...limitesSelectorFecha}
                onChange={(_, fecha) => {
                  if (fecha) setFechaTemporal(fecha);
                }}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity accessibilityRole="button" onPress={cancelarSelectorFecha} style={styles.modalButton}>
                  <Text style={{ color: estilos.subtitulo, fontFamily: estilos.fuente }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity accessibilityRole="button" onPress={aplicarSelectorFecha} style={styles.modalButton}>
                  <Text style={{ color: estilos.importante, fontFamily: estilos.fuenteNegrita }}>Aplicar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  contenido: { paddingHorizontal: 14, paddingTop: 16, paddingBottom: 24 },
  titulo: { fontSize: 23, marginBottom: 14 },
  periodoBox: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12 },
  selector: { flex: 1, minWidth: 0, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 },
  selectorLabel: { fontSize: 11 },
  selectorValor: { fontSize: 12, marginTop: 2 },
  filtroSeccion: { marginBottom: 14 },
  selectorMedioPago: { minHeight: 42, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  opcionesMedioPago: { borderWidth: 1, borderRadius: 8, marginTop: 6, overflow: 'hidden' },
  opcionMedioPago: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  resumen: { minHeight: 96, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 8 },
  resumenTexto: { flex: 1, minWidth: 0 },
  resumenCantidad: { minWidth: 78, borderLeftWidth: 1, paddingLeft: 14, marginLeft: 12 },
  movimiento: { paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth },
  botonCargar: { height: 47, minWidth: 54, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.4)' },
  dateModal: { borderWidth: 1, borderRadius: 8, padding: 14 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 18, marginTop: 8 },
  modalButton: { paddingHorizontal: 8, paddingVertical: 10 },
  etiquetaTotal: { fontSize: 12, marginBottom: 4 },
  numeroTotal: { fontSize: 20 },
  seccion: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#8a8fa8' },
  tituloSeccion: { fontSize: 16, marginBottom: 12 },
  filaEncabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 6 },
  nombreDesglose: { flex: 1, fontSize: 14 },
  valor: { fontSize: 14 },
  detalle: { fontSize: 11, marginTop: 5 },
  vacio: { fontSize: 13, paddingVertical: 4 },
  mensajeError: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
});