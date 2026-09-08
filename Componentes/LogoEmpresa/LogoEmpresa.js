import React, { useState } from 'react';
import { Image, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { API_BASE_IMG } from '../../Apis/ApiBase';

const LogoEmpresa = ({ imagePath }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true); // Inicia en true directamente
  const { colors } = useTheme();
  
  // const imageUrl = imagePath ? `${API_BASE_IMG}/Media/${imagePath}` : null;
  const imageUrl = imagePath 
  
  if (!imageUrl) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholderContainer}>
          <Text style={[styles.placeholderText, { color: colors.text }]}>Sin logo</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.acctionsbotoncolor} />
        </View>
      )}
      <Image
        source={{ uri: imageUrl }}
        style={[styles.logo, { opacity: loading ? 0 : 1 }]}
        resizeMode="contain"
        // ❌ Eliminado onLoadStart
        onLoadEnd={() => setLoading(false)}
        onError={(e) => {
          setError(true);
          setLoading(false);
          console.error('Error cargando logo:', e.nativeEvent.error);
        }}
      />
      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Error al cargar logo</Text>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    // No necesita borderRadius porque el contenedor padre tiene overflow: 'hidden'
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 40,
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  placeholderText: {
    fontSize: 12,
    textAlign: 'center',
  },
  errorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 40,
  },
  errorText: {
    fontSize: 10,
    textAlign: 'center',
    color: 'white',
  },
});

export default LogoEmpresa;