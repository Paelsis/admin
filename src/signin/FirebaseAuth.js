import React, {useEffect, useState} from "react"
import { getAuth, onAuthStateChanged} from 'firebase/auth';
export const AuthContext = React.createContext()

const firebaseEnabled = "AIzaSyCniLg3N-jF1DQava7qoeUZmvX5a-3rwbY"



// https://www.youtube.com/watch?v=unr4s3jd9qA
const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    useEffect(()=>{
        if (firebaseEnabled) {
            const auth = getAuth()
            onAuthStateChanged(auth, setUser)
        }
    }, [])

    return ( 
        <AuthContext.Provider value={{user}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider