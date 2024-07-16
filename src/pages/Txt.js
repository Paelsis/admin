import {useState, useEffect} from "react"
import { useLocation } from 'react-router-dom';
import {serverFetchData} from '../services/serverFetch'
import HtmlView from '../components/HtmlView'
import {compareFunc} from '../components/EditText' 
import {useSharedState} from '../store'
const DEFAULT_PROPS = {
    groupId:'Course',
    textId:'AV1_16V',
    language:'SV'
}    

export default props => {
    const location = useLocation()
    const [sharedState, ] = useSharedState()

    const [list, setList] = useState()
    
    const handleReply = reply => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            const currentList = data.result.sort(compareFunc)
            setList(currentList)
        } else {
            alert('ERROR: Failed to fetch text')
        }   
    }

    useEffect(()=>{ 
        serverFetchData('/fetchRows?tableName=tbl_text', handleReply)
    },[])

    return(
        <>
        {JSON.stringify(sharedState.list)}
        {list?<HtmlView {...DEFAULT_PROPS} list={list} setList={setList} />:null}
        </>
     )    
}


