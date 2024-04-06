import {useState} from 'react'
import { useNavigate }  from 'react-router-dom';

// Show Drop down list defined by list
const Dropdown = ({key, name, list, value, setValue}) => {
    const [active, setActive] = useState()
    const [isActive, setIsActive] = useState(false)
    const navigate = useNavigate()

    const handleClick = index => {
        const tableName=list[index].tableName?list[index].tableName:undefined
        const route = list[index].route?list[index].route:undefined
        setActive(index)

        if (route) {
            navigate(route, {state:{
                tableName
            }})
        } else {
            alert('No route given for index:' + index)
        }    
    }     

return(    
    <>
        <div className={isActive?"dropdown is-active":'dropdown'}>
        <div className="dropdown-trigger">
            <button className="button" aria-haspopup="true" aria-controls="dropdown-menu"  onClick={()=>setIsActive(isActive?undefined:true)}> 
                <span>{name?name:'Dropdown button'}</span>
                <span className="icon is-small">
                    <i className="fas fa-angle-down" aria-hidden="true"></i>
                </span>
            </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
                {list.map((it, index)=>
                <>
                    <div className={index===active?"dropdown-item is-active":"dropdown-item"} onClick={()=>handleClick(index)}>{list[index].label}</div>
                    {it.hasDivider?<hr className="dropdown-divider" />:null}
                    </>
                )}
            </div>
        </div>
        </div>
    </>
)
}

export default Dropdown
