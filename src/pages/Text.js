import {useState, useEffect} from "react"
import {serverFetchData} from '../services/serverFetch'
import EditText from '../components/EditText'

const styles = {
    active:{backgroundColor:'black', color:'yellow'},
    inactive:{backgroundColor:'whitesmoke', color:'black'},

}

export default () => {
    const [keys, setKeys] = useState();
    const [list, setList] = useState()
    const compareSort = (a,b) => {
        let ret 
        ret = a.groupId.localeCompare(b.groupId)
        if (ret !==0) {
            return ret
        }
        ret = a.textId.localeCompare(b.textId)
        if (ret !==0) {
            return ret
        }

        ret = a.language.localeCompare(b.language)
        if (ret !==0) {
            return ret
        }
    }
    const active = it => keys?(it.groupId === keys.groupId  && it.textId === keys.textId && it.language === keys.language):false
    const handleReply = reply => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            const currentList = data.result
            setList(currentList)
        } else {
            alert('ERROR: Failed to fetch text')
        }   
    }


    useEffect(()=>{ 
        serverFetchData('/fetchRows?tableName=tbl_text', handleReply)
    },[])

    const handleClickRow = it => {
        setKeys({groupId:it.groupId, textId:it.textId, language:it.language})            
    }
    return(
        <div className='columns is-centered' style={{margin:'auto'}}>
            <div className='column is-4'>
                <table>
                    <tbody>
                        {list?list.filter(it=>it.language !=='ES').sort(compareSort).map(it=>
                            <tr onClick={()=>handleClickRow(it)} style={active(it)?styles.active:styles.inactive}>
                            <td>{it.groupId}</td>
                            <td>{it.textId}</td>
                            <td>{it.language}</td>
                            </tr>
                        ):null}
                    </tbody>
                </table>
            </div>
            <div className = 'column is-8'>
                {keys?<EditText keys={keys} list={list} setList={setList} />:null}
            </div>
        </div>
     )    
}


