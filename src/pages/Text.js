import {useState, useEffect} from "react"
import {serverFetchData} from '../services/serverFetch'
import EditText, {updateList, compareFunc} from '../components/EditText'

const styles = {
    table:{width:100, fontSize:10},
    thead:{color:'white'},
    th:{color:'white'},
    active:{backgroundColor:'black', color:'yellow'},
    inactive:{backgroundColor:'whitesmoke', color:'black'},
}

export default () => {
    const [record, setRecord] = useState()
    const [list, setList] = useState()

    const active = it => record?(it.groupId === record.groupId  && it.textId === record.textId && it.language === record.language):false
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


    const setRecordAndUpdateList = rec => {    
        setRecord(rec)
        setList(updateList(rec, list))
    }    

    return(
        <div className='columns is-centered' style={{margin:'auto'}}>
            <div className='column is-3'>
                <table style={styles.table}>
                    <thead style={styles.tr}>
                        <tr>
                            <th>groupId</th>
                            <th>textId</th>
                            <th>language</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list?list.filter(it=>it.language !=='ES').sort(compareFunc).map(it=>
                            <tr onClick={()=>setRecord(it)} style={active(it)?styles.active:styles.inactive}>
                            <td>{it.groupId}</td>
                            <td>{it.textId}</td>
                            <td>{it.language}</td>
                            </tr>
                        ):null}
                    </tbody>
                </table>
            </div>
            <div className = 'column is-8'>
                {record?<EditText record={record} setRecord={setRecordAndUpdateList} />:null}
            </div>
        </div>
     )    
}


