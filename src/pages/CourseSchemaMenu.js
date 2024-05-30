import {useState, useEffect} from 'react'
import {isNormalVariable} from '../services/functions'
import {serverFetchData} from "../services/serverFetch"
import {GroupByFlat, GroupByRecursive} from "../components/GroupByRecursive"
import CirkularProgress from '../components/CirkularProgress'
import { IconButton, Button, Tooltip} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { blue, red } from '@mui/material/colors'

const URL = '/scheduleCourse'

const defaultStyle = {
    height:30, 
    marginTop:5, 
    textAlign:'center', 
    margin:'auto', 
    color:'yellow', 
    backgroundColor:'black' 
}

const ViewBar = props => {
    const {depth, groupByArr, list} = props
    const groupByItem = groupByArr[depth]
    const groupBy = groupByItem.groupBy
    const buttons = groupByItem.buttons?groupByItem.buttons:[]
    const style = groupByItem.style?groupByItem.style:defaultStyle
    const columns = groupByItem.columns
    const viewClassName=groupByItem.viewClassName
    const handleClick = v=>alert(v)
    return(
        <div className={viewClassName} onClick = {()=>handleClick?handleClick(list[0][groupBy]):null}>
            {columns.map(col=>
                    <span style={{...style}}>
                        {list[0][col]}
                    </span>
            )}
        </div>
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
    /*
    {
        groupBy:'city',
        columns:['city'],
        style:{color:'grey', textAlign:'center', backgroundColor:red[200], fontSize:30, fontStyle:'oblique'},
        className:'columns is-centered'
        viewClassName:'column p-8 is-1',
        fontSize:24,
        RenderView:ViewBar
    }, 
    */
    {
        groupBy:'courseType',
        columns:['courseTypeName'],
        style:{fontSize:14, height:30, width:'100vw', textAlign:'center', margin:0, backgroundColor:'green', color:'white', borderRadius:2},
        fontSize:20,
        handleClick:arg=>alert(arg),
        RenderView:ViewBar
    },
    {
        groupBy:'courseId',
        columns:['nameSV'],
        style:{fontSize:14, height:30, width:'100vw', textAlign:'center', margin:0, marginLeft:20,backgroundColor:'lightGrey', borderRadius:2},
        fontSize:20,
        handleClick:arg=>alert(arg),
        RenderView:ViewBar
    },
    /*
    {
        groupBy:'courseId',
        headerFields:['Weekday', 'Time', 'Starts', 'City', 'Teachers', 'Register'],
        columns:['dayname', 'startTime', 'startDate', 'city', 'teachersShort'],
        style:{fontSize:14, height:30, width:'80vw', textAlign:'center', margin:'auto', backgroundColor:'lightGrey', borderRadius:8},
        buttons:[
            {
                // icon:<HowToRegIcon />,
                label:'Register',
                onClick:productId=>alert(JSON.stringify(productId)),
                title:'Registration button / Anmälan'
            },
        ],
        infoButton:{
            icon:<InfoIcon />,
            onClick:courseId=>alert(JSON.stringify(courseId)),
            title:'Information about the course / Information om kursen'
        },
        anchors:{
            teachersShort:'teachers',
            city:'address',
        },
        RenderView:ViewBar, 
    }
    */
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
                <GroupByFlat depth={0} groupByArr={groupByArr} list={list} />
            :
                <CirkularProgress color={'lightGrey'} style={{margin:'auto', width:'100vw'}} />
            }
        </div>
    )
}
