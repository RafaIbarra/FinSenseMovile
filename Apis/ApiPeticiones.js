
import Handelstorage from "../Storage/HandelStorage";
import API_BASE from "./ApiBase";
async function Generarpeticion(endpoint, metodo, bodyoptions) {
  
    let data = {};
    let resp = 0;
    let datos = {};
    let requestOptions = {};
    let tiempoespera=10000
    let resp_correcta=false
    const datosstarage = await Handelstorage('obtener');
  
    const tokenstorage = datosstarage['token'];
    const sesionstorage = datosstarage['sesion'];
    // console.log(sesionstorage)
    // console.log(tokenstorage)
    
    
  
    if (metodo.toUpperCase() === 'GET') {
      requestOptions = {
        method: metodo.toUpperCase(),
        headers: {
          'Authorization': `Bearer ${tokenstorage}`,
          'X-SESSION-USER':sesionstorage
        }
      };
    } else {
    
      requestOptions = {
          method: metodo.toUpperCase(),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenstorage}`,
            'X-SESSION-USER':sesionstorage
          },
          body: JSON.stringify(bodyoptions)
        };
      }
    
  
    try {
      // Configuramos un límite de tiempo (timeout) de 10 segundos
      const timeoutPromise = new Promise((_, reject) =>
        
        setTimeout(  () => reject(new Error('Tiempo expirado para respuesta')), tiempoespera)
      );
  
      // Competimos entre la solicitud fetch y el temporizador
      const response = await Promise.race([
        fetch(`${API_BASE}/${endpoint}`, requestOptions),
        timeoutPromise
      ]);
  
      data = await response.json();
      resp = response.status;
      if ([200, 201].includes(resp)) {
        resp_correcta = true;
      }
      
  
    } catch (error) {
      // Si ocurre un error o el tiempo expira, retornamos un error predefinido
      data =  { error: "Tiempo expirado para respuesta o error en la solicitud" };
      resp = 500;
    }
  
    datos = { data, resp,resp_correcta };
    
    return datos;
  }
  
  export default Generarpeticion;