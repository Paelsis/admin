import {useEffect} from 'react'
import { getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
import { Outlet, Link } from "react-router-dom";
import { dropdownListCourse, dropdownListFestival, dropdownListOther} from "../services/dropdownLists";
import {useState} from "react"
import EditIcon from '@mui/icons-material/AppRegistration'
import {IconButton} from '@mui/material';
import ElderlyIcon from '@mui/icons-material/Elderly';
import BackHandIcon from '@mui/icons-material/BackHand';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import { useNavigate }  from 'react-router-dom';

// Layout
export default () => {
  const [isActive, setIsActive] = useState(false)
  const [email, setEmail] = useState()
  const handleLogin = () => alert('handleLogin')
  const navigate = useNavigate()
  const auth = getAuth()
  useEffect(()=>onAuthStateChanged(auth, user => {
    if (user) {
      setEmail(user.email)
    }  
  }), [])

  


  return (
    <>
    <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
        <IconButton className="button is-primary">
          {email?<ElderlyIcon color="action" />:<SelfImprovementIcon style={{color:'hsl(171, 100%, 41%)'}} />}
        </IconButton>
        <a
            onClick={() => {
              setIsActive(!isActive);
            }}
            role="button"
            className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div 
          id="navbarBasicExample" 
          className={`navbar-menu ${isActive ? "is-active" : ""}`}
        >
            {email?
            <div className="navbar-start">
            <Link to={'/home'} className="navbar-item">
              Home
            </Link>
            <Link to={'/table/tbl_teacher'} className="navbar-item">
                  Teacher
            </Link>

            <Link to={'/table/tbl_site'} className="navbar-item">
                  Site
            </Link>


            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                Courses
              </a>

              <div className="navbar-dropdown">
                {dropdownListCourse.map(it=>
                  <Link to={it.link?it.link:'/'} className="navbar-item">
                    {it.label}
                  </Link>
                )}
              </div>
            </div>

            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                Festival
              </a>

              <div className="navbar-dropdown">
                {dropdownListFestival.map(it=>
                  <Link to={it.link?it.link:'/'} className="navbar-item">
                    {it.label}
                  </Link>
                )}
              </div>
            </div>

            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                Other
              </a>

              <div className="navbar-dropdown">
                {dropdownListOther.map(it=>
                <Link to={it.link?it.link:'/'} className="navbar-item">
                  {it.label}
                </Link>)}
              </div>
            </div>

          </div>
          :null}

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                {email?
                  <a className="button is-dark" onClick={()=>{signOut(auth); setEmail(undefined); navigate('/signin')}}>
                    Signout
                  </a>
                :
                  <a className="button is-primary" onClick={()=>navigate('/signin')}>
                    Signin
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  )
};
