import {useState, useEffect} from "react"
import { useParams } from 'react-router-dom';
import { useSharedState } from "../store";
import {serverFetchData} from '../services/serverFetch'
import EditText, {updateTextList, compareTextFunc} from '../components/EditText'

const styles = {
    table:{width:100, fontSize:10},
    thead:{color:'white'},
    th:{color:'white'},
    active:{backgroundColor:'black', color:'yellow'},
    inactive:{backgroundColor:'whitesmoke', color:'black'},
}
export default () =>{
        const {groupId, textId} = useParams()
        const [sharedState, ] = useSharedState()
        const [record, setRecord] = useState(groupId&&textId?{groupId, textId, language:sharedState.language}:undefined)
        const [list, setList] = useState()
        const isActive = it => record?(it.groupId === record.groupId  && it.textId === record.textId && it.language === sharedState.language):false
        const handleReplyFetchData = reply => {
            const data = reply.data?reply.data:reply
            if (data.status === 'OK') {
                const currentList = data.result.sort(compareTextFunc)
                const rec = currentList.find(it=>isActive(it))
                setRecord(rec?rec:{groupId, textId, language:sharedState.language, textBody:"<h2 className='is-size-4'>No text</h2>"})
                setList(currentList)
            } else {
                alert('ERROR: Failed to fetch text')
            }   
        }
        useEffect(()=>{ 
            serverFetchData('/fetchRows?tableName=tbl_text', handleReplyFetchData)
            const rec = list?list.find(it=>isActive(it)):undefined
            setRecord(rec?rec:{groupId, textId, language:sharedState.language, textBody:"<h2 className='is-size-4'>No text</h2>"})
        },[sharedState.language, textId, groupId])
    
    
        return(
            groupId && textId ?
                <div className='columns'>
                    <div className = 'column is-9'>
                        {record?<EditText groupId={record.groupId} textId={record.textId} />:null}
                    </div>
                </div>
            :
                <div className='columns'>
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
                                {list?list.filter(it=>it.language !=='ES').sort(compareTextFunc).map((it, idx)=>
                                    <tr key={'tr' + idx} onClick={()=>setRecord(it)} style={isActive(it)?styles.active:styles.inactive}>
                                        <td key={'td1' + idx}>{it.groupId}</td>
                                        <td key={'td2' + idx}>{it.textId}</td>
                                        <td key={'td3' + idx}>{sharedState.language}</td>
                                    </tr>
                                ):null}
                            </tbody>
                        </table>
                    </div>
                    <div className = 'column is-9'>
                        {record?<EditText groupId={record.groupId} textId={record.textId} />:null}
                    </div>
                </div>    
            
        )
}

