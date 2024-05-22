import {useEffect, useState} from 'react' 
import logo from './logo.svg';
import './App.css';
import 'bulma/css/bulma.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home"
import Layout from "./pages/Layout"
import FirebaseSignin from './signin/FirebaseSignin';
import CourseSchema from "./pages/CourseSchema"
import CourseTemplate from "./pages/CourseTemplate"
import CourseCreateRegistration from "./pages/CourseCreateRegistration"
import FestivalTemplate from "./pages/FestivalTemplate"
import FestivalCreateRegistration from "./pages/FestivalCreateRegistration"
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
          <Route index element={<FirebaseSignin />} />
          <Route path="home" element={<Home />} />
          <Route path="*" element={<NoPage />} />
          <Route path="signin" element={<FirebaseSignin />} />
          {email?
            <>
              <Route path="courseTemplate" element={<CourseTemplate />} />
              <Route path="courseCreateRegistration" element={<CourseCreateRegistration />} />
              <Route path="festivalTemplate" element={<FestivalTemplate />} />
              <Route path="festivalCreateRegistration" element={<FestivalCreateRegistration />} />
              <Route path="festivalChangeRegistration" element={<FestivalChangeRegistration />} />
              <Route path="other" element={<Other />} />
              <Route path="table/:tableName" element={<Table />} />
              <Route path="register" element={<Register />} />
              <Route path="courseSchema" element={<CourseSchema />} />
            </>
          :null}
        </Route>
      </Routes>
    </BrowserRouter>  
  )

}

export default App;
