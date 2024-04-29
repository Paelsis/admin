import React, {useState} from "react"
import {withRouter} from "react-router"
import {getAuth, sendPasswordResetEmail} from 'firebase/auth'
import Button from '@mui/material/Button';

const styles = {
  container:color=>({
    display:'flex',
    alignItems:'center',
    flexDirection:'column',
    justifyContent:'center',
    fontSize:24,
    fontWeight:200,
    height:'50vh',
    color,
  }),
  button: color=>({
    border:'2px solid ' + color,
    padding:3,
    color,
  }),
  input: color=>({
    fontSize:24,
    fontWeight:200,
    outline: 0,
    border:'none',
    borderBottom: '2px solid ' + color,
    '&:hover':{
      backgroundColor:{color:'white', backgroundColor:'green'}
    },
    backgroundColor:'transparent',
    color,
    borderColor:color,
  }),
  reset:{
    fontSize:10, 
  },
}

const FirebaseResetPassword = () =>  {
  const [email, setEmail] = useState(undefined)
  const [mailSent, setMailSent] = useState(undefined)
  const auth = getAuth()
  const handleChange = e => setEmail(e.target.value)
  const handleSubmit = e => {
    e.preventDefault()
    sendPasswordResetEmail(auth, email).then(() => {
        setMailSent(true)
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(error)
    })
  }
  const color={color:'white', backgroundColor:'green'} 
  return(
    <div style={styles.container(color)}>
      {mailSent?
        <h4>Check for a mail that contains a link to reset your password</h4>
      :
        <>
          <h4>Please send me an email with a link to reset my password</h4>
          <form onSubmit={handleSubmit}>
              <label>
                <input name='email' type='email' placeholder='Please enter your email' onChange={handleChange} />
              </label>
              <p/>
              <Button variant="outlined"  type="submit" style={styles.button(color)}>
                  Submit    
              </Button>    
          </form>
        </>
      }
    </div>
  )
}  

export default FirebaseResetPassword