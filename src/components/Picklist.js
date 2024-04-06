import {useEffect, useState} from 'react'
import {serverFetchData_SLIM4} from "../services/serverFetch"
import {uniqueObjectList} from "../services/functions"

export default ({labelButton, tableName, labelName, valueName, value, handleClick, unique, close}) => {
    const [list, setList] = useState([])
    const [active, setActive] = useState()

    const handleReply = reply => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK' || data.status === 'true' || data.status) {
            setList(unique?uniqueObjectList(data.result, labelName):data.result)
        } else {
            alert('ERROR: Call to get data from table ' + tableName + ' failed. Message:' + data.message?data.message:'')
        }
    }    

    useEffect(()=>{
        const url = '/fetchRows?tableName=' + tableName
        serverFetchData_SLIM4(url, handleReply)
    }, [tableName])

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
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={()=>setActive(!active)}>
                    <span>{labelButton?labelButton:'Dropdown'}</span>
                    <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    {list?
                        list.map(it =>
                            <a href="#" 
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