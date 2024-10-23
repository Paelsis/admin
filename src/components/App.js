import {useEffect, useState} from 'react' 
import {SharedStateProvider} from './store'

import logo from './logo.svg';
//import "./index.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home"
import Layout from "./pages/Layout"
import FirebaseSignin from './signin/FirebaseSignin';
import CourseTemplate from "./pages/CourseTemplate"
import CourseRegistration from "./components/CourseRegistration"
import CourseSchema from "./pages/CourseSchema"
import ListCourseRegistrations from "./pages/ListCourseRegistrations"
import CourseSchemaMenu from "./pages/CourseSchemaMenu"
import FestivalTemplate from "./pages/FestivalTemplate"
import FestivalSchema from "./pages/FestivalSchema"
import FestivalChangeRegistration from "./pages/FestivalChangeRegistration"
import ListFestivalRegistrations from "./pages/ListFestivalRegistrations"
import ListFestivalRegistrationWorkshops from "./pages/ListFestivalRegistrationWorkshops"
import Other from "./pages/Other"
import Table from "./pages/Table"
import Text from "./pages/Text"
import Txt from "./pages/Txt"
import Image from "./pages/Image"
import Html from "./components/HtmlView"
import ListFestivalRegistrations from "./components/ListFestivalRegistrations"
import Menu from "./components/Menu"
import NoPage from "./pages/NoPage"
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import useSharedState from '../store'
import 'bulma/css/bulma.min.css';
import './App.css';

function App() {
  const auth = getAuth()
  const [email, setEmail] = useState()
  const [sharedState, setSharedState] = useSharedState()
  useEffect(()=>
      onAuthStateChanged(auth, user => {
          if (user) {
            setEmail(user.email)
          }  
        }
      ), [])
  
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
                <Route path="courseRegistration" element={<CourseRegistration />} />
                <Route path="festivalTemplate" element={<FestivalTemplate />} />
                <Route path="FestivalSchema" element={<FestivalSchema />} />
                <Route path="festivalChangeRegistration" element={<FestivalChangeRegistration />} />
                <Route path="table/:tableName" element={<Table />} />
                <Route path="courseSchema" element={<CourseSchema />} />
                <Route path="listCourseRegistrations" element={<ListCourseRegistrations />} />
                <Route path="listFestivalRegistrations" element={<ListFestivalRegistrations />} />
                <Route path="listFestivalRegistrationWorkshops" element={<ListFestivalRegistrationWorkshops />} />
                <Route path="courseSchemaMenu" element={<CourseSchemaMenu />} />
                <Route path="text" element={<Text />} />
                <Route path="txt" element={<Txt />} />
                <Route path="image" element={<Image />} />
                <Route path="html" element={<Html />} />
                <Route path="menu" element={<Menu />} />
                <Route path="other" element={<Other />} />
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
