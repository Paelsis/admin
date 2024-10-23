import React, {useState, useEffect, useContext} from "react"
import { getAuth, signOut, onAuthStateChanged} from 'firebase/auth';
import {AuthContext} from "../signin/FirebaseAuth"
import { Tooltip, IconButton, Button} from '@mui/material';



const FirebaseSignout = props => {
    const auth = getAuth()
    useEffect(()=>onAuthStateChanged(auth, user => {
          if (user) {
          }  
        }
      ), [])

    const email = sharedState.email  
    
    const handleClick = () => {
      signOut(auth)
    }    
    return(
        <>
            {email?
                <div style={{display:'flex', width:'100%', textAlign:'center', verticalAlign:'center'}}>
                    <h1>Firebase Signout</h1>
                    <Button type="submit" variant="outlined"  size='small' style={{borderWidth:1, fontWeight:600,  borderRadius:4}} onClick={()=>handleClick()}>
                            Signout     
                    </Button>    
                </div>    
            :<h1>Not signed in</h1>}    
        </>
    )
}


export default FirebaseSignout