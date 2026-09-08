import React,{useEffect,useContext,useState} from "react";
import { View, Text,  Image,StyleSheet } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { Button, Dialog, Portal,PaperProvider} from 'react-native-paper';



import Handelstorage from "../../Storage/HandelStorage";
import { AuthContext } from "../../AuthContext";

import Procesando from "../Procesando/Procesando";
import { useTheme } from '@react-navigation/native';

import { Entypo } from '@expo/vector-icons';

function DrawerContentInicio(props){

    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { reiniciarvalores } = useContext(AuthContext);
    
    const { versionsys,setVersionsys } = useContext(AuthContext);
    
    const {sesiondata, setSesiondata} = useContext(AuthContext);

    const { colors,fonts } = useTheme();

    const [guardando,setGuardando]=useState(false)
    const [visibledialogo, setVisibledialogo] = useState(false)
    const [mensajeerror,setMensajeerror]=useState('')

    const showDialog = () => setVisibledialogo(true);
    const hideDialog = () => setVisibledialogo(false);
    
    const cerrar=async ()=>{

        setGuardando(true)
        
        await Handelstorage('borrar')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        
        const datosstarage=await Handelstorage('obtener');
        const tokenstorage=datosstarage['token']
        
        if(tokenstorage){
          
          await Handelstorage('borrar')
          await new Promise(resolve => setTimeout(resolve, 3000))

          const datosstarage2=await Handelstorage('obtener');
          const tokenstorage2=datosstarage2['token']
          if(tokenstorage2){
            
            setMensajeerror('Hubo en error al completar el cierre de sesion, favor intente de vuelta')
            showDialog(true)
          }else{
            reiniciarvalores()
            setActivarsesion(false)

          }

        }else{
          reiniciarvalores()
          setActivarsesion(false)
        }

        setGuardando(false)
      }
    
    
    
    

    useEffect(() => {

        const cargardatos=()=>{

            
           
        }
        cargardatos()
      }, []);
    return(
      

        <View style={{flex: 1 }} >
            <View style=
                      {{
                        flexDirection:'row',
                        backgroundColor: colors.navigation_estilos.color_fondo,
                        height:100,paddingLeft:15
                        }}>

                        <View style={styles.containerimagen}>
                          <Image
                                source={require('../../assets/logoapp.png')}
                                style={styles.image}
                                resizeMode="cover" 
                            />
                        </View>
                        
                        <View style={{height:60,marginTop:30,marginLeft:5,alignItems:'flex-start',alignContent:'flex-start',justifyContent:'space-between'}}>
                          <Text style={[ styles.textouser, 
                                            { fontFamily: fonts.balsamiqregular.fontFamily,
                                            color: colors.screen_componente_estilos.color_fondo
                                            
                                            }]}>
                              {/* @{sesiondata[0].UserName} */}
                            </Text>
                            <Text style={[ styles.textodatos,{fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_fondo}]}>
                              {/* {sesiondata[0].nombre}; {sesiondata[0].apellido} */}
                            </Text>

                            

                            <Text style={[ styles.textohora, {fontFamily: fonts.balsamiqregular.fontFamily,color: colors.screen_componente_estilos.color_fondo }]}>
                              {/* {sesiondata[0].fecha_registro} */}
                            </Text>

                        </View>


            </View>
            <DrawerContentScrollView {...props} scrollEnabled={false} style={{marginTop:-30,marginLeft:-5}} >
                  <DrawerItemList {...props} />
            </DrawerContentScrollView>

            <View style={{
                justifyContent: 'center',  // Centra verticalmente el contenedor interno
                alignItems: 'center',      // Centra horizontalmente
                height: 70,
                backgroundColor: colors.navigation_estilos.color_fondo,
                borderTopLeftRadius:30,
                borderTopRightRadius:30,

              }}>
                <Button 
  style={{
    width: '70%',
    height: 35, // ← Aumentar de 30 a 40 o 45
    backgroundColor: colors.screen_componente_estilos.color_fondo_botones,
    justifyContent: 'center', // ← Centra el contenido verticalmente
  }} 
  mode="elevated" 
  textColor={colors.screen_componente_estilos.color_texto} 
  labelStyle={{
    fontFamily: fonts.balsamiqbold.fontFamily,
    fontSize: 12,
    textAlign: 'center',
    includeFontPadding: false, // ← Reduce padding interno
    paddingVertical: 0, // ← Elimina padding vertical adicional
  }}
  onPress={cerrar}>
  CERRAR SESION 
</Button>
                <Text style={{
                  color: colors.screen_componente_estilos.color_texto_subtitulo,
                  fontFamily: fonts.balsamiqregular.fontFamily,
                  fontSize: 10,
                  marginTop: 5
                }}>
                  Versión: {versionsys} 
                </Text>
            </View>
        </View>
      
    )
}

const styles = StyleSheet.create({
    
    
  
    containerimagen: {
        width: 80, // Ancho del contenedor
        height: 80, // Altura del contenedor
        borderRadius: 75, // Hace que el borde sea circular (la mitad del ancho y la altura)
        borderWidth:2,
        // borderColor:'red',
        overflow: 'hidden', // Oculta el contenido que se desborda del contenedor circular
        marginLeft:5,
        marginTop:15,
        marginBottom:3,
    
      },
    image: {
        width: '100%', // La imagen ocupa todo el ancho del contenedor
        height: '100%', // La imagen ocupa todo el alto del contenedor
        
      },
    textodatos:{
      fontSize:12,
      marginLeft:15
    },
    textohora:{
      fontSize:10,
      marginLeft:15
    },
    textouser:{
      fontSize:16,
    //   fontWeight:'bold',
    //   fontStyle:'italic'
    }
    ,
    textoSinEspacio: {
        marginBottom: -10,  // Ajusta según necesites
        paddingBottom: 0,
    },
    
  });

export default DrawerContentInicio