import React, {useState, useEffect, useContext} from "react"
import { getAuth, signOut, onAuthStateChanged} from 'firebase/auth';
import {Redirect} from "react-router"
import {AuthContext} from "../signin/FirebaseAuth"
import { Tooltip, IconButton, Button} from '@mui/material';



const FirebaseSignout = props => {
    const auth = getAuth()
    const [email, setEmail] = useState()
    useEffect(()=>onAuthStateChanged(auth, user => {
          if (user) {
            setEmail(user.email)
          }  
      }), [])
    const handleClick = () => {
        signOut(auth)
    }    
    return(
        <div style={{display:'flex', width:'100%', textAlign:'center', verticalAlign:'center'}}>
            <h1>Firebase Signout</h1>
            <Button type="submit" variant="outlined"  size='small' style={{borderWidth:1, fontWeight:600,  borderRadius:4}} onClick={()=>handleClick()}>
                    Signout     
            </Button>    
        </div>    
    )
}


export default FirebaseSignout