import {useState, useEffect} from 'react'
import {useSharedState} from '../store'
import { useNavigate }  from 'react-router-dom';
import {isNormalVariable} from '../services/functions'
import {serverFetchData} from "../services/serverFetch"
import {GroupByRecursive} from "../components/GroupByRecursive"
import CirkularProgress from '../components/CirkularProgress'
import {replaceRow, deleteRow} from '../services/serverPost'
import ViewTable from '../components/ViewTable'

const TABLE_NAME='tbl_registration_festival_product'


const defaultStyle = {
    height:30, 
    marginTop:5, 
    textAlign:'center', 
    margin:'auto', 
    color:'yellow', 
    backgroundColor:'black' 
}

const styles = {
    button:{color:'blue', 
        borderColor:'blue', 
        padding:2,
        fontSize:12
    },
    icon:{
        padding:0, 
        background:'transparent', 
        color:'blue', 
        borderColor:'blue'
    },
    table:{
        borderCollapse:'collapse',
        //border:'1px solid red',
    },
    tr:{
        background:'whiteSmoke'
    },
    course:{
        padding:10, 
        fontSize:14, 
        margin:'auto', 
        backgroundColor:'transparent',
        borderRadious:8,
    }
}

const _ViewBar = props => {
    const {depth, groupByArr, list} = props
    const groupByItem = groupByArr[depth]
    const style = groupByItem.style?groupByItem.style:defaultStyle
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
const apiBaseUrl=process.env.REACT_APP_API_BASE_URL;

const _ViewTable = props => {
    const {depth, groupByArr, list, setList, handleReplaceRecord} = props
    const groupByItem = groupByArr[depth]
    const tableName = groupByItem.tableName
    const colsView = groupByItem.colsView?groupByItem.colsView:Object.keys(list[0])
    const colsEdit = groupByItem.colsEdit?groupByItem.colsEdit:Object.keys(list[0])

    return(
        list?
            <ViewTable tableName={tableName} colsView={colsView} colsEdit={colsEdit} list={list} setList={setList} handleReplaceRecord={handleReplaceRecord} />
        :
            <h1>List empty</h1>    
    )
}


// Each row is one level of the recursive groupBy process, first row is group by city, next row is group by courseType, and finally group by courseId
const groupByArr = [
    {
        groupByFunc:it=>it.year,
        columns:['year'],
        style:{margin:'auto', width:'70vw', backgroundColor:'lightBlue', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        groupByFunc:it=>it.eventType, 
        columns:['eventType'],
        style:{margin:'auto', width:'80vw', backgroundColor:'red', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        groupByFunc:it=>it.productType,
        columns:['productType'],
        style:{margin:'auto', width:'60vw', backgroundColor:'teal', color:'silver', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        groupByFunc:it=>it.product,
        columns:['product'],
        style:{margin:'auto', width:'50vw', backgroundColor:'green', color:'gold', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        colsView:['firstName', 'lastName', 'role', 'email', 'phone'],
        colsEdit:['product'],
        tableName:TABLE_NAME,
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
            const url1 = apiBaseUrl + '/listFestivalRegistrationWorkshops'
            serverFetchData(url1, handleReply1)
            const url2='/getColumns?tableName=tbl_registration_festival_product'
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
                    tableName={TABLE_NAME} // Needed by function ViewTable for update and delete
                    originalList={list} // Needed by function ViewTable for update and delete
                    setOriginalList={setList} // Needed by function ViewTable for update and delete
                />
            :
                <CirkularProgress color={'whiteSmoke'} style={{margin:'auto', width:'100vw'}} />
            }
        </>
    )
}
