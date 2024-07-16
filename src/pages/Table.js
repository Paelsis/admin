import {useEffect, useState} from 'react'
import {serverFetchData} from '../services/serverFetch'
import { useParams } from 'react-router-dom';
import ViewTable from '../components/ViewTable'
import EditTable from '../components/EditTable'
import Progress from '../components/CirkularProgress'

const FAILED_REPLY = {status:'ERROR', message:'FAILED: No reply to db'}

export default () => {
    const [list, setList] = useState()
    const [columns, setColumns] = useState()
    
    const {tableName} = useParams()
    
    const handleReply1 = reply => {
        const data = reply?reply.data?reply.data:reply:FAILED_REPLY
        if (data.status === 'OK' || data.status === 'true' || data.status) {
            setList(data.result)
        } else {
            alert('ERROR: Call to get data from table ' + tableName + ' failed. Message:' + data.message?data.message:'')
        }
    }    

    const handleReply2 = reply => {
        const data = reply?reply.data?reply.data:reply:FAILED_REPLY
        if (data.status === 'OK' || data.status==='true') {
            if (data.result.length > 0) {
                setColumns(data.result)
            } else {
                alert('List of columns ha 0 length')
            }
        } else {
            alert('ERROR: Call to get columns failed. Message:' + data.message?data.message:'')
        }
    }    

    useEffect(()=>{
        if (tableName) {
            serverFetchData('/getColumns?tableName=' + tableName, handleReply2) 
            serverFetchData('/fetchRows?tableName=' + tableName, handleReply1)
        }
    },[tableName])


    return(
            <div>
                {list&&columns?<EditTable tableName={tableName} columns={columns} list={list} setList={setList} />:<Progress />}
            </div>
    )
}


