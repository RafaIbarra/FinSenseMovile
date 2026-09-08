import React,{useState,useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function  Handelstorage (opcion,item,valor){
    let datameses=[
      {numero:1,mes:'Enero'},
      {numero:2,mes:'Febrero'},
      {numero:3,mes:'Marzo'},
      {numero:4,mes:'Abril'},
      {numero:5,mes:'Mayo'},
      {numero:6,mes:'Junio'},
      {numero:7,mes:'Julio'},
      {numero:8,mes:'Agosto'},
      {numero:9,mes:'Septiembre'},
      {numero:10,mes:'Octubre'},
      {numero:11,mes:'Novimiembre'},
      {numero:12,mes:'Diciembre'},

    ]

    
    async function agregar(data){
        
        // localStorage.setItem('userData', JSON.stringify(data))
        await AsyncStorage.setItem('userData', JSON.stringify(data));

        const agregarfechas= async ()=>{

          const fechaActual = new Date();
          const mesactual = parseInt(fechaActual.getMonth() + 1);
          const añoActual = parseInt(fechaActual.getFullYear());
          
          const nombremes=datameses.find(mesObj => mesObj.numero === mesactual)
          
          const datadate={
            datames:mesactual,
            dataanno:añoActual,
            dataperiodo:añoActual,
            nombremesactual:nombremes.mes
          }
          
          const datastats={
            dataanno:añoActual
          }
          
           
          
          await AsyncStorage.setItem("userdate", JSON.stringify(datadate));
          await AsyncStorage.setItem("userstats", JSON.stringify(datastats));
        }
        await agregarfechas()

    }

    const obtener= async()=>{
        
        //const userLocalStorageData = JSON.parse(localStorage.getItem('userData'));
        const userJSON = await AsyncStorage.getItem("userData");
        const userLocalStorageData = JSON.parse(userJSON);
        if (userLocalStorageData !== null){
          return {
            token: userLocalStorageData.token,
            refreshToken: userLocalStorageData.refreshToken,
            sesion: userLocalStorageData.sesion,
            user_name: userLocalStorageData.user_name,
            
          };
        }else{
          return {
            token: false,
            refreshToken: false,
            sesion: false,
            user_name: false,
            
          };
        }
    }

  const obtenerdate= async()=>{
      const valordate= await AsyncStorage.getItem("userdate");
      const userLocalStorageDate = JSON.parse(valordate);
      
      if (userLocalStorageDate !== null){
        return {
          datames: userLocalStorageDate.datames,
          dataanno: userLocalStorageDate.dataanno,
          dataperiodo: userLocalStorageDate.dataperiodo,
          nombremesactual: userLocalStorageDate.nombremesactual,
          
          
        };
      }else{
        return {
          
          dataanno: 0,
          
        };
      }
    }

  const borrar= async()=>{
      
    await AsyncStorage.removeItem("userdate")
    await AsyncStorage.removeItem("userData")
    await AsyncStorage.removeItem("userstats")

    }

  const actualizardate = async(item)=>{
      
     
      await AsyncStorage.removeItem("userdate")
      
      
      await AsyncStorage.setItem("userdate", JSON.stringify(item));
    }


  if (opcion === 'agregar') {
      agregar(item);
    }
  else if(opcion === 'obtener') {
      let resultado=obtener()
      return resultado
    }
  else if(opcion === 'obtenerdate') {
      let resultado=obtenerdate()
      return resultado
    }
  else if(opcion === 'borrar') {
      borrar()
    }
  else if(opcion === 'actualizardate') {
      actualizardate(item)
  }

}
export default Handelstorage