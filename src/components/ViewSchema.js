import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom"
import {isNormalVariable} from '../services/functions'
import {serverFetchData} from "../services/serverFetch"
import {ViewGroupRecursive} from "../components/ViewGroup"

// ViewSchema
export default  ({url, groupByArr, cols, buttons}) => {
    const [list, setList] = useState()
    const handleReply = data => {
        if (data.status === 'OK' || data.status === 'true') {
            setList(data.result.filter(it=>isNormalVariable(it)))
        } else {
            alert(data.message)
        }
    }

    useEffect(()=>{
        serverFetchData(url, handleReply)
    },[])

    return(
        <div>
            <h1>Schema</h1>
            {list?
                <ViewGroupRecursive depth={0} groupByArr={groupByArr} cols={cols} list={list} buttons={buttons} />
            :
                <h1>No List</h1>
            }
        </div>
    )
}

