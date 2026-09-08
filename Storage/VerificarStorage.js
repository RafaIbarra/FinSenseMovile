import React from "react";
import Handelstorage from "./HandelStorage";

const ComprobarStorage=async ()=>{
    
    const datosstarage = await Handelstorage('obtener');
    const tokenstorage = datosstarage['token'];
  
    if (tokenstorage) {
        // return true
        
        datosstarage['user_name']
        return {
            datosesion:true,

            user_name:datosstarage['user_name']
        }
    } else {
        return {
            datosesion:false,
            user_name:''
        }
    }
      
}

export default ComprobarStorage