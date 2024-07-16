import {useEffect, useState} from 'react'
import {serverFetchData} from "../services/serverFetch"
import {uniqueObjectList} from "../services/functions"


// Note that if valueName is set the picklist returns record[valueName], otherwise it returns the record
export const PicklistGroupBy = ({labelButton, picklist, tableName, groupBy, labelName, valueName, value, handleClick, unique, close, reloadCounter}) => {
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
        if (picklist) {
            setList(unique?uniqueObjectList(picklist, labelName):picklist)
        } else if (tableName) {
            const url = '/fetchRows?tableName=' + tableName
            serverFetchData(url, handleReply)
        } else {
            alert('No tableName and inputList')    
        }    
    }, [tableName, picklist, reloadCounter?reloadCounter:0])

    const onClick = (e, val) => {
        e.preventDefault()
        handleClick(val)
        if (close) {
            setActive(undefined)
        } 
    }
    const groups = Object.groupBy(list, it=>(it[groupBy]))
    const keys = groups?Object.keys(groups):[]
    
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
                    {keys?
                        keys.map(key =>
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

export default ({labelButton, picklist, tableName, labelName, valueName, value, handleClick, unique, close, reloadCounter}) => {
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
        if (picklist) {
            setList(unique?uniqueObjectList(picklist, labelName):picklist)
        } else {    
            const url = '/fetchRows?tableName=' + tableName
            serverFetchData(url, handleReply)
        }    
    }, [tableName, reloadCounter?reloadCounter:0])

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
                    {list?
                        list.map((it,index) =>
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
