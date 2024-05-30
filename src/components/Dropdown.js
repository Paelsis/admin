import {useState} from 'react'
import { useNavigate }  from 'react-router-dom';

export const DropdownGroupBy = ({name, list, groupBy}) => {
    const [active, setActive] = useState()
    const [isActive, setIsActive] = useState(false)
    const navigate = useNavigate()
    const groups = !recursionReady?Object.groupBy(list, it=>(it[groupBy])):[]
    const keys = groups?Object.keys(groups):[]

    const handleClick = (key, index) => {
        const groupList = groups[key]
        const tableName=groupList[index].tableName?groupList[index].tableName:undefined
        const route = groupList[index].route?groupList[index].route:undefined
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
                <list className="dropdown-content">
                    {keys.map((key)=>
                        <>
                            <hr className="dropdown-divider">
                                {key}
                            </hr>    
                            {groups[key].map((it, index)=>
                                <>
                                    <li className={index===active?"dropdown-item is-active":"dropdown-item"} onClick={()=>handleClick(key, index)}>{it.label}</li>
                                </>
                            )}
                        </>
                    )}    
                </list>
            </div>
        </div>
    </>
)
}

// Show Drop down list defined by list
const Dropdown = ({name, list}) => {
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
            <list className="dropdown-content">
                {list.map((it, index)=>
                <>
                    <li className={index===active?"dropdown-item is-active":"dropdown-item"} onClick={()=>handleClick(index)}>{list[index].label}</li>
                    {it.hasDivider?<hr className="dropdown-divider" />:null}
                    </>
                )}
            </list>
        </div>
        </div>
    </>
)
}

export default Dropdown
