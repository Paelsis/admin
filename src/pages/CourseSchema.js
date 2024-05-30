import {useState, useEffect} from 'react'
import {useSharedState} from '../store'
import { useNavigate }  from 'react-router-dom';
import {isNormalVariable} from '../services/functions'
import {serverFetchData} from "../services/serverFetch"
import {GroupByFlat, GroupByRecursive} from "../components/GroupByRecursive"
import CirkularProgress from '../components/CirkularProgress'
import { IconButton, Button, Tooltip} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { blue } from '@mui/material/colors'

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
    }

}

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
    const navigate = useNavigate()
    const {depth, groupByArr, list, language} = props
    const groupByItem = groupByArr[depth]
    const headerFields = TEXT.headerFields[language]
    const columns = ['dayname', 'startDate', 'city', 'teachersShort', 'startDate']
    const style  = {fontSize:14, height:30, margin:'auto', backgroundColor:'whiteSmoke', margin:20, borderRadius:8}
    const dayName = language => [
        {},
        {SV:'Måndag', EN: 'Monday'},
        {SV:'Tisdag', EN: 'Tuesday'},
        {SV:'Onsdag', EN: 'Wednesday'},
        {SV:'Torsdag', EN: 'Thursday'},
        {SV:'Fredag', EN: 'Friday'},
        {SV:'Lördag', EN: 'Saturday'},
    ]
    const buttons = [
        {
            // icon:<HowToRegIcon />,
            label:TEXT.register[language],
            onClick:course=>navigate('/registration', {state:course}),
            title:TEXT.titleButton[language]
        },
    ]
    const infoButton = {
        icon:<InfoIcon />,
        onClick:courseId=>alert(JSON.stringify(courseId)),
        title:TEXT.titleInfo[language],
    }
    const anchorField = {
        city:'address',
    }

    const hoverField = {
        teachersShort:'teachers',
    }


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
    const handleClickCity = url => alert(url)
    return(
        <table style={style}>
            <thead style={{textAlign:'center'}}>
                <tr>
                    <th colSpan={colSpan}>{list[0].nameEN}</th>
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
                        {headerFields.map(col=>
                            <th>{col}</th>
                        )}
                    </tr>    
                :null}           
            </thead>
            <tbody>
                {sortedList.map(li=>
                    <tr>
                        {columns.map(col=>
                            anchorField[col]?
                                <Tooltip title={li[anchorField[col]]}>
                                <td style={{padding:2}}><a onClick={e=>{e.preventDefault(); window.open(li.urlLocation, '_blank')}}>{li[col]}</a></td>
                                </Tooltip>
                            :hoverField[col]?
                                <Tooltip title={li[hoverField[col]]}>
                                <td style={{padding:2}}><a onClick={e=>{e.preventDefault(); alert(hoverField[col])}}>{li[col]}</a></td>
                                </Tooltip>

                            :
                                <td style={{padding:2}} >{li[col]}</td>
                        )}
                        {buttons?buttons.map(but=>
                            <td style={{margin:2, padding:2}}>
                            {but.icon?
                                <IconButton style={{padding:0, background:'transparent', color:'blue', borderColor:'blue'}} onClick={()=>but.onClick(li)}>
                                <Tooltip title={but.title}>
                                    {but.icon}
                                    </Tooltip>
                                </IconButton>    
                            :
                                <Tooltip title={but.title}>
                                    <Button size='small' variant='outlined' style={{color:'blue', borderColor:'blue'}} onClick={()=>but.onClick(li)}>
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

// Each row is one level of the recursive groupBy process, first row is group by city, next row is group by courseType, and finally group by courseId
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
        RenderView:ViewCourses, 
    }
]

export default  () => {
    const [list, setList] = useState()
    const [sharedState, ] = useSharedState()
    const language = sharedState.language?sharedState.language:'EN'
    const handleReply = data => {
        if (data.status === 'OK' || data.status === 'true') {
            setList(data.result.filter(it=>isNormalVariable(it)))
        } else {
            alert(data.message)
        }
    }

    useEffect(()=>{
        const url = URL + '?language=' + (language?language:'EN')
        serverFetchData(url, handleReply)
    },[language])

    return(
        <div>
            {list?
                <GroupByFlat depth={0} groupByArr={groupByArr} list={list} language={language} />
            :
                <CirkularProgress color={'whiteSmoke'} style={{margin:'auto', width:'100vw'}} />
            }
        </div>
    )
}
