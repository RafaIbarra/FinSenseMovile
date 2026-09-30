import React, { useCallback, useContext, useRef, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { AuthContext } from '../../../AuthContext';
import { useApi } from '../../../Apis/useApi';
import Esperando from '../../Procesando/Espera';

const coloresGrafico = ['#3AB884', '#E05C5C', '#5B9CF6', '#E8B84B', '#9B59B6', '#38C9B0'];
const formatoGs = (valor) => `Gs. ${Number(valor || 0).toLocaleString('es-ES')}`;
const formatoFechaISO = (fecha) => `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
const formatoFechaVisible = (fecha) => `${String(fecha.getDate()).padStart(2, '0')}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()}`;

export default function InformeGastos() {
  const { colors, fonts } = useTheme();
  const { width: anchoVentana } = useWindowDimensions();
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
  const [informe, setInforme] = useState(null);
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
  const anchoGrafico = Math.max(anchoVentana - 40, 280);
  const configGrafico = {
    backgroundGradientFrom: estilos.fondo,
    backgroundGradientTo: estilos.fondo,
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    decimalPlaces: 0,
    color: () => estilos.importante,
    labelColor: () => estilos.subtitulo,
    barPercentage: 0.58,
    propsForBackgroundLines: { stroke: estilos.borde, strokeDasharray: '' },
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
    const resultado = await apiRequest(
      `gastos-listados/dashboard-usuario?desde=${desdeParametro}&hasta=${hastaParametro}`,
      'GET',
      {},
    );

    if (resultado.sessionExpired) {
      setCargando(false);
      return;
    }

    if (resultado.resp_correcta && resultado.data?.datos) {
      setInforme(resultado.data.datos);
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

  const categoriasOrdenadas = (informe?.por_categoria || [])
    .filter((categoria) => Number(categoria.total_gasto) > 0)
    .sort((a, b) => Number(b.total_gasto) - Number(a.total_gasto));
  const categoriasGrafico = categoriasOrdenadas.slice(0, 5).map((categoria, indice) => ({
    name: categoria.nombre || 'Sin nombre',
    population: Number(categoria.total_gasto) || 0,
    color: coloresGrafico[indice],
    legendFontColor: estilos.texto,
    legendFontSize: 12,
  }));
  if (categoriasOrdenadas.length > 5) {
    categoriasGrafico.push({
      name: 'Otros',
      population: categoriasOrdenadas.slice(5).reduce((total, categoria) => total + (Number(categoria.total_gasto) || 0), 0),
      color: coloresGrafico[5],
      legendFontColor: estilos.texto,
      legendFontSize: 12,
    });
  }
  const semanas = informe?.por_semana || [];
  const maximoSemanal = Math.max(...semanas.map((semana) => Number(semana.total_gasto) || 0), 0);
  const divisorSemanal = maximoSemanal >= 10000 ? 1000 : 1;

  const renderDesglose = (titulo, registros = []) => {
    const maximo = Math.max(...registros.map((registro) => Number(registro.total_gasto) || 0), 1);
    return (
      <View style={styles.seccion}>
        <Text style={[styles.tituloSeccion, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>{titulo}</Text>
        {registros.length ? registros.map((registro, indice) => {
          const total = Number(registro.total_gasto) || 0;
          return (
            <View key={`${registro.id ?? registro.nombre}-${indice}`} style={styles.filaDesglose}>
              <View style={styles.filaEncabezado}>
                <Text numberOfLines={1} style={[styles.nombreDesglose, { color: estilos.texto, fontFamily: estilos.fuente }]}>{registro.nombre || 'Sin nombre'}</Text>
                <Text style={[styles.valor, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>{formatoGs(total)}</Text>
              </View>
              <View style={[styles.barraFondo, { backgroundColor: estilos.fondo }]}>
                <View style={[styles.barra, { width: `${Math.max(total ? (total / maximo) * 100 : 0, 2)}%`, backgroundColor: estilos.importante }]} />
              </View>
              <Text style={[styles.detalle, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>
                {registro.cantidad_registros || 0} {registro.cantidad_registros === 1 ? 'registro' : 'registros'}
                {'  ·  '}IVA 10% {formatoGs(registro.iva_diez)}{'  ·  '}IVA 5% {formatoGs(registro.iva_cinco)}
              </Text>
            </View>
          );
        }) : <Text style={[styles.vacio, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>Sin datos para este período</Text>}
      </View>
    );
  };

  if (cargando && !informe) return <Esperando titulo="Cargando informe" />;

  const totales = informe?.totales || {};

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

      {informe && (
        <>
          <View style={styles.tarjetasTotales}>
            {[
              { titulo: 'Gasto total', valor: formatoGs(totales.total_gasto) },
              { titulo: 'Registros', valor: Number(totales.cantidad_registros || 0).toLocaleString('es-ES') },
              { titulo: 'IVA 10%', valor: formatoGs(totales.iva_diez) },
              { titulo: 'IVA 5%', valor: formatoGs(totales.iva_cinco) },
            ].map((item) => (
              <View key={item.titulo} style={[styles.tarjetaTotal, { backgroundColor: estilos.card, borderColor: estilos.borde }]}>
                <Text style={[styles.etiquetaTotal, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>{item.titulo}</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.numeroTotal, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>{item.valor}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.pendientes, { borderColor: estilos.borde }]}>
            <Text style={[styles.tituloSeccion, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>Imágenes pendientes de procesar</Text>
            <Text style={[styles.valor, { color: estilos.importante, fontFamily: estilos.fuenteNegrita }]}>{Number(informe.imagenes_pendientes_no_procesadas || 0).toLocaleString('es-ES')}</Text>
          </View>

          <View style={styles.seccion}>
            <Text style={[styles.tituloSeccion, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>Gastos por semana</Text>
            {semanas.length && maximoSemanal > 0 ? (
              <>
                <Text style={[styles.detalle, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>Montos en {divisorSemanal === 1000 ? 'miles de Gs.' : 'Gs.'}</Text>
                <BarChart
                  data={{
                    labels: semanas.map((semana) => semana.desde_fecha?.slice(0, 5) || ''),
                    datasets: [{ data: semanas.map((semana) => (Number(semana.total_gasto) || 0) / divisorSemanal) }],
                  }}
                  width={anchoGrafico}
                  height={210}
                  yAxisLabel=""
                  yAxisSuffix={divisorSemanal === 1000 ? 'k' : ''}
                  chartConfig={configGrafico}
                  fromZero
                  withInnerLines={false}
                  showValuesOnTopOfBars={false}
                  style={styles.grafico}
                />
              </>
            ) : <Text style={[styles.vacio, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>Sin gastos para comparar en este período</Text>}
          </View>

          <View style={styles.seccion}>
            <Text style={[styles.tituloSeccion, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>Distribución por categoría</Text>
            {categoriasGrafico.length ? (
              <PieChart
                data={categoriasGrafico}
                width={anchoGrafico}
                height={205}
                chartConfig={configGrafico}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="8"
                hasLegend
                style={styles.grafico}
              />
            ) : <Text style={[styles.vacio, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>Sin gastos por categoría en este período</Text>}
          </View>

          {renderDesglose('Por empresa', informe.por_empresa)}
          {renderDesglose('Por categoría', informe.por_categoria)}
          {renderDesglose('Por etiqueta', informe.por_etiqueta)}

          <View style={styles.seccion}>
            <Text style={[styles.tituloSeccion, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>Por semana</Text>
            {(informe.por_semana || []).length ? informe.por_semana.map((semana, indice) => {
              const total = Number(semana.total_gasto) || 0;
              const semanas = informe.por_semana || [];
              const maximo = Math.max(...semanas.map((item) => Number(item.total_gasto) || 0), 1);
              return (
                <View key={`${semana.desde_fecha}-${indice}`} style={styles.filaDesglose}>
                  <View style={styles.filaEncabezado}>
                    <Text style={[styles.nombreDesglose, { color: estilos.texto, fontFamily: estilos.fuente }]}>{semana.desde_fecha} - {semana.hasta_fecha}</Text>
                    <Text style={[styles.valor, { color: estilos.texto, fontFamily: estilos.fuenteNegrita }]}>{formatoGs(total)}</Text>
                  </View>
                  <View style={[styles.barraFondo, { backgroundColor: estilos.fondo }]}>
                    <View style={[styles.barra, { width: `${Math.max(total ? (total / maximo) * 100 : 0, 2)}%`, backgroundColor: estilos.importante }]} />
                  </View>
                  <Text style={[styles.detalle, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>
                    {semana.cantidad_registros || 0} registros  ·  IVA 10% {formatoGs(semana.iva_diez)}  ·  IVA 5% {formatoGs(semana.iva_cinco)}
                  </Text>
                </View>
              );
            }) : <Text style={[styles.vacio, { color: estilos.subtitulo, fontFamily: estilos.fuente }]}>Sin datos para este período</Text>}
          </View>
        </>
      )}
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
  botonCargar: { height: 47, minWidth: 54, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.4)' },
  dateModal: { borderWidth: 1, borderRadius: 8, padding: 14 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 18, marginTop: 8 },
  modalButton: { paddingHorizontal: 8, paddingVertical: 10 },
  tarjetasTotales: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tarjetaTotal: { width: '48%', flexGrow: 1, minHeight: 72, justifyContent: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  etiquetaTotal: { fontSize: 12, marginBottom: 4 },
  numeroTotal: { fontSize: 17 },
  pendientes: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, paddingVertical: 12, marginBottom: 12 },
  seccion: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#8a8fa8' },
  tituloSeccion: { fontSize: 16, marginBottom: 12 },
  grafico: { alignSelf: 'center', marginTop: 4 },
  filaDesglose: { marginBottom: 14 },
  filaEncabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 6 },
  nombreDesglose: { flex: 1, fontSize: 14 },
  valor: { fontSize: 14 },
  barraFondo: { height: 7, borderRadius: 5, overflow: 'hidden' },
  barra: { height: '100%', borderRadius: 5 },
  detalle: { fontSize: 11, marginTop: 5 },
  vacio: { fontSize: 13, paddingVertical: 4 },
  mensajeError: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
});