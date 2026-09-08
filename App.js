import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { obtenerTemaStorage } from './Storage/TemaStorage';
import Navigation from './Navigation';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [themeReady, setThemeReady] = useState(false);
  const [themeName, setThemeName] = useState(null);

  useEffect(() => {
    // Cargar fuentes
    Font.loadAsync({
      SenRegular: require('./assets/fonts/Gwendolyn-Regular.ttf'),
      SenBold: require('./assets/fonts/Gwendolyn-Bold.ttf'),
      bodyRegular: require('./assets/fonts/Charm-Regular.ttf'),
      bodyBold: require('./assets/fonts/Charm-Bold.ttf'),
      RobotoRegular: require('./assets/fonts/Roboto-Regular.ttf'),
      RobotoItalic: require('./assets/fonts/Roboto-Italic.ttf'),
      RobotoBold: require('./assets/fonts/Roboto-Bold.ttf'),
      MirandaRegular: require('./assets/fonts/MirandaSans-Regular.ttf'),
      MirandaItalic: require('./assets/fonts/MirandaSans-Italic.ttf'),
      MirandaBold: require('./assets/fonts/MirandaSans-Bold.ttf'),
      BalsamiqSansRegular: require('./assets/fonts/BalsamiqSans-Regular.ttf'),
      BalsamiqSansItalic: require('./assets/fonts/BalsamiqSans-Italic.ttf'),
      BalsamiqSansBold: require('./assets/fonts/BalsamiqSans-Bold.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  useEffect(() => {
    // Leer tema del storage
    const cargarTema = async () => {
      
      const tema = await obtenerTemaStorage();
      setThemeName(tema);
      setThemeReady(true);
    };
    cargarTema();
  }, []);

  // Mientras cargan fuentes o tema, mostrar pantalla de carga
  if (!fontsLoaded || !themeReady) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loading} edges={['top', 'bottom']}>
          <ActivityIndicator size="large" color="#fb7185" />
          <Text>Cargando...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ThemeProvider temaInicial={themeName}>
          <AuthProvider>
            <Navigation />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7eeef',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bdb5b6',
  },
});