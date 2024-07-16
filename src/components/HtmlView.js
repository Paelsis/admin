import {useState, useEffect} from "react"
import { useLocation } from 'react-router-dom';
import {serverFetchData} from '../services/serverFetch'
import EditText, {updateList, compareFunc} from '../components/EditText'

const styles = {
    active:{backgroundColor:'black', color:'yellow'},
    inactive:{backgroundColor:'whitesmoke', color:'black'},

}

const DEFAULT_RECORD={groupId:'DEFAULT', textId:'DEFAULT', language:'SV', placeholder:'Fyll i din text här ...'}

export default props => {
    const {groupId, textId, language, list, setList} = props
    const [record, setRecord] = useState(DEFAULT_RECORD)

    useEffect(()=>{ 
        const keys = {groupId, textId, language}
        const found = list?list.find(it => compareFunc(it, keys) === 0):undefined
        setRecord(found?found:DEFAULT_RECORD)
    },[groupId, textId, language])

    const setRecordAndUpdateList = rec => {    
        setRecord(rec)
        setList(updateList(rec, list))
    }    
    
    return(
        <EditText record={record} setRecord={setRecordAndUpdateList} language={language} />
    )    
}


