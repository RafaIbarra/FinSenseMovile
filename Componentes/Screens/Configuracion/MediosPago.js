import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../../../AuthContext';
import { useApi } from '../../../Apis/useApi';

const catalogs = [
    { key: 'tipos', endpoint: 'catalog-medio-pago/lista-tipo-medio' },
    { key: 'entidades', endpoint: 'entidades/listar' },
    { key: 'marcas', endpoint: 'marcas/listar' },
    { key: 'medios', endpoint: 'medios-pagos-usuarios/listar' },
];

export default function MediosPago() {
    const { colors, fonts } = useTheme();
    const { actualizarEstadocomponente } = useContext(AuthContext);
    const { setActivarsesion, reiniciarvalores } = useContext(AuthContext);
    const apiRequest = useApi({ setActivarsesion, reiniciarvalores, actualizarEstadocomponente });
    const [datos, setDatos] = useState({ tipos: [], entidades: [], marcas: [], medios: [] });
    const [entidad, setEntidad] = useState('');
    const [marca, setMarca] = useState('');
    const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
    const [entidadSeleccionada, setEntidadSeleccionada] = useState(null);
    const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
    const [selectorAbierto, setSelectorAbierto] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState(null);

    const estilos = {
        fondo: colors.screen_componente_estilos.color_fondo,
        tarjeta: colors.screen_componente_estilos.color_fondo_cards,
        texto: colors.screen_componente_estilos.color_texto,
        secundario: colors.screen_componente_estilos.color_texto_subtitulo,
        acento: colors.screen_componente_estilos.color_texto_importante,
        borde: colors.screen_componente_estilos.color_borde_cards,
        boton: colors.screen_componente_estilos.color_fondo_botones,
        regular: fonts.balsamiqregular.fontFamily,
        negrita: fonts.balsamiqbold.fontFamily,
    };

    const cargarDatos = useCallback(async () => {
        const respuestas = await Promise.all(catalogs.map(({ endpoint }) => apiRequest(endpoint, 'GET', {})));
        if (respuestas.some(respuesta => respuesta.sessionExpired)) return;
        const fallida = respuestas.find(respuesta => !respuesta.resp_correcta);
        if (fallida) {
            setMensaje({ error: true, texto: fallida.data?.message || 'No se pudieron cargar todos los datos.' });
        }
        setDatos(prev => {
            const nuevos = { ...prev };
            respuestas.forEach((respuesta, index) => {
                if (respuesta.resp_correcta && Array.isArray(respuesta.data)) {
                    nuevos[catalogs[index].key] = respuesta.data;
                }
            });
            return nuevos;
        });
    }, [apiRequest]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const enviarFormulario = async (endpoint, campos, mensajeExito) => {
        setGuardando(true);
        setMensaje(null);
        const form = new URLSearchParams();
        Object.entries(campos)
            .filter(([, valor]) => valor !== '' && valor !== null && valor !== undefined)
            .forEach(([clave, valor]) => form.append(clave, String(valor)));
        const respuesta = await apiRequest(endpoint, 'POST', form);
        setGuardando(false);
        if (respuesta.sessionExpired) return false;
        if (!respuesta.resp_correcta) {
            setMensaje({ error: true, texto: respuesta.data?.message || 'No se pudo guardar el registro.' });
            return false;
        }
        setMensaje({ error: false, texto: mensajeExito });
        await cargarDatos();
        return true;
    };

    const registrarEntidad = async () => {
        const nombre = entidad.trim();
        if (!nombre) {
            setMensaje({ error: true, texto: 'Ingrese el nombre de la entidad.' });
            return;
        }
        if (await enviarFormulario('entidades/registro', { nombre, id: 0 }, 'Entidad registrada.')) setEntidad('');
    };

    const registrarMarca = async () => {
        const nombre = marca.trim();
        if (!nombre) {
            setMensaje({ error: true, texto: 'Ingrese el nombre de la marca.' });
            return;
        }
        if (await enviarFormulario('marcas/registro', { nombre, id: 0 }, 'Marca registrada.')) setMarca('');
    };

    const registrarMedio = async () => {
        if (!tipoSeleccionado) {
            setMensaje({ error: true, texto: 'Seleccione el tipo de medio de pago.' });
            return;
        }
        const guardado = await enviarFormulario('medios-pagos-usuarios/registro', {
            tipo_medio_pago_id: tipoSeleccionado.Id,
            entidad_usuario_id: entidadSeleccionada?.Id ?? '',
            marca_tarjeta_id: marcaSeleccionada?.Id ?? '',
            medio_pago_usuario_id: 0,
        }, 'Medio de pago registrado.');
        if (guardado) {
            setTipoSeleccionado(null);
            setEntidadSeleccionada(null);
            setMarcaSeleccionada(null);
        }
    };

    const cambiarEstado = async (tipo, item) => {
        const activo = item.IsActive;
        const endpointBase = tipo === 'entidades' ? 'entidades' : tipo === 'marcas' ? 'marcas' : 'medios-pagos-usuarios';
        const accion = activo ? 'desactivar' : 'activar';
        await enviarFormulario(`${endpointBase}/${accion}`, { id: item.Id }, activo ? 'Registro desactivado.' : 'Registro activado.');
    };

    const nombreOpcion = (tipo, item) => {
        if (tipo === 'tipos') return item.NombreTipo;
        if (tipo === 'entidades') return item.NombreEntidad;
        return item.NombreMarca;
    };

    const renderSelector = (clave, titulo, seleccionado, opciones, tipo, asignar, opcional = false) => {
        const abierto = selectorAbierto === clave;
        return (
            <View style={styles.selectorGroup}>
                <Text style={[styles.label, { color: estilos.secundario, fontFamily: estilos.regular }]}>{titulo}{opcional ? ' (opcional)' : ''}</Text>
                <TouchableOpacity
                    accessibilityRole="button"
                    style={[styles.selector, { borderColor: estilos.borde }]}
                    onPress={() => setSelectorAbierto(abierto ? '' : clave)}
                >
                    <Text style={{ color: seleccionado ? estilos.texto : estilos.secundario, fontFamily: estilos.regular }}>
                        {seleccionado ? nombreOpcion(tipo, seleccionado) : 'Seleccionar'}
                    </Text>
                </TouchableOpacity>
                {abierto && (
                    <View style={[styles.opciones, { borderColor: estilos.borde }]}>
                        {opcional && (
                            <TouchableOpacity style={styles.opcion} onPress={() => { asignar(null); setSelectorAbierto(''); }}>
                                <Text style={{ color: estilos.secundario, fontFamily: estilos.regular }}>Sin seleccionar</Text>
                            </TouchableOpacity>
                        )}
                        {opciones.filter(opcion => opcion.IsActive !== false).map(opcion => (
                            <TouchableOpacity key={opcion.Id} style={styles.opcion} onPress={() => { asignar(opcion); setSelectorAbierto(''); }}>
                                <Text style={{ color: estilos.texto, fontFamily: estilos.regular }}>{nombreOpcion(tipo, opcion)}</Text>
                            </TouchableOpacity>
                        ))}
                        {opciones.length === 0 && <Text style={[styles.ayuda, { color: estilos.secundario, fontFamily: estilos.regular }]}>No hay opciones registradas.</Text>}
                    </View>
                )}
            </View>
        );
    };

    const renderCatalogo = (tipo, lista, nombre, guardarNombre) => (
        <View style={[styles.seccion, { backgroundColor: estilos.tarjeta, borderColor: estilos.borde }]}>
            <Text style={[styles.tituloSeccion, { color: estilos.texto, fontFamily: estilos.negrita }]}>{tipo === 'entidades' ? 'Entidades' : 'Marcas de tarjeta'}</Text>
            <View style={styles.filaAlta}>
                <TextInput
                    value={nombre}
                    onChangeText={guardarNombre}
                    placeholder={tipo === 'entidades' ? 'Nombre de entidad' : 'Nombre de marca'}
                    placeholderTextColor={estilos.secundario}
                    style={[styles.input, { color: estilos.texto, borderColor: estilos.borde, fontFamily: estilos.regular }]}
                />
                <TouchableOpacity disabled={guardando} onPress={tipo === 'entidades' ? registrarEntidad : registrarMarca} style={[styles.boton, { backgroundColor: estilos.boton }]}>
                    <Text style={{ color: estilos.texto, fontFamily: estilos.negrita }}>AGREGAR</Text>
                </TouchableOpacity>
            </View>
            {lista.map(item => (
                <View key={item.Id} style={[styles.filaLista, { borderTopColor: estilos.borde }]}>
                    <Text style={{ flex: 1, color: estilos.texto, fontFamily: estilos.regular }}>{item[tipo === 'entidades' ? 'NombreEntidad' : 'NombreMarca']}</Text>
                    <TouchableOpacity onPress={() => cambiarEstado(tipo, item)}>
                        <Text style={{ color: item.IsActive ? estilos.acento : estilos.secundario, fontFamily: estilos.negrita }}>{item.IsActive ? 'DESACTIVAR' : 'ACTIVAR'}</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );

    return (
        <ScrollView style={{ flex: 1, backgroundColor: estilos.fondo }} contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
            <Text style={[styles.titulo, { color: estilos.texto, fontFamily: estilos.negrita }]}>Medios de pago</Text>
            {mensaje && <Text style={[styles.mensaje, { color: mensaje.error ? '#b42318' : '#18864b', fontFamily: estilos.regular }]}>{mensaje.texto}</Text>}

            <View style={[styles.seccion, { backgroundColor: estilos.tarjeta, borderColor: estilos.borde }]}>
                <Text style={[styles.tituloSeccion, { color: estilos.texto, fontFamily: estilos.negrita }]}>Nuevo medio de pago</Text>
                {renderSelector('tipo', 'Tipo', tipoSeleccionado, datos.tipos, 'tipos', setTipoSeleccionado)}
                {renderSelector('entidad', 'Entidad financiera', entidadSeleccionada, datos.entidades, 'entidades', setEntidadSeleccionada, true)}
                {renderSelector('marca', 'Marca de tarjeta', marcaSeleccionada, datos.marcas, 'marcas', setMarcaSeleccionada, true)}
                <TouchableOpacity disabled={guardando} onPress={registrarMedio} style={[styles.botonCompleto, { backgroundColor: estilos.boton }]}>
                    <Text style={{ color: estilos.texto, fontFamily: estilos.negrita }}>{guardando ? 'GUARDANDO...' : 'REGISTRAR MEDIO'}</Text>
                </TouchableOpacity>
                {datos.medios.map(item => {
                    const descripcion = [item.TipoMedioPago?.NombreTipo, item.EntidadUsuario?.NombreEntidad, item.MarcaTarjeta?.NombreMarca].filter(Boolean).join(' · ');
                    return (
                        <View key={item.Id} style={[styles.filaLista, { borderTopColor: estilos.borde }]}>
                            <Text style={{ flex: 1, color: estilos.texto, fontFamily: estilos.regular }}>{descripcion}</Text>
                            <TouchableOpacity onPress={() => cambiarEstado('medios', item)}>
                                <Text style={{ color: item.IsActive ? estilos.acento : estilos.secundario, fontFamily: estilos.negrita }}>{item.IsActive ? 'DESACTIVAR' : 'ACTIVAR'}</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>

            {renderCatalogo('entidades', datos.entidades, entidad, setEntidad)}
            {renderCatalogo('marcas', datos.marcas, marca, setMarca)}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contenido: { padding: 16, paddingBottom: 36, gap: 14 },
    titulo: { fontSize: 22, marginBottom: 2 },
    tituloSeccion: { fontSize: 16, marginBottom: 12 },
    seccion: { borderWidth: 1, borderRadius: 8, padding: 14 },
    filaAlta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    input: { flex: 1, minHeight: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10 },
    boton: { minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 8, paddingHorizontal: 12 },
    botonCompleto: { minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 8, marginBottom: 4 },
    selectorGroup: { marginBottom: 10 },
    label: { fontSize: 12, marginBottom: 4 },
    selector: { minHeight: 42, borderWidth: 1, borderRadius: 8, justifyContent: 'center', paddingHorizontal: 10 },
    opciones: { borderWidth: 1, borderRadius: 8, marginTop: 4, overflow: 'hidden' },
    opcion: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#9995' },
    filaLista: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 10 },
    mensaje: { paddingVertical: 4 },
    ayuda: { padding: 10 },
});
