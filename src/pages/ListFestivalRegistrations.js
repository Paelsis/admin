import {useState, useEffect} from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import {useSharedState} from '../store'
import { useNavigate }  from 'react-router-dom';
import {isNormalVariable} from '../services/functions'
import {serverFetchData} from "../services/serverFetch"
import {GroupByRecursive} from "../components/GroupByRecursive"
import CirkularProgress from '../components/CirkularProgress'
import ViewTable from '../components/ViewTable'
import {replaceRow, deleteRow} from '../services/serverPost'

const API_BASE_URL=process.env.REACT_APP_API_BASE_URL;
const TABLE_NAME = 'tbl_registration_festival'


const styles = {
    default: {
        height:30, 
        marginTop:5, 
        textAlign:'center', 
        margin:'auto', 
        color:'yellow', 
        backgroundColor:'black' 
    },
    circular:{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-50px',
        marginLeft: '-50px',
        width: '100px',
        height: '100px',
    },
}

const _ViewBar = props => {
    const {depth, groupByArr, list, key} = props
    const groupByItem = groupByArr[depth]
    const style = groupByItem.style?groupByItem.style:styles.default
    const columns = groupByItem.columns
    return(
        <div style={style}>
            {columns.map(col=>
                    <span col>
                        {list[0][col]}&nbsp;
                    </span>
            )}
        </div>
    )
}

const _ViewTable = props => {
    const {depth, groupByArr, list} = props

    return(
        props.list?
            <ViewTable {...props} />
        :
            <h1 className="title is-1">List empty</h1>    
    )
}


// Each row is one level of the recursive groupBy process, first row is group by city, next row is group by courseType, and finally group by courseId
const groupByArr = [
    {
        groupByFunc:it=>it.year, 
        columns:['year'],
        style:{margin:'auto', width:'80vw', backgroundColor:'darkBlue', color:'silver', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        groupByFunc:it=>it.eventType, 
        columns:['eventType'],
        style:{margin:'auto', width:'80vw', backgroundColor:'blue', color:'white', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        groupByFunc:it=>it.startDate,
        columns:['startDate'],
        style:{margin:'auto', width:'70vw', backgroundColor:'lightBlue', color:'black', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        //groupByFunc:it=>it.firstName,
        colsEdit:['firstName', 'lastName', 'role', 'email', 'phone', 'firstNamePartner', 'lastNamePartner', 'emailPartner', 'partners', 'message'],
        colsView:['firstName', 'lastName', 'role', 'email', 'phone', 'firstNamePartner', 'lastNamePartner', 'emailPartner', 'partners', 'message'],
        tableName:'tbl_registration_festival',
        RenderView:_ViewTable, 
    }
]

// ListFestivalRegistrations
export default  () => {
    const [list, setList] = useState()
    const [columns, setColumns] = useState()
    const [sharedState, ] = useSharedState()
    const language = sharedState.language?sharedState.language:'EN'

    const handleReply1 = data => {
        if (data.status === 'OK' || data.status === 'true') {
            setList(data.result.filter(it=>isNormalVariable(it)))
        } else {
            alert(data.message)
        }
    }

    const handleReply2 = data => {
        if (data.status === 'OK' || data.status === 'true') {
            setColumns(data.result.filter(it=>isNormalVariable(it)))
        } else {
            alert(data.message)
        }
    }

    useEffect(()=>{
            const url1 = API_BASE_URL + '/listFestivalRegistrations?productType=course&language=EN'
            serverFetchData(url1, handleReply1)
            const url2='/getColumns?tableName=tbl_registration_festival'
            serverFetchData(url2, handleReply2) 
    },[language])

    return(
        <>
            {list?
                <GroupByRecursive 
                    depth={0} 
                    list={list} 
                    columns={columns} 
                    language={language}
                    groupByArr={groupByArr} 
                    tableName={TABLE_NAME}  // Needed by function ViewTable for update and delete
                    originalList={list}     // Needed by function ViewTable for update and delete
                    setOriginalList={setList} // Needed by function ViewTable for update and delete
                />
            :
                <CirkularProgress color={'whiteSmoke'} style={styles.circular} />
            }
        </>
    )
}
