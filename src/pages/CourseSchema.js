import {useState, useEffect} from 'react'
import {useSharedState} from '../store'
import { useNavigate }  from 'react-router-dom';
import {isNormalVariable} from '../services/functions'
import {serverFetchData} from "../services/serverFetch"
import {GroupByFlat} from "../components/GroupByRecursive"
import CirkularProgress from '../components/CirkularProgress'
import { IconButton, Button, Tooltip} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {styled, Drawer as MuiDrawer} from '@mui/material'
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { blue } from '@mui/material/colors'
import {DrawerList} from '../components/DrawerList'
import {Info} from '../components/Info'
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

const URL = '/scheduleCourse'

const defaultStyle = {
    height:30, 
    marginTop:5, 
    textAlign:'center', 
    margin:'auto', 
    color:'yellow', 
    backgroundColor:'black' 
}

const styles = {
    button:{color:'grey', 
        borderColor:'grey', 
        padding:2,
        fontSize:12
    },
    infoButton:{color:'whiteSmoke', 
        borderColor:'whiteSmoke', 
        padding:2,
        fontSize:12
    },
    icon:{
        padding:0, 
        background:'transparent', 
        color:'grey', 
        borderColor:'grey'
    },
    table:{
        borderCollapse:'collapse',
        //border:'1px solid red',
        borderRadius:16
    },
    tbody:{
        //border:'1px solid red',
        borderRadius:16,
        padding:5,
    },
    th:{
        background:'darkBlue',
        color:'whiteSmoke',
        padding:5,
    },
    tr:{
        background:'whiteSmoke',
        padding:5
    },
    cities:{
        margin:'auto',
        textAlign:'center', 
        fontSize:32, 
    },
    types:{
        margin:'auto',
        padding:10, 
        fontSize:24
    },
    course:{
        margin:'auto', 
        padding:10, 
        fontSize:14, 
        backgroundColor:'transparent',
        borderRadius:8,
    }
}

const ViewCities = props => {
    const {list} = props
    return(
        <div style={styles.cities}>
            {list[0].city}
        </div>
   )
}

const ViewCourseTypes = props => {
    const {list} = props
    return(
        <div style={styles.types}>
            {list[0].courseTypeName}
        </div>
    )
}

const ViewCourses = props => {
    const navigate = useNavigate()
    const {list, language} = props
    const headerFields = TEXT.headerFields[language]
    const columns = ['dayname', 'startDate', 'city', 'teachersShort', 'startDate']
    const [info, setInfo] = useState()

    const buttons = [
        {
            // icon:<HowToRegIcon />,
            label:TEXT.register[language],
            handleClick:course=>navigate('/courseRegistration', {state:course}),
            style:styles.icon,
            title:TEXT.titleButton[language]
        },
    ]
    const infoButton = {
        icon:<InfoIcon />,
        style:styles.infoButton,
        handleClick:courseId=>{setInfo(info?undefined:courseId)}, 
        title:TEXT.titleInfo[language],
    }
    const anchorField = {
        city:li=>li.siteName + ' ' + li.siteAddress + ' ' + li.city
    }

    const hoverField = {
        teachersShort:li=>li.teachers,
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
    //const handleClickCity = url => alert(url)
    return(
        <div style={styles.course}>
            <Drawer open={info?true:false}  onClose={()=>setInfo(undefined)}>
            <Info groupId={'Course'} textId={info} onClose={()=>setInfo(undefined)} />
            </Drawer>

            <table style={styles.table}>
                <thead style={{textAlign:'center'}}>
                    <tr>
                        <th colSpan={colSpan} style={styles.th}>{list[0].nameEN}</th>
                        {infoButton?
                                <th style={styles.th}>
                                    <Tooltip title={infoButton.title}>
                                        <IconButton style={styles.infoButton} onClick={()=>infoButton.handleClick(list[0].courseId)}>
                                            {infoButton.icon}
                                        </IconButton>   
                                    </Tooltip> 
                                </th>
                        :null}
                    </tr>
                    {headerFields?
                        <tr>
                            {headerFields.map(col=>
                                <th style={styles.th}>{col}</th>
                            )}
                        </tr>    
                    :null}           
                </thead>
                <tbody style={styles.tbody}>
                    {sortedList.map(li=>
                        <tr style={styles.tr}>
                            {columns.map(col=>
                                anchorField[col]?
                                    <Tooltip title={anchorField[col](li)}>
                                    <td style={{padding:2}}><a onClick={e=>{e.preventDefault(); window.open(li.urlLocation, '_blank')}}>{li[col]}</a></td>
                                    </Tooltip>
                                :hoverField[col]?
                                    <Tooltip title={hoverField[col](li)}>
                                    <td style={{padding:2}}><a onClick={e=>{e.preventDefault(); alert(hoverField[col](li))}}>{li[col]}</a></td>
                                    </Tooltip>

                                :
                                    <td style={{padding:2}} >{li[col]}</td>
                            )}
                            {buttons?
                                buttons.map(but=>
                                    <td style={{margin:2, padding:2}}>
                                        {but.icon?
                                            <Tooltip title={but.title}>
                                                <IconButton size='small' style={but.style} onClick={()=>but.handleClick(li)}>
                                                    {but.icon}
                                                </IconButton>    
                                            </Tooltip>
                                        :
                                            <Tooltip title={but.title}>
                                                <Button size='small' variant='outlined' style={but.style} onClick={()=>but.handleClick(li)}>
                                                    {but.label?but.label:'No label'}
                                                </Button>                            
                                            </Tooltip>
                                        }
                                    </td>
                                )
                            :
                                null
                            }    
                        </tr>
                    )}
                </tbody>      
            </table>
        </div>
    )
}

// Each row is one level of the recursive groupBy process, first row is group by city, next row is group by courseType, and finally group by courseId
const groupByArr = [
    {
        groupByFunc:it=>it.city,
        RenderView:ViewCities
    }, 
    {
        groupByFunc:it=>it.courseType,
        className:'columns is-centered is-multiline',
        classNameItem:'column is-4 m-8',
        RenderView:ViewCourseTypes
    },
    {
        groupByFunc:it=>it.courseId,
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
            list?
                <GroupByFlat depth={0} groupByArr={groupByArr} list={list} language={language} />
            :
                <CirkularProgress color={'whiteSmoke'} />
    )
}
