import {useState, useEffect} from 'react'
import {useSharedState} from '../store'
import {isNormalVariable} from '../services/functions'
import {serverFetchData} from "../services/serverFetch"
import {GroupByRecursive} from "../components/GroupByRecursive"
import CirkularProgress from '../components/CirkularProgress'
import ViewTable from '../components/ViewTable'
import { Button} from '@mui/material';
import { orange, red } from '@mui/material/colors';
import moment from 'moment'
import {replaceRow} from "../services/serverPost"
import {IconButton} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save'
import TextArea from 'react-textarea-autosize';

const apiBaseUrl=process.env.REACT_APP_API_BASE_URL;

const TABLE_NAME='tbl_teacher_note'

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
    const {depth, groupByArr, list} = props
    const groupByItem = groupByArr[depth]
    const style = groupByItem.style?groupByItem.style:styles.default
    const columns = groupByItem.headerFields
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
    const {depth, groupByArr, list, columns} = props
    const groupByItem = groupByArr[depth]
    const tableName = TABLE_NAME
    const colsView = list?groupByItem.colsView?groupByItem.colsView:Object.keys(list[0]):undefined
    const colsEdit = list?groupByItem.colsEdit?groupByItem.colsEdit:Object.keys(list[0]):undefined

    return(
        list?
            <ViewTable tableName={tableName} colsView={colsView} colsEdit={colsEdit} colObjList={columns} {...props} />
        :
            <CirkularProgress color={'whiteSmoke'} style={styles.circular} />
    )
}


export const _ViewNote = props => {
    const {list, originalList, setOriginalList} = props
    const productId = list[list.length -1].productId
    const [value, setValue] = useState({courseDate:moment().format('YYYY-MM-DD'), textId:productId, textBody:undefined})
    const courseName = list[list.length -1].courseName 

    const sortFunc = (a,b)=>{
        if (a.courseDate && b.courseDate) {
            a.courseDate.localeCompare(b.courseDate)
        } else if (!a.courseDate) {
            return -1
        } else {
            return 1
        }   
    }


    const handleChange = e => {
        setValue({...value, [e.target.name]:e.target.value})
    } 

    const handleReply = (reply, record) => {
        if (reply.status === 'OK') {
            const recordWithId = {...list[0], ...reply.record}
            const newList = [...originalList, recordWithId]
            // alert(JSON.stringify(recordWithId))
            setOriginalList(newList)
            setValue({...value, textBody:undefined})
            // alert('Updated ' + JSON.stringify(originalList))
        } else {
            alert('Error' + reply.message?reply.message:JSON.stringify(reply))
        }
    }

    const handleSubmit = e => {
        e.preventDefault()
        const record = {
            productId,
            courseName,
            courseDate:value.courseDate,
            textBody:value.textBody,
            id:undefined, 
        }
        // alert(JSON.stringify(adjValue))

        replaceRow(TABLE_NAME, record, reply=>handleReply(reply, record)) 
    }

    const style = {fontSize:'normal',padding: "12px 20px", margin: "8px 0", boxSizing: "border-box"}

    return (
        <div style={{width:'100vw', marginTop:20}}>
            <form onSubmit={handleSubmit}>      
                <div className="columns is-centered">
                    <div className="column is-2">
                        <label>Course date:&nbsp;
                            <input type="date" name='courseDate' value={value.courseDate} onChange={handleChange} />
                            <p/>   
                        </label> 
                    </div>    
                    <div className="column is-3">
                        <TextArea
                             type="text" 
                             autoFocus={true}
                             name="textBody" 
                             rows={4} 
                             cols={50} 
                             value={value.textBody?value.textBody:''} 
                             required 
                             placeholder={'Teachers note ...'} 
                             onChange={handleChange}
                        /> 
                    </div>
                    <div className="column is-1">
                        <IconButton type='submit' >
                            <SaveIcon />
                        </IconButton>
                     </div>
                     <div className="column is-5">
                        <_ViewTable {...props} list={list.sort(sortFunc)} />
                     </div>   
                </div>
            </form>
        </div>
    )
}

const GROUP_BY_ARR = [
    {
        groupByFunc:it=>it.scheduleId, 
        headerFields:['scheduleName', 'year'],
        RenderView:_ViewBar,
        style:{
                padding:10,
                width:'100vw', 
                maxWidth:'100%', 
                backgroundColor:orange[300],
                className:'columns'
        }, 
    },    
    {
        groupByFunc:it=>it.city, 
        headerFields:['city'],
        RenderView:_ViewBar,
        style:{
                padding:10,
                width:'100vw', 
                maxWidth:'100%', 
                backgroundColor:orange[500]
        }, 
    },    
    {
        groupByFunc:it=>it.dayOfWeekStartDate, 
        headerFields:['daynameStartDate'],
        RenderView:_ViewBar,
        style:{
                padding:10,
                width:'100vw', 
                maxWidth:'100%', 
                backgroundColor:orange[700]
        }, 
    },    
    {
        groupByFunc:it=>it.productId, 
        headerFields:['courseName', 'daynameStartDate', 'startTime'],
        sortBy:'dayOfWeek',
        RenderView:_ViewBar,
        style:{
                padding:10,
                width:'100vw', 
                maxWidth:'100%', 
                backgroundColor:orange[900]
        }, 
    },    
    {
        groupByField:'productId',
        headerFields:['courseName', 'courseId', 'dayname', 'startTime', 'siteName', 'startDate'], 
        colsView:['courseDate', 'textBody'],
        colsEdit:['textBody'],
        RenderView:_ViewNote,
        style:{
            width:'100vw', 
            maxWidth:'100%', 
            padding:10,
            backgroundColor:orange[800]
        }, 
    },
];

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
        const url1 = apiBaseUrl + '/getTeacherNote?language=' + sharedState.language
        serverFetchData(url1, handleReply1)
        const url2='/getColumns?tableName=tbl_teacher_note'
        serverFetchData(url2, handleReply2) 
    }, [language])

    return(
        <>
            {(list&&columns)?
                <GroupByRecursive 
                    depth={0} 
                    list={list} 
                    columns={columns} 
                    language={language}
                    groupByArr={GROUP_BY_ARR} 
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
