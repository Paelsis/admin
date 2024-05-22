import {useState, useEffect} from 'react'
import {isNormalVariable} from '../services/functions'
import {serverFetchData} from "../services/serverFetch"
import {ViewGroupRecursiveFlat, ViewGroupRecursive} from "../components/ViewGroupRecursive"
import CirkularProgress from '../components/CirkularProgress'
import { IconButton, Button} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

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
    const buttons = groupByItem.buttons?groupByItem.buttons:[]
    const style = groupByItem.style?groupByItem.style:defaultStyle
    const columns = groupByItem.columns
    const viewClassName=groupByItem.viewClassName
    return(
        <div className={viewClassName}>
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
    const colSpan = columns.length + buttons.length    
    return(
        <table style={style}>
            <thead style={{textAlign:'center'}}>
                <tr>
                    <th colSpan={colSpan}>{list[0].nameEN}</th>
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
                                <IconButton style={{background:'transparent'}} onClick={()=>but.onClick(li.productId)}>
                                    {but.icon}
                                </IconButton>    
                            :
                                <Button size='small' variant='outlined' style={{color:'grey', borderColor:'grey'}} onClick={()=>but.onClick(li.productId)}>
                                    {but.label?but.label:'No label'}
                               </Button>                            
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
        groupBy:'city',
        columns:['city'],
        style:{color:'grey', textAlign:'center', backgroundColor:'transparent', fontSize:30, fontStyle:'oblique'},
        className:'columns is-centered',
        viewClassName:'column p-8 is-1',
        fontSize:24,
        RenderView:ViewBar
    }, 
    {
        groupBy:'courseType',
        columns:['courseTypeName'],
        style:{height:30, marginTop:0, textAlign:'center', margin:'auto', color:'grey', backgroundColor:'transparent'}, 
        fontSize:20,
        className:'column is-3',
        RenderView:ViewBar
    },
    {
        groupBy:'courseId',
        headerFields:['Weekday', 'Time', 'Starts', 'City', 'Teachers', 'Register', 'Info'],
        columns:['dayname', 'startTime', 'startDate', 'city', 'teachersShort'],
        style:{fontSize:14, height:30, margin:'auto', backgroundColor:'whiteSmoke', margin:20, borderRadius:8},
        buttons:[
            {
                // icon:<HowToRegIcon />,
                label:'Register',
                onClick:productId=>alert(JSON.stringify(productId))
            },
            {
                // icon:<HowToRegIcon />,
                icon:<InfoIcon />,
                onClick:productId=>alert(JSON.stringify(productId))
            }
        ],
        anchors:{
            teachersShort:'teachers',
            city:'address',
        },
        RenderView:ViewCourses, 
    }
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
                <ViewGroupRecursiveFlat depth={0} groupByArr={groupByArr} list={list} />
            :
                <CirkularProgress color={'lightGrey'} style={{margin:'auto', width:'100vw'}} />
            }
        </div>
    )
}
