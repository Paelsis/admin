import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom"
import {isNormalVariable} from '../services/functions'
import {serverFetchData} from "../services/serverFetch"
import {GroupByFlat} from "./GroupByRecursive"
import CirkularProgress from './CirkularProgress'



// CourseSchema
export default  ({url, groupByArr, cols}) => {
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
            {list?
                <GroupByFlat depth={0} groupByArr={groupByArr} cols={cols} list={list} />
            :
                <CirkularProgress color={'green'} style={{margin:'auto'}} />
            }
        </div>
    )
}

