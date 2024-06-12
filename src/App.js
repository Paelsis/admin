import {useEffect, useState} from 'react' 
import {SharedStateProvider} from './store'

import logo from './logo.svg';
//import "./index.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home"
import Layout from "./pages/Layout"
import FirebaseSignin from './signin/FirebaseSignin';
import CourseTemplate from "./pages/CourseTemplate"
import CourseCreateRegistration from "./pages/CourseRegistration"
import CourseSchema from "./pages/CourseSchema"
import CourseSchemaMenu from "./pages/CourseSchemaMenu"
import FestivalTemplate from "./pages/FestivalTemplate"
import FestivalRegistration from "./pages/FestivalRegistration"
import FestivalChangeRegistration from "./pages/FestivalChangeRegistration"
import Other from "./pages/Other"
import Table from "./pages/Table"
import Text from "./pages/Text"
import Image from "./pages/Image"
import Registration from "./components/Registration"
import NoPage from "./pages/NoPage"
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import 'bulma/css/bulma.min.css';
import './App.css';

function App() {
  const auth = getAuth()
  const [email, setEmail] = useState()
  useEffect(()=>onAuthStateChanged(auth, user => {
    if (user) {
      setEmail(user.email)
    }  
  }), [])

  return (
    <div className='App content'>
      <BrowserRouter>
        <SharedStateProvider>
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
                <Route path="festivalCreateRegistration" element={<FestivalRegistration />} />
                <Route path="festivalChangeRegistration" element={<FestivalChangeRegistration />} />
                <Route path="other" element={<Other />} />
                <Route path="table/:tableName" element={<Table />} />
                <Route path="registration" element={<Registration />} />
                <Route path="courseSchema" element={<CourseSchema />} />
                <Route path="courseSchemaMenu" element={<CourseSchemaMenu />} />
                <Route path="text" element={<Text />} />
                <Route path="image" element={<Image />} />
              </>
            :null}
          </Route>
        </Routes>
        </SharedStateProvider>
      </BrowserRouter>  
    </div>
  )

}

export default App;
