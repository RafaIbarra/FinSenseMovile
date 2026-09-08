import React, { createContext, useState, useMemo, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [activarsesion, setActivarsesion] = useState(false);
  const [versionsys, setVersionsys] = useState('1.0');
  const [sesiondata, setSesiondata] = useState();
  const [sesiondatadate, setSesiondatadate] = useState();
  const [periodo, setPeriodo] = useState(false);
  const [recorrido,setRecorrido]=useState(false)
  const [datarecorrido,setDatarecorrido]=useState([])

  const [estadocomponente, setEstadocomponente] = useState({
    datositem: [],
    obtuvopermiso: false,
    isHeaderVisible: true,
    bandera_registro_gasto: false,
    bandera_registro_ingreso: false,
    bandera_registro_categoria: false,
    bandera_registro_medio_pago: false,
    bandera_registro_concepto_ingreso: false,
    bandera_registro_concepto_gasto: false,
    loading: false,
    tituloloading: 'CARGANDO..',
    isKeyboardVisible: false,
    TipoCambiopass: 0,
    alerta_estado: false,
    alerta_componente: [],
    alerto_tipo: '',
    alerta_mensaje: '',
    ComponenteActivoBottonTab: '',
    componente_plus_basic: false,


    recarga_conceptos_gastos:true,
    recarga_conceptos_categorias:true,
    recarga_conceptos_medios:true,
    recarga_conceptos_ingresos:true,

    recarga_movimientos_gastos:true,
    recarga_movimientos_ingresos:true,
    recarga_resumen_mes:true,
    recarga_estadisticas_mes:true,

  });

  // 🔑 useCallback evita que las funciones se recreen en cada render
  const actualizarEstadocomponente = useCallback((campo, valor) => {
    setEstadocomponente(prevState => ({
      ...prevState,
      [campo]: valor,
    }));
  }, []); // sin dependencias, nunca se recrea
  const actualizacion_registro_movimiento_gasto = useCallback(() => {
    setEstadocomponente(prevState => ({
      ...prevState,
      recarga_movimientos_gastos: true,
      recarga_resumen_mes: true,
      recarga_estadisticas_mes:true,
      recarga_conceptos_gastos: true,
      recarga_conceptos_categorias:true,
      recarga_conceptos_medios:true,
      
    }));
  }, []); // 🔑 un solo setEstadocomponente en lugar de múltiples actualizarEstadocomponente

  const actualizacion_registro_movimiento_ingreso = useCallback(() => {
    setEstadocomponente(prevState => ({
      ...prevState,
      recarga_movimientos_ingresos: true,
      recarga_resumen_mes: true,
      recarga_estadisticas_mes:true,
      recarga_conceptos_ingresos:true,
    }));
  }, []); // 🔑 un solo setEstadocomponente en lugar de múltiples actualizarEstadocomponente


  const reiniciarvalores = useCallback(() => {
    setEstadocomponente(prevState => ({
      ...prevState,
      diasmarcados: [],
      obtuvopermiso: false,
      isHeaderVisible: true,
      loading: false,
      tituloloading: '',
      compresumen: true,
      IdDiaSeleccion: 0,
      comphome: true,
      datahome: [],
      recarga_conceptos_gastos:true,
      recarga_conceptos_categorias:true,
      recarga_conceptos_medios:true,
      recarga_conceptos_ingresos:true,

      recarga_movimientos_gastos:true,
      recarga_movimientos_ingresos:true,
      recarga_resumen_mes:true,
      recarga_estadisticas_mes:true,
    }));
  }, []); // 🔑 un solo setEstadocomponente en lugar de múltiples actualizarEstadocomponente

  const recargar_componentes = useCallback(() => {
    setEstadocomponente(prevState => ({
      ...prevState,
      compresumen: true,
      comphome: true,
      datahome: [],
    }));
  }, []);

  const asignar_opciones_alerta = useCallback((error, titulo, mensaje, grupo_destino, destino, estado_actualizar, valor_estado) => {
    const body_alerta = {
      is_error: error,
      titulo,
      mensaje,
      nav_grupo: grupo_destino,
      nav_destino: destino,
      estado_actualizar,
      valor_estado,
    };
    setEstadocomponente(prevState => ({
      ...prevState,
      alerta_componente: body_alerta,
    }));
  }, []);

  // 🔑 useMemo evita que el objeto value se recree en cada render
  const contextValue = useMemo(() => ({
    activarsesion, setActivarsesion,
    recorrido,setRecorrido,
    datarecorrido,setDatarecorrido,
    versionsys, setVersionsys,
    sesiondata, setSesiondata,
    estadocomponente, actualizarEstadocomponente,
    reiniciarvalores,
    recargar_componentes,
    periodo, setPeriodo,
    sesiondatadate, setSesiondatadate,
    asignar_opciones_alerta,
    actualizacion_registro_movimiento_gasto,
    actualizacion_registro_movimiento_ingreso
  }), [
    activarsesion,
    recorrido,
    versionsys,
    sesiondata,
    estadocomponente,
    actualizarEstadocomponente,
    reiniciarvalores,
    recargar_componentes,
    periodo,
    sesiondatadate,
    asignar_opciones_alerta,
    actualizacion_registro_movimiento_gasto,
    actualizacion_registro_movimiento_ingreso
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};