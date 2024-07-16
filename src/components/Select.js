import {useEffect, useState} from 'react'
import {serverFetchData} from "../services/serverFetch"
import {uniqueObjectList} from "../services/functions"

const compareSequenceNumber = (a,b) => {
    if (a.sequenceNumber && b.sequenceNumber) {
        return a.sequenceNumber - b.sequenceNumber
    } else if (a.id && b.id) {
        return a.id - b.id
    } else {
        return 0
    }
}

const Select =  ({tableName, name, selectLabel, selectValue, value, handleClick, unique, style, reloadCounter}) => {
    const [list, setList] = useState([])
    const [active, setActive] = useState(false)
    const handleReply = reply => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK' || data.status === 'true' || data.status) {
            const currList = (unique?uniqueObjectList(data.result, selectLabel):data.result).sort(compareSequenceNumber)
            setList(currList)
        } else {
            alert('ERROR: Call to get data from table ' + tableName + ' failed. Message:' + data.message?data.message:'')
        }
    }    

    useEffect(()=>{
        const url = '/fetchRows?tableName=' + tableName
        serverFetchData(url, handleReply)
    }, [tableName, reloadCounter?reloadCounter:0])

    const onClick = (e, val) => {
        e.preventDefault()
        // alert(val)
        handleClick(val)
    }
    
    return(
        <>
            <div className={active?"select is-active":"select"}>
            <select name={name} value={value?value:''} style={style?style:{}} onClick={e=>onClick(e, e.target.value)}>
                <option value={value[name]?value[name]:''} disabled>Pick from list</option>
                {list.sort(compareSequenceNumber).map(it=>
                   <option value={it[selectValue]} style={style?style:{}} className={it[selectValue]===value[name]?"is-active":""}>{it[selectLabel]}</option>
                )}
            </select>
            </div>
        </>
  )
}

export default Select