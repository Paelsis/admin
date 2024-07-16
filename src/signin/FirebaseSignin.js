import React, {useCallback, useContext, useEffect, useState} from "react"
import { Navigate, useNavigate } from 'react-router-dom';
import firebaseApp from '../services/firebaseApp'
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth';
import Button from '@mui/material/Button';

const styles = {
  container:{
    display:'flex',
    alignItems:'center',
    flexDirection:'column',
    justifyContent:'center',
    color:{color:'white', backgroundColor:'green'},
    fontSize:24,
    fontWeight:200,
    height:'50vh'
  },
  button: color=>({
    color,
    border:'2px solid ' + color,
    padding:5
  }),
  input: color=>({
    color,
    borderColor:color,
    backgroundColor:'transparent',
    fontSize:24,
    fontWeight:200,
    outline: 0,
    border:'none',
    borderBottom: '2px solid ' + color,
    '&:hover':{
      backgroundColor:'red'
    }
  }),
  reset:{
    fontSize:10, 
  },
}

const FirebaseSignin = () => {
  const navigate = useNavigate()
  const [statusColor, setStatusColor] = useState({color:'white', backgroundColor:'green'})
  const [credentials, setCredentials] = useState(undefined)
  const [uid, setUid] = useState(undefined)
  const auth = getAuth()

  useEffect(()=>onAuthStateChanged(auth, user => {
    if (user) {
      navigate('/home')
    }  
  }), [])

  const handleSignin = e => {
    e.preventDefault()
    setStatusColor('grey') 
  
  if (credentials?(credentials.email && credentials.password):false) {
    signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then(userCredential => {
        // Signed in 
        const uid = userCredential.user.uid;
        setUid(uid)
        setStatusColor({color:'white', backgroundColor:'green'})
        navigate('/home')
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setStatusColor('red')
      alert(error.message)
    });
    } else {
      alert('Fill in credentials')
    }
  }  

  const handleSignout = ()=>{setUid(undefined); signOut(auth)}
  const handleChange = e =>setCredentials({...credentials, [e.target.name]:e.target.value?e.target.value:''})
  const inputStyle = styles.input(statusColor)
  const buttonStyle = styles.button(statusColor)
  return(
    uid===undefined?
      <>
        <div style={styles.container}>
            <form  onSubmit={handleSignin}>
                 <p/>  
                <label>
                Logga in med e-mail och lösenord<p/>
                </label>
                <input style={inputStyle} name='email' type='email' placeholder='E-mail' onChange={handleChange} />
                <p/>
                <input style={inputStyle} name='password' type='password' placeholder='Lösenord' onChange={handleChange} />
                <p/>
                <Button variant="outlined" color="inherit" type="submit" >
                  Logga in     
                </Button>    
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;
                <Button variant="outlined" color="inherit"  onClick={() => navigate('/resetPassword')}>
                  Återställ lösenord
                </Button>          
            </form>
          </div>
        </>
    :
        <div style={styles.container}>
          <h4>You are signed in</h4>
          <Button style={buttonStyle} variant="outlined" onClick={() => handleSignout()}>
              Signout
          </Button>          
        </div>
      
  )
}  
 

export default FirebaseSignin