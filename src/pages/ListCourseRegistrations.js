import {useState, useEffect} from 'react'
import {useSharedState} from '../store'
import { useNavigate }  from 'react-router-dom';
import {isNormalVariable} from '../services/functions'
import {serverFetchData} from "../services/serverFetch"
import {GroupByRecursive} from "../components/GroupByRecursive"
import CirkularProgress from '../components/CirkularProgress'
import ViewTable from '../components/ViewTable'

const TABLE_NAME='tbl_registration'
const apiBaseUrl=process.env.REACT_APP_API_BASE_URL;

const styles = {
    default:{
        height:30, 
        marginTop:5, 
        textAlign:'center', 
        margin:'auto', 
        color:'yellow', 
        backgroundColor:'black', 
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
    const {depth, groupByArr, list} = props
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
    const {depth, columns, groupByArr, list} = props
    const groupByItem = groupByArr[depth]
    const tableName = groupByItem.tableName
    const colsView = groupByItem.colsView?groupByItem.colsView:Object.keys(list[0])
    const colsEdit = groupByItem.colsEdit?groupByItem.colsEdit:Object.keys(list[0])

    return(
        list?
            <ViewTable tableName={tableName} colsView={colsView} colsEdit={colsEdit} colObjList={columns} {...props} />
        :
            <h1>List empty</h1>    
    )
}


// Each row is one level of the recursive groupBy process, first row is group by city, next row is group by courseType, and finally group by courseId
const groupByArr = [
    {
        groupByFunc:it=>it.year, 
        columns:['year'],
        style:{margin:'auto', width:'80vw', backgroundColor:'purple', color:'silver', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        groupByFunc:it=>it.scheduleName, 
        columns:['scheduleName'],
        style:{margin:'auto', width:'80vw', backgroundColor:'darkBlue', color:'white', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        groupByFunc:it=>it.city,
        columns:['city'],
        style:{margin:'auto', width:'70vw', backgroundColor:'blue', color:'white', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        groupByFunc:it=>it.name,
        columns:['name'],
        style:{margin:'auto', width:'60vw', backgroundColor:'lightBlue', color:'darkBlue', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        groupByFunc:it=>it.startDate + it.startTime,
        columns:['startDate', 'startTime'],
        style:{margin:'auto', width:'50vw', backgroundColor:'silver', color:'black', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        // groupByFunc:it=>it.startDate + it.startTime,
        colsView:['firstName', 'lastName', 'role', 'email', 'phone', 'firstNamePartner', 'lastNamePartner', 'emailPartner', 'productId', 'message'],
        tableName:'tbl_registration',
        colsEdit:['firstName', 'lastName', 'role', 'email', 'phone', 'productId'],
        RenderView:_ViewTable, 
    }
]

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
            const url1 = apiBaseUrl + '/listCourseRegistrations?productType=course&language=EN'
            serverFetchData(url1, handleReply1)
            const url2='/getColumns?tableName=tbl_registration'
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
