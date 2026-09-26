import React, { useState, useEffect, useContext, useMemo,useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Surface } from 'react-native-paper';

import { useNavigation,useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../../AuthContext";
import { useTheme } from '@react-navigation/native';
import Esperando from "../../Procesando/Espera";
import Notificacion from "../../Notificacion/Notificacion";
import Empty from "../../Empty/Empty";
import CabeceraListados from "../../CabeceraListados/CabeceraListados";
import LogoEmpresa from "../../LogoEmpresa/LogoEmpresa";
import { useApi } from "../../../Apis/useApi";

export default function ListadoMovimientosGastos({ navigation }) {
  const { colors, fonts } = useTheme();
  const { navigate } = useNavigation();
  const { sesiondatadate } = useContext(AuthContext);

  const [dataegresos, setDataegresos] = useState([]);
  const [dataegresosresult, setDataegresosresult] = useState([]);
  const [dataresumen, setDataresumen] = useState([]);

  const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);
  const [busquedaVisible,setBusquedaVisible]=useState(false)
  const { activarsesion, setActivarsesion } = useContext(AuthContext);
  const { reiniciarvalores } = useContext(AuthContext);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState('');
  const fechaActual = new Date();
  const [annoSeleccionado, setAnnoSeleccionado] = useState(String(fechaActual.getFullYear()));
  const [mesSeleccionado, setMesSeleccionado] = useState(String(fechaActual.getMonth() + 1));
  const [selectorPeriodo, setSelectorPeriodo] = useState(null);
  const [titulo,setTitulo]=useState('Movimientos gastos')
  const[estadonotificacion,setEstadonotificacion]=useState(false)
  const [bodynotificacion,setBodynotificacion]=useState({mensaje:'',
                                                          titulo:'',
                                                          is_error:false,
                                                          estado_actualizar:'bandera_registro_gasto',
                                                          valor_estado:'',
                                                          navnivel1:'Home',
                                                          navnivel2:'MovGastosStackGroup',
                                                          navnivel3:'ListadoMovimientosGastos',
                                                        })
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

  const mostrarError = (mensaje) => {
    setReady(true);
    setBodynotificacion(prev => ({
      ...prev,
      titulo: 'MOVIMIENTOS GASTOS',
      mensaje,
      is_error: true,
      valor_estado: '',
    }));
    setEstadonotificacion(true);
  };

 const cargardatos = async (anno = annoSeleccionado, mes = mesSeleccionado) => {
  const annoNumero = Number(anno);
  const mesNumero = Number(mes);
  if (!Number.isInteger(annoNumero) || annoNumero < 2000 || annoNumero > 2100) {
    mostrarError('Ingrese un año válido');
    return;
  }
  if (!Number.isInteger(mesNumero) || mesNumero < 1 || mesNumero > 12) {
    mostrarError('Ingrese un mes válido entre 1 y 12');
    return;
  }

  setReady(false);
  const endpoint = `gastos-listados/movimientos-usuario?anno=${annoNumero}&mes=${mesNumero}`;

  const result = await apiRequest(endpoint, 'GET', {});
  

  if (result.sessionExpired) return;

  if (result.resp_correcta) {
    // ← AQUÍ: data es un array directo, no tiene .detalle
    
    const registros = Array.isArray(result.data.data_registro) ? result.data.data_registro : [];

    if (registros.length > 0) {
      registros.forEach((elemento) => {
        elemento.key = elemento.id?.toString(); // ← id en minúscula
        elemento.recarga = 'no';
      });
    }
    
    setDataegresos(registros);
    setDataegresosresult(registros);

    // ← Si tu backend no envía resumen, calculalo o dejalo vacío
    const resumenCalculado = [{
      TotalGastos: registros.reduce((sum, r) => sum + (Number(r.total_gasto) || 0), 0),
      CantidadGastos: registros.length
    }];
    setDataresumen(resumenCalculado);

    setReady(true);
  } else {
    const msj = result.data?.message || 'Error en la solicitud';
    setReady(true);
    setBodynotificacion(prev => ({
      ...prev,
      titulo: 'MOVIMIENTOS GASTOS',
      mensaje: msj,
      is_error: true,
      valor_estado: ''
    }));
    setEstadonotificacion(true);
  }
  actualizarEstadocomponente('recarga_movimientos_gastos', false);
  };

  const cambiarPeriodo = () => {
    setQuery('');
    cargardatos();
  };

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const annosDisponibles = Array.from({ length: 7 }, (_, indice) => fechaActual.getFullYear() - 5 + indice);



  const onOk=()=>{
    setEstadonotificacion(false)
  }
  const activar_busqueda=()=>{
    setBusquedaVisible(true)
  }
  const desactivar_busqueda=()=>{
    buscarEgresos('')
    setBusquedaVisible(false)
  }


  useFocusEffect(
        useCallback(() => {
          
          if (estadocomponente.recarga_movimientos_gastos) {
            
            cargardatos();
          } else {
            setReady(true);
            
            
          }
        }, [estadocomponente.recarga_movimientos_gastos])
    );

  const buscarEgresos = (texto) => {
    setQuery(texto);
    if (!texto.trim()) {
      setDataegresosresult(dataegresos);
      return;
    }
    const termino = texto.toLowerCase().trim();
    const filtrados = dataegresos.filter((item) => {
      const empresa = item.empresa?.nombre || '';
      const fechaGasto = item.fecha_gasto || '';
      const fechaRegistro = item.fecha_registro || '';
      const numeroFactura = item.numero_factura || '';
      return [empresa, fechaGasto, fechaRegistro, numeroFactura]
        .some((valor) => String(valor).toLowerCase().includes(termino));
    });
    setDataegresosresult(filtrados);
  };

  // ── Totales dinámicos de la búsqueda activa ──
  const totalFiltrado = useMemo(() => {
    return dataegresosresult.reduce((sum, item) => sum + (Number(item.total_gasto) || 0), 0);
  }, [dataegresosresult]);

  const hayBusqueda = query.trim().length > 0;

  if (!ready) return <Esperando titulo={titulo}/>;

  return (
    <View style={{ flex: 1, backgroundColor: colors.screen_componente_estilos.color_fondo }}>
      {estadonotificacion && <Notificacion navigation={navigation} bodynotificacion={bodynotificacion} onOk={onOk} />}

      
      <CabeceraListados
          titulo="Movimientos Gastos"
          data_resumen={{
            titulo_total: 'Total Gastos',
            totalGeneral: dataresumen[0]?.TotalGastos,
            titulo_cantidad: 'Cant Registros',
            cantidadRegistros: dataresumen[0]?.CantidadGastos
          }}
          destinoNavegacion="RegistroMovimientoGasto"
          parametroNavegacion={{ IdMovGasto: 0 }}
          busquedaActiva={busquedaVisible}
          activar_busqueda={activar_busqueda}
          desactivar_busqueda={desactivar_busqueda}  
        />

      <View style={styles.periodoBox}>
        <Text style={[styles.periodoLabel, { fontFamily: estilos.font_normal, color: estilos.font_sub_color }]}>Período</Text>
        <TouchableOpacity
          onPress={() => setSelectorPeriodo(selectorPeriodo === 'anno' ? null : 'anno')}
          style={[styles.periodoSelect, { backgroundColor: estilos.cards_color_fondo, borderColor: estilos.cards_color_border }]}
        >
          <Text style={{ fontFamily: estilos.font_normal, color: estilos.font_color }}>{annoSeleccionado}</Text>
          <Text style={{ color: estilos.font_sub_color }}>▾</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectorPeriodo(selectorPeriodo === 'mes' ? null : 'mes')}
          style={[styles.periodoSelect, styles.mesSelect, { backgroundColor: estilos.cards_color_fondo, borderColor: estilos.cards_color_border }]}
        >
          <Text style={{ fontFamily: estilos.font_normal, color: estilos.font_color }}>{nombresMeses[Number(mesSeleccionado) - 1]}</Text>
          <Text style={{ color: estilos.font_sub_color }}>▾</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={cambiarPeriodo}
          style={[styles.periodoButton, { backgroundColor: estilos.boton_color_fondo, borderColor: estilos.boton_color_borde }]}
        >
          <Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_importe_color }}>CARGAR</Text>
        </TouchableOpacity>
      </View>

      {selectorPeriodo && (
        <View style={[styles.opcionesPeriodo, { backgroundColor: estilos.cards_color_fondo, borderColor: estilos.cards_color_border }]}> 
          <Text style={[styles.opcionesTitulo, { fontFamily: estilos.font_negrita, color: estilos.font_color }]}>Seleccionar {selectorPeriodo === 'anno' ? 'año' : 'mes'}</Text>
          <View style={styles.opcionesWrap}>
            {(selectorPeriodo === 'anno' ? annosDisponibles : nombresMeses.map((nombre, indice) => ({ nombre, valor: indice + 1 }))).map((opcion) => {
              const valor = selectorPeriodo === 'anno' ? opcion : opcion.valor;
              const etiqueta = selectorPeriodo === 'anno' ? String(opcion) : opcion.nombre;
              const seleccionado = (selectorPeriodo === 'anno' ? annoSeleccionado : mesSeleccionado) === String(valor);
              return (
                <TouchableOpacity
                  key={String(valor)}
                  onPress={() => {
                    selectorPeriodo === 'anno' ? setAnnoSeleccionado(String(valor)) : setMesSeleccionado(String(valor));
                    setSelectorPeriodo(null);
                  }}
                  style={[styles.opcionPeriodo, seleccionado && { backgroundColor: estilos.boton_color_fondo }]}
                >
                  <Text style={{ fontFamily: estilos.font_normal, color: estilos.font_color }}>{etiqueta}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* ═══ BUSCADOR ═══ */}
      {
        busquedaVisible && (

        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.screen_componente_estilos.color_fondo_cards,
              borderColor: colors.screen_componente_estilos.color_borde_cards,
            },
          ]}
        >
          <Text style={{ marginRight: 6, color: estilos.font_sub_color }}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={buscarEgresos}
            placeholder="Buscar por empresa o fecha..."
            underlineColorAndroid="transparent"
            placeholderTextColor={estilos.font_sub_color}
            style={{
              fontFamily: estilos.font_normal,
              color: estilos.font_color,
              flex: 1,
              paddingVertical: 2,
              height: '70%',
              paddingLeft: 5,
            }}
          />
          {hayBusqueda && (
            <TouchableOpacity onPress={() => buscarEgresos('')} style={{ padding: 4 }}>
              <Text style={{ color: estilos.font_sub_color, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        )
      }

      {/* ═══ INDICADOR DE RESULTADOS DE BÚSQUEDA ═══ */}
      {hayBusqueda && (
        <View style={styles.resultadoBusqueda}>
          <Text style={{ fontFamily: estilos.font_normal, color: estilos.font_sub_color, fontSize: 12 }}>
            {dataegresosresult.length} resultado{dataegresosresult.length !== 1 ? 's' : ''} · Total filtrado:{' '}
            <Text style={{ fontFamily: estilos.font_negrita, color: estilos.font_importe_color }}>
              Gs. {totalFiltrado.toLocaleString('es-ES')}
            </Text>
          </Text>
        </View>
      )}

      {/* ═══ LISTA ═══ */}

      {dataegresosresult.length>0? (

        <FlatList
          data={dataegresosresult}
          contentContainerStyle={styles.flatlistContenido}
          style={{ flex: 1 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.contenedordatos, {
                backgroundColor: colors.screen_componente_estilos.color_fondo_cards,
                borderRightColor: colors.screen_componente_estilos.color_borde_cards,
                borderBottomColor: colors.screen_componente_estilos.color_borde_cards,
              }]}
              onPress={() => navigate('DetalleMovimientoGasto', { item })}
              activeOpacity={0.85}
            >
              <View style={styles.columnaLogo}>
                <LogoEmpresa imagePath={item.empresa?.url_logo} /> 
              </View>
              <View style={styles.columnaInfo}>
                <Text style={[styles.nombreEmpresa, { fontFamily: fonts.balsamiqregular.fontFamily, color: colors.screen_componente_estilos.color_texto }]}>
                  {item.empresa?.nombre || item.tipo_registro}
                </Text>
                <Text style={[styles.fechaRegistro, { fontFamily: fonts.balsamiqregular.fontFamily, color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
                  {item.fecha_registro}
                </Text>
                <Text style={[styles.idRegistro, { fontFamily: fonts.balsamiqregular.fontFamily, color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
                  ID: {item.id}
                </Text>
              </View>
              <View style={styles.columnaTotal}>
                <Text style={[styles.totalMovimiento, { fontFamily: fonts.balsamiqbold.fontFamily, color: colors.screen_componente_estilos.color_texto }]}>
                  Gs. {Number(item.total_gasto).toLocaleString('es-ES')}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.key}
        />
      ):(
        <Empty />
      )
      }


    </View>
  );
}

const styles = StyleSheet.create({
  // ═══ RESUMEN COMPACTO ═══
  card: {
        marginBottom: 15,
    },
  resumenBarra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(224, 92, 92, 0.08)', // tinte muy suave del color gasto
    borderRadius: 10,
  },
  resumenItem: {
    alignItems: 'center',
    flex: 1,
  },
  resumenSeparador: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  resumenLabelBarra: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  resumenMontoBarra: {
    fontSize: 15,
  },

  // ═══ BUSCADOR ═══
  periodoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 8,
    gap: 8,
  },
  periodoLabel: {
    fontSize: 12,
  },
  periodoInput: {
    width: 78,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  mesInput: {
    width: 54,
  },
  periodoSelect: {
    minWidth: 92,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  mesSelect: {
    minWidth: 116,
  },
  opcionesPeriodo: {
    marginHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  opcionesTitulo: {
    fontSize: 13,
    marginBottom: 8,
  },
  opcionesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opcionPeriodo: {
    minWidth: 70,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  periodoButton: {
    height: 36,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 6,
    paddingHorizontal: 12,
    height: 38,
    marginLeft: 12,
    marginRight: 12,
  },

  // ═══ RESULTADO BÚSQUEDA ═══
  resultadoBusqueda: {
    marginHorizontal: 16,
    marginBottom: 6,
    paddingHorizontal: 4,
  },

  // ═══ LISTA ═══
  contenedordatos: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginBottom: 8,
    borderRadius: 10,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 1,
  },
  flatlistContenido: {
    paddingBottom: 16,
    paddingTop: 4,
  },
  columnaLogo: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  columnaInfo: {
    flex: 2,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  columnaTotal: {
    flex: 1.5,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  nombreEmpresa: {
    fontSize: 12,
    marginBottom: 4,
  },
  fechaRegistro: {
    fontSize: 11,
  },
  idRegistro: {
    fontSize: 9,
  },
  totalMovimiento: {
    fontSize: 13,
    textAlign: 'right',
  },
});