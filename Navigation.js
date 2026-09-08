import React,{useContext} from 'react';
import { View,Text,TouchableOpacity,StyleSheet } from "react-native";
import { NavigationContainer,DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from '@react-navigation/native';
import { useNavigation  } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from './AuthContext';

import { colores_temas } from './Utils/Temas';
import { temaUser } from './ThemeContext';

import Svg, { Rect, Circle, Text as SvgText } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



import Cargando from './Componentes/Procesando/Cargando';
import DrawerContentInicio from './Componentes/DrawerContentInicio/DrawerContentInicio';


//Screens
import Login from './Componentes/Screens/Login/Login';
// import RegistroUsuario from './Componentes/Screens/Usuarios/RegistroUsuario';
// import Settings from './Componentes/Screens/Settings';
// import Modelo from './Componentes/Screens/Modelo/Modelo';




 import ListadoMovimientosGastos from './Componentes/Screens/MovimientosGastos/ListadoMovimientosGastos';
// import DetalleMovimientoGasto from './Componentes/Screens/MovimientosGastos/DetalleMovimientoGasto';
// import RegistroMovimientoGasto from './Componentes/Screens/MovimientosGastos/RegistroMovimientoGasto';



// import ListadoMovimientosIngresos from './Componentes/Screens/MovimientosIngresos/ListadoMovimientosIngresos';

// import DetalleMovimientoIngreso from './Componentes/Screens/MovimientosIngresos/DetalleMovimientoIngreso';
// import RegistroMovimientoIngreso from './Componentes/Screens/MovimientosIngresos/RegistroMovimientoIngreso';



// import ResumenMovimientos from './Componentes/Screens/ResumenMovimientos/ResumenMovimientos';

// import GraficaOverview from './Componentes/Screens/Estadisticas/Estadisticas';
// import EstadisticasMes from './Componentes/Screens/Estadisticas/EstadisticasMes';


// import CameraScreen from './Componentes/Screens/Camerascreen/Camarascreen';

// import PickerScreen from './Componentes/Screens/Pickerscreen/Pickerscreen';



// import ListadoCategoriasGastos from './Componentes/Screens/CategoriasGastos/ListadoCategoriasGastos';
// import DetalleCategoriaGasto from './Componentes/Screens/CategoriasGastos/DetalleCategoriaGasto';
// import RegistroCategoria from './Componentes/Screens/CategoriasGastos/RegistroCategoria';

// import ListadoMediosPagos from './Componentes/Screens/MediosPagos/ListadoMediosPagos';
// import DetalleMedioPago from './Componentes/Screens/MediosPagos/DetalleMedioPago';
// import RegistroMedioPago from './Componentes/Screens/MediosPagos/RegistroMedioPago';

// import ListadoIngresos from './Componentes/Screens/Ingresos/ListadoIngresos';
// import DetalleIngreso from './Componentes/Screens/Ingresos/DetalleIngreso';
// import RegistroIngreso from './Componentes/Screens/Ingresos/RegistroIngreso';

// import ListadosGastos from './Componentes/Screens/Gastos/ListadosGastos';
// import RegistroGasto from './Componentes/Screens/Gastos/RegistroGasto';
// import DetalleGasto from './Componentes/Screens/Gastos/DetalleGasto';

// import AddBasic from './Componentes/AddBasic/AddBasic2';
// import Alerta from './Componentes/Procesando/Alerta';

// // import { tema_colores_activo } from './Utils/Temas';



// import RecorridoCategoria from './Componentes/Screens/Recorrido/RecorridoCategoria';
// import RecorridoConceptoGasto from './Componentes/Screens/Recorrido/RecorridoConceptoGasto';
// import RecorridoConceptoIngreso from './Componentes/Screens/Recorrido/RecorridoConceptoIngreso';
// import RecorridoMedioPago from './Componentes/Screens/Recorrido/RecorridoMedioPago';
// import SeleccionTema from './Componentes/Screens/Configuracion/SeleccionTema';

//////////////iconos///////////////////////////////
import { Ionicons } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';






const DrawerNav = createDrawerNavigator();
function DrawerInicio({navigation}) {
  const { colors,fonts } = useTheme();
  const {periodo, setPeriodo} = useContext(AuthContext);
  const {sesiondatadate, setSesiondatadate} = useContext(AuthContext);
  const {sesiondata, setSesiondata} = useContext(AuthContext);
  const { navigate } = useNavigation();  
  const { estadocomponente } = useContext(AuthContext);
  const sizeicon=18
  const sizefont=18
  const div_heigth=20
  // const margin_text=-15
  const color_texto=colors.screen_componente_estilos.color_texto
  const color_icono=colors.screen_componente_estilos.color_texto
  const color_linea=colors.screen_componente_estilos.color_texto_importante
  // console.log(sesiondatadate)
  return (
    <DrawerNav.Navigator
      screenOptions={{
        
        headerShown: !estadocomponente.camaracdc, 
        headerTitle: ({}) => (
        <View style={{ alignItems: 'center' }}>
          <Text style={{
            color: colors.navigation_estilos.color_texto,
            fontSize: 30,
            fontFamily: fonts.balsamiqbold.fontFamily,
            lineHeight: 36,
          }}>
            {/* {periodo} */}
          </Text>
          <Text style={{
            color: colors.navigation_estilos.color_texto,
            fontSize: 20,
            fontFamily: fonts.balsamiqbold.fontFamily,
            lineHeight: 24,
          }}>
            {/* {sesiondatadate.nombremesactual} */}
          </Text>
        </View>
        ),
       
        headerTitleAlign:'center',
        headerStyle:{elevation:0},
        headerTintColor: colors.navigation_estilos.color_texto,
        drawerLabelStyle: {marginLeft: 0,fontFamily: fonts.bodybold.fontFamily},
        tabBarLabelStyle:{borderWidth:1,bordercolor:'red'},
        backgroundColor:'red',
        color:'red',
        drawerStyle: {backgroundColor: colors.screen_componente_estilos.color_fondo_cards}
        // drawerStyle: {backgroundColor:'#FAF7F0'} // posible para el tema 7
        
      
      }}
      drawerContent={DrawerContentInicio}
    >
      <DrawerNav.Screen 
        name="Home" 
        component={RootStackHomeNavigator} 
        options={{
         
          drawerLabel: ({ color, size,focused }) => {
            
            let familyname
            familyname= focused ? fonts.balsamiqbold.fontFamily : fonts.balsamiqregular.fontFamily;
            
            return(<View style={{height:div_heigth,alignContent:'center',justifyContent:'center'}}> 
                      <Text style={{fontFamily: familyname,color:color_texto}}> 
                        Inicio
                      </Text>
                    </View>)
          },
          
          drawerIcon: ({size, color})=>(<AntDesign name="home" size={sizeicon} color={color_icono} />),
          drawerItemStyle:{borderBottomWidth:1,
            borderBottomColor:color_linea,
            marginBottom:5}
          
          }}
      />

      <DrawerNav.Screen name="RootNavigator" 
        component={RootNavigator}
        options={{
          drawerLabel: ({ color, size,focused }) => {
            
            let familyname
            familyname= focused ? fonts.balsamiqbold.fontFamily : fonts.balsamiqregular.fontFamily;
            
            return(<View style={{height:div_heigth,alignContent:'center',justifyContent:'center'}}> 
                      <Text style={{fontFamily: familyname,color:color_texto}}> 
                        Etiquetas
                      </Text>
                    </View>)
          },
          drawerIcon: ({size, color})=>(
            <MaterialCommunityIcons name="tag-outline"  size={sizeicon} color={color_icono} />
          ),
          drawerItemStyle:{borderBottomWidth:1,borderBottomColor:color_linea,marginBottom:5}
         }}

       />

      {/* <DrawerNav.Screen name="Preferencias" 
        component={SeleccionTema}
        options={{
          drawerLabel: ({ color, size,focused }) => {
            
            let familyname
            familyname= focused ? fonts.balsamiqbold.fontFamily : fonts.balsamiqregular.fontFamily;
            
            return(<View style={{height:div_heigth,alignContent:'center',justifyContent:'center'}}> 
                      <Text style={{fontFamily: familyname,color:color_texto}}> 
                        Preferencias
                      </Text>
                    </View>)
          },
          drawerIcon: ({size, color})=>(
            <MaterialCommunityIcons name="palette-outline"  size={sizeicon} color={color_icono} />
          ),
          drawerItemStyle:{borderBottomWidth:1,borderBottomColor:color_linea,marginBottom:5}
         }}

       /> */}
      
      

       
      
    </DrawerNav.Navigator>
  );
}




const Stack = createNativeStackNavigator();
function NavigationLogin(){
  return (
    
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        {/* <Stack.Screen name="RegistroUsuario" component={RegistroUsuario} /> */}
      </Stack.Navigator>
    
  );

  
  }




// ... tus otros imports (Cargando, AddBasic, StackRecorrido, DrawerInicio, NavigationLogin, etc.)

function Navigation({ notificationData, setNotificationData }) {
    const { themeName } = temaUser();
    const { activarsesion, estadocomponente, recorrido } = useContext(AuthContext);

    // Obtener el objeto de colores actual basado en themeName
    // Fallback a tema_17 si por alguna razón el nombre no existe en el catálogo
    const temaActual = colores_temas[themeName] || colores_temas.tema_17;

    // Construir el tema dinámicamente DENTRO del componente
    const MyTheme = {
        ...DefaultTheme,
        fonts: {
            regular: { fontFamily: 'SenRegular', fontWeight: 'normal' },
            regularroboto: { fontFamily: 'RobotoRegular', fontWeight: 'normal' },
            regularrobotobold: { fontFamily: 'RobotoBold' },
            regularbold: { fontFamily: 'SenBold', fontWeight: 'normal' },
            bodyregular: { fontFamily: 'bodyRegular', fontWeight: 'normal' },
            bodybold: { fontFamily: 'bodyBold', fontWeight: 'normal' },
            mirandaregular: { fontFamily: 'MirandaRegular' },
            mirandabold: { fontFamily: 'MirandaBold' },
            mirandaitalic: { fontFamily: 'MirandaItalic' },
            balsamiqregular: { fontFamily: 'BalsamiqSansRegular' },
            balsamiqtalic: { fontFamily: 'BalsamiqSansItalic' },
            balsamiqbold: { fontFamily: 'BalsamiqSansBold' },
        },
        colors: {
            ...DefaultTheme.colors,
            background: temaActual.screen_componente_estilos.color_fondo,
            card: temaActual.navigation_estilos.color_fondo,
            ...temaActual,
        },
    };

    return (
        <NavigationContainer theme={MyTheme}>
            {activarsesion ? (
                <>
                    {estadocomponente.loading && <Cargando />}
                    {estadocomponente.componente_plus_basic && <AddBasic />}

                    
                        <DrawerInicio />
                    
                </>
            ) : (
                <>
                    {estadocomponente.loading && <Cargando />}
                    <NavigationLogin />
                </>
            )}
        </NavigationContainer>
    );
}

export default Navigation;

const RootStackHome=createNativeStackNavigator();
function RootStackHomeNavigator() {
  return (
    <RootStackHome.Navigator screenOptions={{ headerShown: false }}>
      {/* El TabNavigator es UNA pantalla del root */}
      <RootStackHome.Screen name="TabsHome" component={TabsHome} />

      {/* === GASTOS: Detalle y Registro como hermanos del Tab === */}
      {/* <RootStackHome.Screen name="DetalleMovimientoGasto" component={DetalleMovimientoGasto} />
      <RootStackHome.Screen name="RegistroMovimientoGasto" component={RegistroMovimientoGasto} /> */}

      {/* === CATEGORÍAS === */}
      {/* <RootStackHome.Screen name="DetalleMovimientoIngreso" component={DetalleMovimientoIngreso} />
      <RootStackHome.Screen name="RegistroMovimientoIngreso" component={RegistroMovimientoIngreso} /> */}


    </RootStackHome.Navigator>
  );
}
const Tab = createBottomTabNavigator();
function TabsHome({ navigation }) {
  
  const { colors,fonts } = useTheme();
  const estilos= {
    icon_size:20,
    label_size:11,
    family_active:fonts.balsamiqbold.fontFamily,
    family_inactive:fonts.balsamiqregular.fontFamily, 
    icon_color_active:colors.screen_componente_estilos.color_fondo,
    icon_color_inactive:colors.screen_componente_estilos.color_texto_subtitulo,
    text_color_active:colors.screen_componente_estilos.color_fondo,
    text_color_inactive:colors.screen_componente_estilos.color_texto_subtitulo,

  }
  return (
    <Tab.Navigator
      initialRouteName="ListadoMovimientosGastos"
      screenOptions={{
        tabBarStyle: {
          backgroundColor:colors.card,
          height: 57, 
          paddingBottom: 0,
          borderTopLeftRadius:30,
          borderTopRightRadius:30,
          
        },
       
      }}
    >
      <Tab.Screen
        name="ListadoMovimientosGastos"
        component={ListadoMovimientosGastos}
         options={{ 
           tabBarIcon: ({focused, color, size }) => {
              let nombrreico,color_icono
              nombrreico = "caret-square-up"
              color_icono = focused ? estilos.icon_color_active : estilos.icon_color_inactive;
              return  ( 
                    <View style={[styles.iconContainer]}>
                          <FontAwesome6 name={nombrreico} size={estilos.icon_size} color={color_icono}  />
                      </View>
                      )
            },
          tabBarLabel: ({focused})=>{
              let titulolabel,tipo_fuente,text_color

              titulolabel =  "Gastos"
              tipo_fuente = focused ?fonts.balsamiqregular.fontFamily: estilos.family_inactive;
              text_color= focused ? estilos.text_color_active : estilos.text_color_inactive;
              return <Text style={{ fontFamily:tipo_fuente,fontSize:estilos.label_size,color:text_color}}>{titulolabel}</Text>
            },
          headerShown: false 
        }}
      />
      {/* <Tab.Screen
        name="ListadoMovimientosIngresos"
        component={ListadoMovimientosIngresos}
        options={{ 
           tabBarIcon: ({focused, color, size }) => {
              let nombrreico,color_icono
              nombrreico = "caret-square-down"
              color_icono = focused ? estilos.icon_color_active : estilos.icon_color_inactive;
              return  ( 
                    <View style={[styles.iconContainer]}>
                          <FontAwesome6 name={nombrreico} size={estilos.icon_size} color={color_icono}  />
                      </View>
                      )
            },
          tabBarLabel: ({focused})=>{
              let titulolabel,tipo_fuente,text_color

              titulolabel =  "Ingresos"
              tipo_fuente = focused ?fonts.balsamiqregular.fontFamily: estilos.family_inactive;
              text_color= focused ? estilos.text_color_active : estilos.text_color_inactive;
              return (
                

                  <Text style={{ fontFamily:tipo_fuente,fontSize:estilos.label_size,color:text_color}}>{titulolabel}
                  </Text>
                
                )
            },
          headerShown: false 
        }}
      />




      <Tab.Screen
        name="ResumenMovimientos"
        component={ResumenMovimientos}
        options={{ 
           tabBarIcon: ({focused, color, size }) => {
              let nombrreico,color_icono
              nombrreico = "table"
              color_icono = focused ? estilos.icon_color_active : estilos.icon_color_inactive;
              return  ( 
                    <View style={[styles.iconContainer]}>
                          <FontAwesome6 name={nombrreico} size={estilos.icon_size} color={color_icono}  />
                      </View>
                      )
            },
          tabBarLabel: ({focused})=>{
              let titulolabel,tipo_fuente,text_color

              titulolabel =  "Resumen"
              tipo_fuente = focused ?fonts.balsamiqregular.fontFamily: estilos.family_inactive;
              text_color= focused ? estilos.text_color_active : estilos.text_color_inactive;
              return (
                

                  <Text style={{ fontFamily:tipo_fuente,fontSize:estilos.label_size,color:text_color}}>{titulolabel}
                  </Text>
                
                )
            },
          headerShown: false 
        }}
      />
      <Tab.Screen
        name="EstadisticasMes"
        component={EstadisticasMes}
        options={{ 
           tabBarIcon: ({focused, color, size }) => {
              let nombrreico,color_icono
              nombrreico = "chart-pie"
              color_icono = focused ? estilos.icon_color_active : estilos.icon_color_inactive;
              return  ( 
                    <View style={[styles.iconContainer]}>
                          <FontAwesome6 name={nombrreico} size={estilos.icon_size} color={color_icono}  />
                      </View>
                      )
            },
          tabBarLabel: ({focused})=>{
              let titulolabel,tipo_fuente,text_color

              titulolabel =  "Stats"
              tipo_fuente = focused ?fonts.balsamiqregular.fontFamily: estilos.family_inactive;
              text_color= focused ? estilos.text_color_active : estilos.text_color_inactive;
              return (
                

                  <Text style={{ fontFamily:tipo_fuente,fontSize:estilos.label_size,color:text_color}}>{titulolabel}
                  </Text>
                
                )
            },
          headerShown: false 
        }}
      /> */}
      
    </Tab.Navigator>
  );

 
}


const RootStack = createNativeStackNavigator();
function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* El TabNavigator es UNA pantalla del root */}
      <RootStack.Screen name="TabBasicosGroup" component={TabBasicosGroup} />

      {/* === GASTOS: Detalle y Registro como hermanos del Tab === */}
      {/* <RootStack.Screen name="DetalleGasto" component={DetalleGasto} />
      <RootStack.Screen name="RegistroGasto" component={RegistroGasto} /> */}

      {/* === CATEGORÍAS === */}
      {/* <RootStack.Screen name="DetalleCategoriaGasto" component={DetalleCategoriaGasto} />
      <RootStack.Screen name="RegistroCategoria" component={RegistroCategoria} /> */}

      {/* === MEDIOS DE PAGO === */}
      {/* <RootStack.Screen name="DetalleMedioPago" component={DetalleMedioPago} />
      <RootStack.Screen name="RegistroMedioPago" component={RegistroMedioPago} /> */}

      {/* === INGRESOS === */}
      {/* <RootStack.Screen name="DetalleIngreso" component={DetalleIngreso} />
      <RootStack.Screen name="RegistroIngreso" component={RegistroIngreso} /> */}
    </RootStack.Navigator>
  );
}

const TabBasicos = createBottomTabNavigator();
function TabBasicosGroup({ navigation }) {
  
  const { colors,fonts } = useTheme();
  const estilos= {
    icon_size:20,
    label_size:11,
    family_active:fonts.balsamiqbold.fontFamily,
    family_inactive:fonts.balsamiqregular.fontFamily, 
    icon_color_active:colors.screen_componente_estilos.color_fondo,
    icon_color_inactive:colors.screen_componente_estilos.color_texto_subtitulo,
    text_color_active:colors.screen_componente_estilos.color_fondo,
    text_color_inactive:colors.screen_componente_estilos.color_texto_subtitulo,

  }
 return (
    <TabBasicos.Navigator
      initialRouteName="ListadosGastos"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.card,
          height: 57,
          paddingBottom: 0,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
      }}
    >
      <TabBasicos.Screen
        name="ListadoCategoriasGastos"
        component={ListadoCategoriasGastos}
        options={{
          tabBarIcon: ({ focused }) => {
            const color = focused ? estilos.icon_color_active : estilos.icon_color_inactive;
            return (
              <View style={styles.iconContainer}>
                <MaterialIcons name="category" size={estilos.icon_size} color={color} />
              </View>
            );
          },
          tabBarLabel: ({ focused }) => {
            const fuente = focused ? estilos.family_active : estilos.family_inactive;
            const color = focused ? estilos.text_color_active : estilos.text_color_inactive;
            return <Text style={{ fontFamily: fuente, fontSize: estilos.label_size, color }}>Categorias</Text>;
          },
          headerShown: false,
        }}
      />

      <TabBasicos.Screen
        name="ListadosGastos"
        component={ListadosGastos}
        options={{
          tabBarIcon: ({ focused }) => {
            const color = focused ? estilos.icon_color_active : estilos.icon_color_inactive;
            return (
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="cash-minus" size={30} color={color} />
              </View>
            );
          },
          tabBarLabel: ({ focused }) => {
            const fuente = focused ? estilos.family_active : estilos.family_inactive;
            const color = focused ? estilos.text_color_active : estilos.text_color_inactive;
            return <Text style={{ fontFamily: fuente, fontSize: estilos.label_size, color }}>Gastos</Text>;
          },
          headerShown: false,
        }}
      />

      <TabBasicos.Screen
        name="ListadoMediosPagos"
        component={ListadoMediosPagos}
        options={{
          tabBarIcon: ({ focused }) => {
            const color = focused ? estilos.icon_color_active : estilos.icon_color_inactive;
            return (
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="wallet-outline" size={25} color={color} />
              </View>
            );
          },
          tabBarLabel: ({ focused }) => {
            const fuente = focused ? estilos.family_active : estilos.family_inactive;
            const color = focused ? estilos.text_color_active : estilos.text_color_inactive;
            return <Text style={{ fontFamily: fuente, fontSize: estilos.label_size, color }}>Medios P.</Text>;
          },
          headerShown: false,
        }}
      />

      <TabBasicos.Screen
        name="ListadoIngresos"
        component={ListadoIngresos}
        options={{
          tabBarIcon: ({ focused }) => {
            const color = focused ? estilos.icon_color_active : estilos.icon_color_inactive;
            return (
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="cash-plus" size={30} color={color} />
              </View>
            );
          },
          tabBarLabel: ({ focused }) => {
            const fuente = focused ? estilos.family_active : estilos.family_inactive;
            const color = focused ? estilos.text_color_active : estilos.text_color_inactive;
            return <Text style={{ fontFamily: fuente, fontSize: estilos.label_size, color }}>Ingresos</Text>;
          },
          headerShown: false,
        }}
      />
    </TabBasicos.Navigator>
  );
 
}




 const styles = StyleSheet.create({
      iconContainer: {
      
      width:40,
      justifyContent: 'center',
      alignItems: 'center',
      height: 30,
      marginTop:5,
      marginBottom:5,
      
      },
    
    });
  