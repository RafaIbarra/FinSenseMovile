import React, { useState, useEffect,useContext } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, ActivityIndicator, StatusBar 
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "@react-navigation/native";

import { useApi } from "../../../Apis/useApi";
import { AuthContext } from "../../../AuthContext";


import LogoEmpresa from "../../LogoEmpresa/LogoEmpresa";

import CabaceraRegistros from "../../CabeceraRegistros/CabaceraRegistros";
import Confirmacion from "../../Procesando/Confirmacion";
import Esperando from "../../Procesando/Espera";
import Notificacion from "../../Notificacion/Notificacion";

import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';



export default function DetalleMovimientoGasto({ navigation }) {
  const { colors, fonts } = useTheme();
  const { actualizacion_registro_movimiento_gasto } = useContext(AuthContext);
  const { estadocomponente, actualizarEstadocomponente } = useContext(AuthContext);
  
  const { activarsesion, setActivarsesion } = useContext(AuthContext);
  const { reiniciarvalores } = useContext(AuthContext);
  const [datositem, setDatositem] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [CompsCabecera,setCompsCabecera]=useState([])

  const [showconfirmacion,setShowconfirmacion]=useState(false)
  const [mensajeconfirmacion,setMensajeconfirmacion]=useState(false)
  const [confirmaciondelete,setConfirmaciondelete]=useState(false)
  const [tituloespera, setTituloespera] = useState('');
  const [ready, setReady] = useState(false);
  const[estadonotificacion,setEstadonotificacion]=useState(false)
 
  const [bodynotificacion,setBodynotificacion]=useState({mensaje:'',
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


  

  const apiRequest = useApi({ setActivarsesion, reiniciarvalores, actualizarEstadocomponente });

  const { params: { item } } = useRoute();

  const handleEdit = () => {
    
    const IdMovGasto=item.id
    
    navigation.navigate('RegistroMovimientoGasto',{IdMovGasto});
    
  };
  
  const handleyes=()=>{
    setShowconfirmacion(false)
    setConfirmaciondelete(true)
  }
  const handleno=()=>{
    setShowconfirmacion(false)
    setConfirmaciondelete(false)
  }
  const handleDelete = () => {
    const id_del= datositem.id
    setMensajeconfirmacion(`Desea eliminar el movimiento con ID ${id_del}?`)
    setShowconfirmacion(true)
    
  };
  const onOk=()=>{
    setEstadonotificacion(false)
  }
  const eliminar_registro =async()=>{
    const id_del= datositem.id
    setReady(false)
    setTituloespera("Eliminando Movimiento..")
    
    const endpoint = `gastos/${id_del}/` 
    const metodo = 'DELETE'
    const result = await apiRequest(endpoint, metodo, {});

    console.log("result DELETE=> ", result)

    if (result.sessionExpired) {
        return; // Salimos de la función
      }
    if (result.resp_correcta) {
        setReady(true);
        const nuevo = !estadocomponente.bandera_registro_gasto;
        const mensajeExito =  'Movimiento Gasto Eliminado';
        
        setBodynotificacion(prevState => ({
          ...prevState,
          titulo:'MOVIMIENTO GASTO',
          mensaje: mensajeExito,
          is_error: false,
          valor_estado:nuevo
        }));
        setEstadonotificacion(true)
        
      } else {
        const msj = result.data?.message || 'Error en la solicitud';
        setReady(true);
        setBodynotificacion(prevState => ({
          ...prevState,
          titulo:'MOVIMIENTO GASTO',
          mensaje: msj,
          is_error: true,
          valor_estado:''
        }));
        setEstadonotificacion(true)
      }
    

  }
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setReady(true);
      setDatositem(item);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
        if(confirmaciondelete){
          eliminar_registro();
        }
          
  }, [confirmaciondelete]);
  const tieneComprobante = Array.isArray(datositem.imagenes) && datositem.imagenes.length > 0;

  if (!ready) return <Esperando titulo={tituloespera}/>;

  return (
    <View style={{ flex: 1, backgroundColor: colors.screen_componente_estilos.color_fondo}}>
      {estadonotificacion && <Notificacion navigation={navigation} bodynotificacion={bodynotificacion} onOk={onOk} />}

      {showconfirmacion &&
          <Confirmacion
            title="Detalle del Gasto"
            question={mensajeconfirmacion}
            navigation={navigation}
            onYes={handleyes}
            onNo={handleno}
            
            
          />
      }
      <CabaceraRegistros
        title={`Detalle del Gasto`}
        navigation={navigation}
        onDelete={handleDelete}
        onEdit={handleEdit}
        showbottons={true}
        
      />
      
      
      <ScrollView style={styles.scroll} bounces={false}>

        
        <View style={[styles.hero,{backgroundColor:colors.screen_componente_estilos.color_fondo_cards,borderBottomWidth: 0.5}]}>
          
          <View style={[styles.heroTop]}>
            <View style={styles.logoWrap}>
              <LogoEmpresa imagePath={datositem.empresa?.url_logo} />
            </View>
            <View style={{ flex: 1, paddingLeft: 12 }}>
              <Text style={[styles.nombreEmpresa, { fontFamily: fonts.balsamiqbold.fontFamily,color: colors.screen_componente_estilos.color_texto }]}>
                {datositem.empresa?.nombre}
              </Text>
              <Text style={[styles.fechaRegistro, { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
                Reg. {datositem.fecha_registro}
              </Text>
              {!!datositem.numero_factura && (
                <Text style={[styles.numeroFactura, { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
                  N° Factura: {datositem.numero_factura}
                </Text>
              )}
            </View>
          </View>

          
          <View style={[styles.heroTotal,
                {borderBottomWidth: 2,borderBottomColor:colors.screen_componente_estilos.color_fondo,
                  borderTopWidth:2,borderTopColor:colors.screen_componente_estilos.color_fondo

                }
                ]}>
            <Text style={[styles.heroTotalLabel, 
              { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo,marginTop:5 }]}>
              TOTAL GASTO
            </Text>
            <Text style={[styles.heroTotalAmount, { fontFamily: fonts.balsamiqbold.fontFamily,color: colors.screen_componente_estilos.color_texto_importante }]}>
              Gs. {Number(datositem.total_gasto).toLocaleString("es-ES")}
            </Text>
            <Text style={[styles.heroFechaGasto, 
              { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
              Gasto realizado el {datositem.fecha_gasto}
            </Text>

            
            <View style={styles.ivaRow}>
              <View style={styles.ivaItem}>
                <Text style={[styles.ivaLabel, { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
                  IVA 10%
                </Text>
                <Text style={[styles.ivaValue, { fontFamily: fonts.balsamiqbold.fontFamily,color: colors.screen_componente_estilos.color_texto }]}>
                  Gs. {Number(datositem.iva_diez || 0).toLocaleString("es-ES")}
                </Text>
              </View>
              <View style={[styles.ivaSeparador,{backgroundColor:colors.screen_componente_estilos.color_borde_cards}]} />
              <View style={styles.ivaItem}>
                <Text style={[styles.ivaLabel, { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
                  IVA 5%
                </Text>
                <Text style={[styles.ivaValue, { fontFamily: fonts.balsamiqbold.fontFamily,color: colors.screen_componente_estilos.color_texto }]}>
                  Gs. {Number(datositem.iva_cinco || 0).toLocaleString("es-ES")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        
        <View style={[styles.cardsContainer]}>

          
          {datositem.etiquetas?.length > 0 && (
            <View style={[styles.card,{backgroundColor:colors.screen_componente_estilos.color_fondo_cards}]}>
              <Text style={[styles.cardTitle, { fontFamily: fonts.balsamiqbold.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
                ETIQUETAS
              </Text>
              <View style={styles.chipsWrap}>
                {datositem.etiquetas.map((etiqueta) => (
                  <View
                    key={etiqueta.idetiqueta}
                    style={[styles.chip,
                      {backgroundColor:colors.screen_componente_estilos.color_fondo,
                       borderColor:colors.screen_componente_estilos.color_borde_cards}]}
                  >
                    <Text style={[styles.chipText, { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto }]}>
                      {etiqueta.nombre}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          
          {datositem.conceptos?.length > 0 && (
            <View style={[styles.card,{backgroundColor:colors.screen_componente_estilos.color_fondo_cards}]}>
              <Text style={[styles.cardTitle, { fontFamily: fonts.balsamiqbold.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
                CONCEPTOS
              </Text>

              <View style={[styles.tablaHeader,{borderBottomColor:colors.screen_componente_estilos.color_borde_cards}]}>
                <Text style={[styles.tablaHeaderCelda, styles.colConcepto, { fontFamily: fonts.balsamiqbold.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
                  Concepto
                </Text>
                <Text style={[styles.tablaHeaderCelda, styles.colEtiqueta, { fontFamily: fonts.balsamiqbold.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
                  Etiqueta
                </Text>
              </View>

              {datositem.conceptos.map((concepto, idx) => (
                <View
                  key={concepto.idconcepto}
                  style={[styles.tablaFila, idx > 0 && styles.tablaFilaBorder, {borderTopColor:colors.screen_componente_estilos.color_borde_cards}]}
                >
                  <Text style={[styles.tablaCelda, styles.colConcepto, { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto }]}>
                    {concepto.nombre}
                  </Text>
                  <Text style={[styles.tablaCelda, styles.colEtiqueta, { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
                    {concepto.etiqueta?.nombre}
                  </Text>
                </View>
              ))}
            </View>
          )}

          
          {tieneComprobante && (
            <TouchableOpacity style={[styles.comprobanteBtn,
            {backgroundColor:colors.screen_componente_estilos.color_fondo_botones,
            borderColor:colors.screen_componente_estilos.color_borde_botones
            }]
            } onPress={() => { setModalVisible(true); setImageLoading(true); }}>
              <Text style={[styles.comprobanteBtnText, 
                { fontFamily: fonts.balsamiqregular.fontFamily,
                color:colors.screen_componente_estilos.color_texto_importante 
                }]}>
                📎 Ver comprobante adjunto
              </Text>
            </TouchableOpacity>
          )}

          
          <View style={[styles.card,{backgroundColor:colors.screen_componente_estilos.color_fondo_cards}]}>
            <Text style={[styles.cardTitle, { fontFamily: fonts.balsamiqbold.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
              INFORMACIÓN EXTRA
            </Text>
            <View style={styles.cardRow}>
              <Text style={[styles.cardRowLabel, { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
                Tipo de registro
              </Text>
              <Text style={[styles.cardRowAmount, { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto }]}>
                {datositem.tipo_registro}
              </Text>
            </View>
            <View style={[styles.cardRow, styles.cardRowBorder]}>
              <Text style={[styles.cardRowLabel, { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
                Modelo extracción
              </Text>
              <Text style={[styles.cardRowAmount, { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto }]}>
                {datositem.modelo_extraccion_datos}
              </Text>
            </View>
            <View style={[styles.cardRow, styles.cardRowBorder]}>
              <Text style={[styles.cardRowLabel, { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto_subtitulo }]}>
                Modelo clasificador
              </Text>
              <Text style={[styles.cardRowAmount, { fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_texto }]}>
                {datositem.modelo_clasificador}
              </Text>
            </View>
          </View>

        </View>

        
        {tieneComprobante && (
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <SafeAreaView style={[styles.modalSheet,{backgroundColor:colors.screen_componente_estilos.color_fondo_cards}]}>
                <View style={[styles.modalHandle,{backgroundColor:colors.screen_componente_estilos.color_fondo}]} />
                <Text style={[styles.modalTitle, { fontFamily: fonts.balsamiqbold.fontFamily,color:colors.screen_componente_estilos.color_texto }]}>
                  Comprobante
                </Text>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                  {imageLoading && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator size="large" color={colors.screen_componente_estilos.color_texto_importante} />
                    </View>
                  )}
                  <Image
                     source={{ uri: datositem.imagenes?.[0] }}
                    style={styles.comprobanteImg}
                    resizeMode="contain"
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                  />
                </ScrollView>
                <TouchableOpacity style={[styles.cerrarBtn,
                  {backgroundColor:colors.screen_componente_estilos.color_fondo_botones,
                  borderColor:colors.screen_componente_estilos.color_borde_botones
                  }
                  ]} 
                  onPress={() => setModalVisible(false)}>
                  <Text style={[styles.cerrarBtnText, { fontFamily: fonts.balsamiqbold.fontFamily,color:colors.screen_componente_estilos.color_texto_importante  }]}>
                    Cerrar
                  </Text>
                </TouchableOpacity>
              </SafeAreaView>
            </View>
          </Modal>
        )}
      </ScrollView>
    




      
      
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    //backgroundColor: '#13161f',       // fondo negro azulado general
  },
   customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  // ── HERO ──────────────────────────────────────────
  hero: {
    //backgroundColor: '#1a1f2e',       // negro azulado más claro para el hero
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoWrap: {
    borderRadius: 10,
    overflow: 'hidden',
    flexShrink: 0,
  },
  nombreEmpresa: {
    fontSize: 15,
    //color: '#ffffff',
  },
  fechaRegistro: {
    fontSize: 11,
    //color: '#8a8fa8',                 // gris azulado apagado
    marginTop: 3,
  },
  numeroFactura: {
    fontSize: 11,
    marginTop: 2,
  },
  heroTotal: {
    alignItems: 'center',
  
    
  },
  heroTotalLabel: {
    fontSize: 15,
    letterSpacing: 1.2,
    
    //color: '#8a8fa8',                 // gris apagado
  },
  heroTotalAmount: {
    fontSize: 34,
   // color: '#3AB884',                 // verde brillante
    marginTop: 6,
  },
  heroFechaGasto: {
    fontSize: 12,
    //color: '#8a8fa8',
    marginTop: 8,
  },

  // ── IVA (10% / 5%) ──────────────────────────────────
  ivaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 12,
    marginBottom: 6,
  },
  ivaItem: {
    flex: 1,
    alignItems: 'center',
  },
  ivaSeparador: {
    width: 1,
    height: 26,
  },
  ivaLabel: {
    fontSize: 10,
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  ivaValue: {
    fontSize: 15,
  },

  // ── TARJETAS ──────────────────────────────────────
  cardsContainer: {
    padding: 14,
    gap: 12,
  },
  card: {
    //backgroundColor: '#1e2336',       // gris oscuro azulado para las tarjetas
    borderRadius: 14,
    borderWidth: 0.5,
    //borderColor: '#2a2f45',           // borde apenas visible
    padding: 14,
  },
  cardTitle: {
    fontSize: 10,
    letterSpacing: 1.1,
    //color: '#8a8fa8',                 // gris apagado
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
  },
  cardRowBorder: {
    borderTopWidth: 0.5,
    //borderTopColor: '#2a2f45',
  },
  cardRowLabel: {
    fontSize: 13,
    //color: '#ffffff',
  },
  cardRowAmount: {
    fontSize: 13,
    //color: '#ffffff',
  },

  // ── ETIQUETAS (chips) ─────────────────────────────
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 0.5,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipText: {
    fontSize: 12,
  },

  // ── CONCEPTOS (tabla) ─────────────────────────────
  tablaHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 4,
  },
  tablaHeaderCelda: {
    fontSize: 10,
    letterSpacing: 0.6,
  },
  tablaFila: {
    flexDirection: 'row',
    paddingVertical: 9,
    alignItems: 'flex-start',
  },
  tablaFilaBorder: {
    borderTopWidth: 0.5,
  },
  tablaCelda: {
    fontSize: 12,
  },
  colConcepto: {
    flex: 2,
    paddingRight: 8,
  },
  colEtiqueta: {
    flex: 1,
    textAlign: 'right',
  },

  // ── BOTÓN COMPROBANTE ─────────────────────────────
  comprobanteBtn: {
    borderWidth: 0.5,
    //borderColor: '#3AB884',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 4,
  },
  comprobanteBtnText: {
    fontSize: 13,
    //color: '#3AB884',
  },

  // ── MODAL ─────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    //backgroundColor: '#1e2336',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
    height: '88%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    //backgroundColor: '#2a2f45',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    //color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  comprobanteImg: {
    width: '100%',
  height: 460,                 // se respetará si el ScrollView tiene altura suficiente
  resizeMode: 'contain',
  },
  cerrarBtn: {
    marginTop: 16,
    marginBottom: 10,
    borderRadius: 12,
     borderWidth: 0.5,
    padding: 14,
    alignItems: 'center',
    //backgroundColor: '#3AB884',
  },
  cerrarBtnText: {
    //color: '#fff',
    fontSize: 14,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
    zIndex: 10,
  },
});