import {useState, useEffect} from 'react'
import {isNormalVariable} from '../services/functions'
import {serverFetchData} from "../services/serverFetch"
import {GroupByFlat, GroupByRecursive} from "../components/GroupByRecursive"
import CirkularProgress from '../components/CirkularProgress'
import { IconButton, Button, Tooltip} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

import ViewTable from '../components/ViewTable'
import InfoIcon from '@mui/icons-material/Info';
import { blue, red } from '@mui/material/colors'

const URL = '/fetchRows?tableName=tbl_course_def'

const defaultStyle = {
    height:30, 
    marginTop:5, 
    textAlign:'center', 
    margin:'auto', 
    color:'teal', 
    backgroundColor:'transparent' 
}

const _ViewBar = props => {
    const {depth, groupByArr, list} = props
    const groupByItem = groupByArr[depth]
    const groupByFunc = groupByItem.groupByFunc
    const buttons = groupByItem.buttons?groupByItem.buttons:[]
    const style = groupByItem.style?groupByItem.style:defaultStyle
    const columns = groupByItem.columns
    const viewClassName=groupByItem.viewClassName
    const handleClick = v=>alert(v)
    const key = groupByFunc(list[0])
    return(
        <div className={viewClassName} onClick = {()=>handleClick?handleClick(key):null}>
            {key}
            {columns.map(col=>
                    <span style={{...style}}>
                        {list[0][col]}
                    </span>
            )}
        </div>
    )
}



const _ViewTable = props => {
    const {depth, groupByArr, list, setList} = props
    const [edit, setEdit] = useState()
    const groupByItem = groupByArr[depth]
    const columns = groupByItem.columns

    const buttons = [
        {
            icon: idx => idx===edit?<SaveIcon/>:<EditIcon/>,
            onClick:index=>setEdit(edit===index?undefined:index)        
        },    
        {
            icon:<CancelIcon />,
            onClick:index=>setEdit(undefined)        
        }    
    ]

    return(
            <ViewTable tableName={'tbl_course_def'} edit={edit} columns={columns} list={list} setList={setList} buttons={buttons} />
    )
}


const ViewCourses = props => {
    const {depth, groupByArr, list} = props
    const groupByItem = groupByArr[depth]
    const buttons = groupByItem.buttons?groupByItem.buttons:[]
    const infoButton = groupByItem.infoButton
    const anchors = groupByItem.anchors
    const style = groupByItem.style?groupByItem.style:defaultStyle
    const headerFields = groupByItem.headerFields
    const columns = groupByItem.columns
    const sortFunc = (a,b)=>{
        let ret
        if ((ret = a.sequenceNumber > b.sequenceNumber) !== 0) {
            return ret
        } else if((ret = a.dayOfWeek?b.dayOfWeek:0 - b.dayOfWeek?a.dayOfWeek:0) !==0) {
            return ret
        } else if((ret = a.startTime.localeCompare(b.startTime)) !==0) {
            return ret
        } else {
            return 0
        } 
    }    
    const sortedList = list.sort(sortFunc)
    const colSpan = columns.length + buttons.length - 1    
    return(
        <table style={style}>
            <thead style={{textAlign:'center'}}>
                <tr>
                    <th colSpan={colSpan}></th>
                    {infoButton?
                        <th>
                                <Tooltip title={infoButton.title}>
                                    <IconButton style={{padding:0, background:'transparent', color:'blue'}} onClick={()=>infoButton.onClick(list[0].courseId)}>
                                        {infoButton.icon}
                                    </IconButton>   
                                </Tooltip> 
                        </th>
                    :null}
                </tr>
                {headerFields?
                    <tr>
                        {headerFields.map(col=><th>{col}</th>)}
                    </tr>    
                :null}           
            </thead>
            <tbody>
                {sortedList.map(li=>
                    <tr>
                        {columns.map(col=>
                            anchors?anchors[col]?
                                <td style={{padding:2}}><a onClick={e=>{e.preventDefault(); alert(li[anchors[col]])}}>{li[col]}</a></td>
                            :
                                <td style={{padding:2}} >{li[col]}</td>
                            :
                                <td style={{padding:2}} >{li[col]}</td>
                            
                        )}
                        {buttons?buttons.map(but=>
                            <td style={{margin:2, padding:2}}>
                            {but.icon?
                                <IconButton style={{padding:0, background:'transparent', color:'blue', borderColor:'blue'}} onClick={()=>but.onClick(li.productId)}>
                                <Tooltip title={but.title}>
                                        {but.icon}
                                    </Tooltip>
                                </IconButton>    
                            :
                                <Tooltip title={but.title}>
                                    <Button size='small' variant='outlined' style={{color:'blue', borderColor:'blue'}} onClick={()=>but.onClick(li.productId)}>
                                        {but.label?but.label:'No label'}
                                    </Button>                            
                                </Tooltip>
                            }
                            </td>
                        ):null}    
                    </tr>
                )}
            </tbody>      
        </table>
    )
}

const groupByArr = [
    {
        groupByFunc:it=>it.city,
        columns:['nameSV'],
        RenderView:_ViewBar
    }, 
    {
        groupByFunc:it=>it.courseType,
        columns:['courseType'],
        className:'columns is-centered is-multiline',
        classNameItem:'column is-12',
        RenderView:_ViewTable
    },
]


export default  () => {
    const [list, setList] = useState()
    const handleReply = data => {
        if (data.status === 'OK' || data.status === 'true') {
            setList(data.result.filter(it=>isNormalVariable(it)))
        } else {
            alert(data.message)
        }
    }

    useEffect(()=>{
        serverFetchData(URL, handleReply)
    },[])

    return(
        <div>
            {list?
                <GroupByFlat depth={0} groupByArr={groupByArr} list={list} setList={setList} />
            :
                <CirkularProgress color={'lightGrey'} style={{margin:'auto', width:'100vw'}} />
            }
        </div>
    )
}
