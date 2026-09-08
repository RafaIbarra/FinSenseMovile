
import API_BASE from './ApiBase';

async function RegistroUser(nombre,apellido,usuario,correo ,password) {
  const endpoint = 'admin/RegistroUsuario/';
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre:nombre,
      apellido:apellido,
      user: usuario.toLowerCase(),
      correo:correo,
      password: password
    //   ,version: version
    //   ,pushtoken: pushToken
    }),
  };

  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, requestOptions);
    const status = response.status;
    const text = await response.text();
    let error = null;
    let data = null;

    // Intentar parsear como JSON
    try {
      data = JSON.parse(text);
      error = data.error || data.message || 'Error desconocido';
    } catch (e) {
      // No es JSON: detectar si es HTML
      const trimmed = text.trim();
      if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || /<body|<html/i.test(trimmed)) {
        error = 'Error en la conexión al servidor';
      } else {
        error = text || 'Error sin cuerpo';
      }
    }

    
    return { status, error, data };
  } catch (fetchError) {
    console.error('Error de red:', fetchError.message);
    return { status: 0, error: fetchError.message, data: null };
  }
}
export default RegistroUser
