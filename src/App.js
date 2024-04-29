import {useEffect, useState} from 'react' 
import logo from './logo.svg';
import './App.css';
import 'bulma/css/bulma.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home"
import Layout from "./pages/Layout"
import FirebaseSignin from './signin/FirebaseSignin';
import SchemaCourse from "./pages/SchemaCourse"
import FestivalTemplate from "./pages/FestivalTemplate"
import FestivalChangeRegistration from "./pages/FestivalChangeRegistration"
import Other from "./pages/Other"
import Table from "./pages/Table"
import Register from "./components/Register"
import NoPage from "./pages/NoPage"
import { getAuth, onAuthStateChanged} from 'firebase/auth';

function App() {
  const auth = getAuth()
  const [email, setEmail] = useState()
  useEffect(()=>onAuthStateChanged(auth, user => {
    if (user) {
      setEmail(user.email)
    }  
  }), [])

  return (
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="*" element={<NoPage />} />
          <Route path="signin" element={<FirebaseSignin />} />
          {email?
            <>
              <Route path="festivalTemplate" element={<FestivalTemplate />} />
              <Route path="festivalChangeRegistration" element={<FestivalChangeRegistration />} />
              <Route path="other" element={<Other />} />
              <Route path="table/:tableName" element={<Table />} />
              <Route path="register" element={<Register />} />
              <Route path="schemaCourse" element={<SchemaCourse />} />
            </>
          :null}
        </Route>
      </Routes>
    </BrowserRouter>  
  )

}

export default App;
