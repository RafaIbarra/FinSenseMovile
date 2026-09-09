import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, Text, Alert, ImageBackground, Animated } from 'react-native';
import { TextInput, Button, Surface, Portal, Dialog, PaperProvider, MD3LightTheme } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../../../AuthContext';
import { useNavigation } from "@react-navigation/native";
import Iniciarsesion from '../../../Apis/ApiInicioSesion';
import Handelstorage from '../../../Storage/HandelStorage';
import ComprobarStorage from '../../../Storage/VerificarStorage';
import Generarpeticion from '../../../Apis/ApiPeticiones';
import { obtenerTemaStorage } from '../../../Storage/TemaStorage';
import { temaUser as useAppTheme } from '../../../ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { createIconSetFromFontello } from '@expo/vector-icons';

export default function Login() {
  const { colors, fonts } = useTheme();
  const { navigate } = useNavigation();
  const { setTheme } = useAppTheme();
  const [ready, setReady] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);
  const [mensajeerror, setMensajeerror] = useState('');
  const { activarsesion, setActivarsesion } = useContext(AuthContext);
  const { versionsys, setVersionsys } = useContext(AuthContext);
  const { sesiondata, setSesiondata } = useContext(AuthContext);
  const { sesiondatadate, setSesiondatadate } = useContext(AuthContext);
  const { recorrido, setRecorrido } = useContext(AuthContext);
  const { datarecorrido, setDatarecorrido } = useContext(AuthContext);
  const { reiniciarvalores } = useContext(AuthContext);
  const { periodo, setPeriodo } = useContext(AuthContext);
  const { actualizarEstadocomponente } = useContext(AuthContext);

  const [visibledialogo, setVisibledialogo] = useState(false);
  const showDialog = () => setVisibledialogo(true);
  const hideDialog = () => setVisibledialogo(false);

  // ─── TEMA PERSONALIZADO PARA PAPER ─────────────────────────────────────────
  const paperTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: colors.navigation_estilos?.color_fondo || '#000',
      onSurface: colors.screen_componente_estilos?.color_texto || '#000',
      onSurfaceVariant: colors.screen_componente_estilos?.color_texto_subtitulo || colors.screen_componente_estilos?.color_texto || '#666',
      outline: colors.navigation_estilos?.color_fondo || '#000',
      surface: colors.screen_componente_estilos?.color_fondo_cards || '#fff',
      surfaceVariant: colors.screen_componente_estilos?.color_fondo || '#fff',
      background: colors.screen_componente_estilos?.color_fondo || '#fff',
      error: 'red',
    },
    fonts: {
      ...MD3LightTheme.fonts,
      bodyLarge: { fontFamily: fonts?.balsamiqregular?.fontFamily || 'System' },
      bodyMedium: { fontFamily: fonts?.balsamiqregular?.fontFamily || 'System' },
      bodySmall: { fontFamily: fonts?.balsamiqregular?.fontFamily || 'System' },
      labelLarge: { fontFamily: fonts?.balsamiqbold?.fontFamily || 'System' },
      titleMedium: { fontFamily: fonts?.balsamiqbold?.fontFamily || 'System' },
    },
  };

  const handleError = (errorObject) => {
    if (typeof errorObject === 'object' && errorObject !== null) {
      return Object.entries(errorObject)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('\n');
    }
    return String(errorObject || 'Error desconocido');
  };

  const ingresar = async () => {
    actualizarEstadocomponente('tituloloading', 'INICIANDO SESION');
    actualizarEstadocomponente('loading', true);
    const datos = await Iniciarsesion(usuario, contrasena, '', '');
    const resp = datos['status'];
    
    if (resp === 200) {
      
      const userdata = {
        token: datos['data']['token'],
        sesion: datos['data']['sesion'],
        refresh: datos['data']['refresh'],
        user_name: datos['data']['UserName'],
        recorrido: datos['data']['recorrido']
      };

      await Handelstorage('agregar', userdata, '');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const datestorage = await Handelstorage('obtenerdate');
      
      setSesiondata(datos['data']);
      setSesiondatadate(datestorage);

      // ─── SINCRONIZACIÓN DE TEMA ─────────────────────────────────
      
      // const temaBackend = datos['data']?.datauser[0]?.tema;
      const temaBackend = datos['data']?.tema;
      const temaStorage = await obtenerTemaStorage();
      
      if (temaBackend && temaBackend !== temaStorage) {
        await setTheme(temaBackend);
      }
      // ────────────────────────────────────────────────────────────

      const anno_storage = datestorage['dataanno'];

     

      if (anno_storage === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const datestorage2 = await Handelstorage('obtenerdate');
        setPeriodo(datestorage2['dataperiodo']);
        setSesiondatadate(datestorage2);
      }
      reiniciarvalores()
      setPeriodo(datestorage['dataperiodo']);
      actualizarEstadocomponente('DiaActual', datos['data'].dia_actual);
      setActivarsesion(true);
      setRecorrido(datos['data']['recorrido']);
      setDatarecorrido(datos['data']['datarecorrido']);
      
    } else {
      showDialog(true);
      const errorMsg = handleError(datos['data']?.['message'] || datos['data'] || 'Error en la solicitud');
      setMensajeerror(errorMsg);
    }
    actualizarEstadocomponente('tituloloading', '');
    actualizarEstadocomponente('loading', false);
  };

  const handleContrasenaChange = (text) => {
    setContrasena(text);
  };

  

  const cargardatos = async () => {
    setReady(false);
    actualizarEstadocomponente('tituloloading', 'Comprobando Sesion..');
    actualizarEstadocomponente('loading', true);

    const datosstarage = await ComprobarStorage();
    const credenciales = datosstarage['datosesion'];
    if (credenciales) {
      const endpoint = 'sessions/control-sesion';
      const result = await Generarpeticion(endpoint, 'GET', {});
      const respuesta = result['resp'];
      if (respuesta === 200) {
        
        setSesiondata(result['data']);

        // ─── SINCRONIZACIÓN DE TEMA (login automático) ─────────────
        const temaBackend = result['data']?.tema;
        const temaStorage = await obtenerTemaStorage();

        if (temaBackend && temaBackend !== temaStorage) {
          await setTheme(temaBackend);
        }
        // ────────────────────────────────────────────────────────────

        const datestorage = await Handelstorage('obtenerdate');
        setSesiondatadate(datestorage);
        setPeriodo(datestorage['dataperiodo']);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        reiniciarvalores()
        setActivarsesion(true);
        actualizarEstadocomponente('tituloloading', '');
        actualizarEstadocomponente('loading', false);
      } else {
        reiniciarvalores()
        await Handelstorage('borrar');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActivarsesion(false);
        actualizarEstadocomponente('tituloloading', '');
        actualizarEstadocomponente('loading', false);
      }
    } else {
      actualizarEstadocomponente('tituloloading', '');
      actualizarEstadocomponente('loading', false);
      setActivarsesion(false);
    }
  };

  useEffect(() => {
    cargardatos();
  }, []);

  const texto_normal = fonts?.balsamiqregular?.fontFamily || 'System';
  const texto_negrita = fonts?.balsamiqbold?.fontFamily || 'System';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.screen_componente_estilos?.color_fondo || '#fff' },
        ]}
      >
        <Portal>
          <Dialog visible={visibledialogo} onDismiss={hideDialog}>
            <Dialog.Icon icon="alert-circle" size={50} color="red" />
            <Dialog.Title>
              <Text>ERROR</Text>
            </Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{mensajeerror}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>
                <Text>OK</Text>
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <View style={styles.centerContainer}>
          <Animated.View
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={['#808486', '#203a43', '#2c5364']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Text
                style={[
                  styles.titulo,
                  {
                    fontFamily: texto_negrita,
                    color: '#fff',
                    letterSpacing: 3,
                    textShadowColor: 'rgba(0,0,0,0.2)',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 6,
                  },
                ]}
              >
                FINSENSE
              </Text>
              <View
                style={{
                  width: 50,
                  height: 2,
                  backgroundColor: '#ffffff50',
                  borderRadius: 1,
                  marginTop: 6,
                }}
              />
            </LinearGradient>
          </Animated.View>

          <Surface
            style={[
              styles.card,
              { backgroundColor: colors.screen_componente_estilos?.color_fondo_cards || '#fff' },
            ]}
            elevation={2}
          >
            <ImageBackground
              source={require('../../../assets/logoapp.png')}
              style={styles.imageBackground}
              imageStyle={styles.imageStyle}
            >
              <View style={styles.formContainer}>
                <Text
                  style={[
                    styles.cardTitulo,
                    {
                      fontFamily: texto_normal,
                      color: colors.screen_componente_estilos?.color_texto || '#000',
                    },
                  ]}
                >
                  Iniciar sesión
                </Text>

                <TextInput
                  label="Usuario"
                  value={usuario}
                  onChangeText={setUsuario}
                  mode="outlined"
                  style={[styles.input, { backgroundColor: colors.screen_componente_estilos?.color_fondo || '#fff' }]}
                  outlineStyle={{ borderRadius: 15 }}
                  contentStyle={{ fontFamily: texto_normal, color: colors.screen_componente_estilos?.color_texto || '#000' }}
                  outlineColor={colors.navigation_estilos?.color_fondo || '#000'}
                  activeOutlineColor={colors.navigation_estilos?.color_fondo || '#000'}
                  textColor={colors.screen_componente_estilos?.color_texto || '#000'}
                  left={<TextInput.Icon icon="account" />}
                />

                <TextInput
                  label="Contraseña"
                  value={contrasena}
                  onChangeText={handleContrasenaChange}
                  mode="outlined"
                  secureTextEntry={!verContrasena}
                  style={[styles.input, { backgroundColor: colors.screen_componente_estilos?.color_fondo || '#fff' }]}
                  outlineStyle={{ borderRadius: 15 }}
                  contentStyle={{ fontFamily: texto_normal, color: colors.screen_componente_estilos?.color_texto || '#000' }}
                  outlineColor={colors.navigation_estilos?.color_fondo || '#000'}
                  activeOutlineColor={colors.navigation_estilos?.color_fondo || '#000'}
                  textColor={colors.screen_componente_estilos?.color_texto || '#000'}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={verContrasena ? 'eye-off' : 'eye'}
                      onPress={() => setVerContrasena(!verContrasena)}
                    />
                  }
                />

                <Text
                  style={[
                    styles.olvidaste,
                    {
                      fontFamily: texto_normal,
                      color: colors.navigation_estilos?.color_fondo || '#000',
                    },
                  ]}
                >
                  ¿Olvidaste tu contraseña?
                </Text>

                <Button
                  mode="contained"
                  style={{
                    borderRadius: 12,
                    marginBottom: 12,
                    backgroundColor: colors.screen_componente_estilos?.color_fondo_botones || '#000',
                    borderWidth: 0.5,
                    borderColor: colors.navigation_estilos?.color_fondo || '#000'
                  }}
                  contentStyle={styles.botonContenido}
                  buttonColor={colors.screen_componente_estilos?.color_fondo_botones || '#000'}
                  textColor={colors.screen_componente_estilos?.color_texto || '#fff'}
                  labelStyle={{
                    fontFamily: texto_negrita,
                    fontSize: 16,
                    letterSpacing: 0.5,
                  }}
                  onPress={() => ingresar()}
                >
                  <Text>Ingresar</Text>
                </Button>

                <Button
                  mode="text"
                  textColor={colors.navigation_estilos?.color_fondo || '#000'}
                  labelStyle={{
                    fontSize: 14,
                    fontFamily: texto_negrita,
                  }}
                  onPress={() => { navigate('RegistroUsuario'); }}
                >
                  <Text>¿No tenés cuenta? Registrate</Text>
                </Button>
              </View>
            </ImageBackground>
          </Surface>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 28,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 16,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageBackground: {
    width: '100%',
  },
  imageStyle: {
    opacity: 0.3,
    resizeMode: 'cover',
  },
  formContainer: {
    padding: 24,
  },
  cardTitulo: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },
  olvidaste: {
    textAlign: 'right',
    fontSize: 13,
    marginBottom: 20,
  },
  botonContenido: {
    paddingVertical: 6,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    alignItems: 'center',
    paddingLeft: 85,
    paddingRight: 85,
    paddingTop: 14,
    paddingBottom: 14,
  },
});