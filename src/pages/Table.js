import {useEffect, useState} from 'react'
import {serverFetchData} from '../services/serverFetch'
import { useLocation, useParams } from 'react-router-dom';
import ViewTable from '../components/ViewTable'
import EditTable from '../components/EditTable'

export default () => {
    const location = useLocation()
    const [list, setList] = useState()
    const [columns, setColumns] = useState()
    const {tableName} = useParams()
    
    const handleReply1 = data => {
        if (data.status === 'OK' || data.status === 'true' || data.status) {
            setList(data.result)
        } else {
            alert('ERROR: Call to get data from table ' + tableName + ' failed. Message:' + data.message?data.message:'')
        }
    }    

    const handleReply2 = data => {
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
            serverFetchData('/admin/getColumns?tableName=' + tableName, handleReply2) 
            serverFetchData('/fetchRows?tableName=' + tableName, handleReply1)
        }
    },[tableName])

    return(
            <div>
                {list&&columns?<EditTable tableName={tableName} columns={columns} list={list} setList={setList} />:<h1>Nothing</h1>}
            </div>
    )
}
