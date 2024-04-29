import React from "react"
import { getAuth, signOut} from 'firebase/auth';
import {Navigate} from "react-router"
const TEXTS =  {
  LOGGED_OUT:{
    SV:'Du är utloggad',
    EN:'You are logged out',
    ES:'You are logged out',
  }
}


const firebaseEnabled = process.env.REACT_APP_FIREBASE_API_KEY !== undefined

const styles = {
    container:{
      display:'flex',
      alignItems:'center',
      flexDirection:'column',
      justifyContent:'center',
      fontSize:24,
      fontWeight:200,
    },
  }
  
  
  

export default () => {
    if (firebaseEnabled) {
      const auth = getAuth()
      signOut(auth)
    }  
    return(
        <h1 style={styles.container}>
             You are logged off
        </h1>
    )
}