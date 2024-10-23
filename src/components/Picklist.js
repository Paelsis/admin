import { CircularProgress, styleCircular } from '@mui/material'
import {useState} from 'react'

// Note that if valueName is set the picklist returns record[valueName], otherwise it returns the record
export const PicklistButtonGroups = ({groups, labelName, valueName, value, handleClick, close}) => {
    const [active, setActive] = useState()

    const onClick = (e, val) => {
        e.preventDefault()
        handleClick(val)
        if (close) {
            setActive(undefined)
        } 
    }
    return(
        groups?
            Object.keys(groups).map(key =>
                <div className={active===key?"dropdown is-active":"dropdown"}>
                    &nbsp;&nbsp;
                    <div className="dropdown-trigger">
                        <button 
                            className="button"     
                            style={{color:'black', borderColor:'black', background:'transparent'}} 
                            aria-haspopup="true" 
                            aria-controls="dropdown-menu" 
                            onClick={()=>setActive(active?undefined:key)}
                        >
                            <span>{key?key:'Dropdown'}</span>
                            <span className="icon is-small">
                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                        <div className="dropdown-content">
                                    <>
                                        {groups[key].map(it=>
                                        <a href="#" 
                                            className={value?value[valueName]===it[valueName]?"dropdown-item is-active":"dropdown-item":"dropdown-item"} 
                                            onClick={e=>onClick(e, (valueName?it[valueName]:it))}
                                        >
                                            {it[labelName]}
                                        </a>
                                        )}
                                    </>
                        </div>
                    </div>
            </div>    
            )    
    :<CircularProgress />
  )
}



// Note that if valueName is set the picklist returns record[valueName], otherwise it returns the record
export const PicklistGroups = ({labelButton, groups, labelName, valueName, value, handleClick, close}) => {
    const [active, setActive] = useState()

    const onClick = (e, val) => {
        e.preventDefault()
        handleClick(val)
        if (close) {
            setActive(undefined)
        } 
    }
    return(
        <>

        <div className={active?"dropdown is-active":"dropdown"}>
            <div className="dropdown-trigger">
                <button 
                    className="button"     
                    style={{color:'black', borderColor:'black', background:'transparent'}} 
                    aria-haspopup="true" 
                    aria-controls="dropdown-menu" 
                    onClick={()=>setActive(!active)}
                >
                    <span>{labelButton?labelButton:'Dropdown'}</span>
                    <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    {groups?
                        Object.keys(groups).map(key =>
                            <>
                                <hr className="dropdown-divider" />
                                {groups[key].map(it=>
                                <a href="#" 
                                    className={value?value[valueName]===it[valueName]?"dropdown-item is-active":"dropdown-item":"dropdown-item"} 
                                    onClick={e=>onClick(e, (valueName?it[valueName]:it))}
                                >
                                    {it[labelName]}
                                </a>
                                )}
                            </>
                        )    
                    :
                        null
                    }                        
                </div>
            </div>
    </div>    
    </>
  )
}

// Picklist with reload counter
export default ({labelButton, picklist, labelName, valueName, value, handleClick, close}) => {
    const [active, setActive] = useState()

    const onClick = (e, val) => {
        e.preventDefault()
        handleClick(val)
        if (close) {
            setActive(undefined)
        } 
    }
    
    return(
        <>

        <div className={active?"dropdown is-active":"dropdown"}>
            <div className="dropdown-trigger">
                <button 
                    className="button" 
                    style={{color:'black', borderColor:'black', background:'transparent'}} 
                    aria-haspopup="true" 
                    aria-controls="dropdown-menu" 
                    onClick={()=>setActive(!active)}
                >
                    <span>{labelButton?labelButton:'Dropdown'}</span>
                    <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu" >
                <div 
                    className="dropdown-content" 
                    style={{color:'black', background:'transparent'}} 
                >
                    {picklist?
                        picklist.map((it,index) =>
                            <a href="#"  
                                style={{color:'black',  backgroundColor:(index%2===0)?'rgba(111, 111, 111, 0.3)':'rgba(111, 111, 111, 0.2)'}}
                                className={value?value[valueName]===it[valueName]?"dropdown-item is-active":"dropdown-item":"dropdown-item"} 
                                onClick={e=>onClick(e, (valueName?it[valueName]:it))}
                            >
                                {it[labelName]}
                            </a>
                        )
                    :
                        null
                    }                        
                </div>
            </div>
    </div>    
    </>
  )
}
