import {useState, useEffect} from 'react'
import {useSharedState} from '../store'
import { useNavigate }  from 'react-router-dom';
import {isNormalVariable} from '../services/functions'
import {serverFetchData} from "../services/serverFetch"
import {GroupByRecursive} from "./GroupByRecursive"
import CirkularProgress from './CirkularProgress'
import ListCourseRegistrations from '../components/ListCourseRegistrations'
import EditTable from './EditTable'
import { IconButton, Button, Tooltip} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import {styled, Drawer as MuiDrawer} from '@mui/material'
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { blue } from '@mui/material/colors'
import {DrawerList} from './DrawerList'
import {Info} from './Info'
const TEXT = {

    headerFields:{
        SV:['Veckodag','Tid','Plats','Lärare','Start','Anmälan'],
        EN:['Day', 'Time', 'Location', 'Teachers', 'Starts', 'Registration']
    },
    register:{
        SV:'Anmälan',
        EN:'Register'
    },
    cancel:{
        SV:'Avbryt',
        EN:'Cancel'
    },
    titleButton:{
        SV:'Kursanmälan',
        EN:'Register to course'
    },
    titleInfo:{
        SV:'Information om kursen',
        EN:'Information about the course',
    },
    infoIcon:{
        padding:0, 
        background:'transparent', 
        color:'blue'
    }

}


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
    const {depth, groupByArr, list, setList} = props
    const groupByItem = groupByArr[depth]
    const groupByFunc = groupByItem.groupByFunc
    const buttons = groupByItem.buttons?groupByItem.buttons:[]
    const style = groupByItem.style?groupByItem.style:defaultStyle
    const columns = groupByItem.columns
    const viewClassName=groupByItem.viewClassName
    const handleClick = v=>alert(v)
    const key = groupByFunc(list[0])
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

const _ListCourseRegistrations = props => {
    const {depth, groupByArr, list, handleReplaceRecord} = props
    const groupByItem = groupByArr[depth]
    const tableName = groupByItem.tableName
    const colsView = groupByItem.colsView?groupByItem.colsView:Object.keys(list[0])
    const colsEdit = groupByItem.colsEdit?groupByItem.colsEdit:Object.keys(list[0])

    return(
        <ListCourseRegistrations 
            list={list} 
            colsView={colsView} 
            tableName={tableName} 
            colsEdit={colsEdit} 
            handleReplaceRecord={handleReplaceRecord} 
        />
    )
}


// Each row is one level of the recursive groupBy process, first row is group by city, next row is group by courseType, and finally group by courseId
const groupByArr = [
    {
        groupByFunc:it=>it.year, 
        columns:['scheduleName'],
        style:{margin:'auto', width:'80vw', backgroundColor:'red', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        groupByFunc:it=>it.scheduleName, 
        columns:['scheduleName'],
        style:{margin:'auto', width:'80vw', backgroundColor:'red', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        groupByFunc:it=>it.city,
        columns:['city'],
        style:{margin:'auto', width:'70vw', backgroundColor:'lightBlue', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        groupByFunc:it=>it.name,
        columns:['name'],
        style:{margin:'auto', width:'60vw', backgroundColor:'lightBlue', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        groupByFunc:it=>it.startDate + it.startTime,
        columns:['startDate', 'startTime'],
        style:{margin:'auto', width:'50vw', backgroundColor:'lightBlue', margin:'auto', marginTop:2},
        RenderView:_ViewBar
    }, 
    {
        // groupByFunc:it=>it.startDate + it.startTime,
        colsEdit:['firstName', 'lastName', 'role', 'city'],
        tableName:'tbl_registration',
        RenderView:_ListCourseRegistrations, 
    }
]

export default  () => {
    const [list, setList] = useState()
    const [columns, setColumns] = useState()
    const [sharedState, ] = useSharedState()
    const language = sharedState.language?sharedState.language:'EN'

    const handleReplaceRecord = rec => {
        if (rec.id) {
            const newList = list.map(it=>{
                if (it.id === rec.id) {
                    return rec 
                } else {
                    return it
                }    
            })    
            setList(newList)
        } else {
            alert('[ListCourseRegistrations]: object is missing key "id" and can therefore not be updated')
        }    
    }

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
            const url1 = apiBaseUrl + '/fetchRegistrations?productType=course&language=EN'
            serverFetchData(url1, handleReply1)
            const url2='/getColumns?tableName=tbl_registration'
            serverFetchData(url2, handleReply2) 
    },[language])

    return(
        <>
            {list?
                <GroupByRecursive depth={0} groupByArr={groupByArr} list={list} handleReplaceRecord={handleReplaceRecord} columns={columns} language={language} />
            :
                <CirkularProgress color={'whiteSmoke'} style={{margin:'auto', width:'100vw'}} />
            }
        </>
    )
}
