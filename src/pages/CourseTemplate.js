import {useState, useEffect} from 'react'
import {PicklistButtonGroups, Select} from '../components/Picklist'
import {CircularProgress, IconButton} from '@mui/material';
import SaveIcon from '@mui/icons-material/SaveOutlined'
import SaveAsIcon from '@mui/icons-material/SaveAsOutlined';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Tooltip from '@mui/material/Tooltip';
import EditTableWithSelect from '../components/EditTableWithSelect';
import { serverPost } from '../services/serverPost';
import { uniqueObjectList } from '../services/functions'
import { serverFetchData } from '../services/serverFetch';
import StatusMessage from '../components/StatusMessage';
import {STATUS_STYLE} from '../services/constant'


const COLUMNS_COURSE = [
    {
        type:'select', 
        label:'Course', 
        name:'courseId', 
        tableName:'tbl_course_def', 
        selectLabel:'nameEN', 
        selectValue:'courseId', 
        unique:true,  
        required:true,  
        tooltip:'Unique courseId from the course defintions'
    },     
    {
        type:'select', 
        label:'Lärare 1', 
        name:'teacher1', 
        tableName:'v_ref_teacher', 
        selectLabel:'name', 
        selectValue:'shortName', 
        unique:true, 
        required:true,
        tooltip:'First teacher on the course (course responsible)'
    },    
    {
        type:'select', 
        label:'Lärare 2', 
        name:'teacher2', 
        tableName:'v_ref_teacher', 
        selectLabel:'name', 
        selectValue:'shortName', 
        unique:true, 
        required:true,
        tooltip:'First teacher on the course (course responsible)'
    },    
    {
        type:'select', 
        label:'Plats', 
        name:'siteId', 
        tableName:'tbl_site', 
        selectLabel:'siteName', 
        selectValue:'siteId', 
        unique:true,
        required:true,
        tooltip:'Location of the course'
    },    
    {type:'date', label:'Startdatum', name:'startDate', placeholder:'YYYY-MM-DD', required:true, tooltip:'Start date for the course'},    
    {type:'time', label:'Tid', name:'startTime', placeholder:'HH:MI', required:true, tooltip:'Starttime when the course is given'},    
    {type:'date', label:'Slutdatum', name:'endDate', placeholder:'YYYY-MM-DD', tooltip:'Course is not displayed on homepage 2 days after this date'},    
    {type:'checkbox', label:'Online', name:'online', tooltip:'Check this box if the course is given online on Zoom'},    
    {type:'number', label:'Max leaders', name:'maxLeader', tooltip:'Upper limit for leaders'},    
    {type:'number',  label:'Max followers', name:'maxFollower', tooltip:'Upper limit for followers'},    
    {type:'number', label:'Max total', name:'maxTotal', tooltip:'Upper limit for number of of registrations'},    
]

export default () =>
{
    const [templateName, setTemplateName] = useState()
    const [courses, setCourses] = useState([])
    const [status, setStatus] = useState({})
    const [groups, setGroups] = useState()
    const [reloadCounter, setReloadCounter]=useState(0)

    const sortFunc = (a,b)=>a.startDate.substring(0,4).localeCompare(b.startDate.substring(0,4))

    const handleReply = reply => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK' || data.status === 'true' || data.status) {
            const labelName = 'templateName'
            const list =  uniqueObjectList(data.result, labelName).sort(sortFunc)
            const groups = Object.groupBy(list, it=>it.startDate.substring(0,4))
            setGroups(groups)
        } else {
            alert('ERROR: Call to get data for picklist failed. Message:' + data.message?data.message:'')
        }
    }    

    useEffect(()=>{
            const url = '/fetchRows?tableName=tbl_course_template'
            serverFetchData(url, handleReply)
    }, [reloadCounter])


    const handleReplyWithoutOKStatus = data => {
        const dt = new Date().toLocaleString()
        if (data.status?data.status === 'OK':false) {
            // Nothing
        } else {
            const message = data.message?data.message:'ERROR:Failed database operation at ' + dt
            ({style:STATUS_STYLE.ERROR, message})
            alert('ERROR: Message:' +  data.message?data.message:JSON.stringify(data))
        }
    }    


    const handleDefaultReply = data => {
        const dt = new Date().toLocaleString()
        if (data.status?data.status === 'OK':false) {
            const message = data.message?data.message:'OK: Successful database operation at ' + dt
            setStatus({style:STATUS_STYLE.OK, message})
            setReloadCounter(reloadCounter+1)
        } else {
            const message = data.message?data.message + ' ' + dt:'Failed database operation at ' + dt
            setStatus({style:STATUS_STYLE.ERROR, message})
            alert('ERROR: Message:' +  data.message?data.message:JSON.stringify(data))
        }
    }    

    const handleUpdateAs = () => {
        const ans = window.prompt("Please enter templateName (Examples:SUMMER_2024 or FESTIVALITO_2024, EASTER_2025", templateName);
        if (ans === null) {
            alert('No template name given. Nothing saved.')
        } else {   
            setTemplateName(ans)
            const data = {
                templateName:ans, 
                courses: [...courses.map(it=>({...it, online:it.online==1?1:0, templateName:ans}))], 
            }
            serverPost('/updateCourseTemplate', data, handleDefaultReply)
        }    
    }


    const handleUpdate = () => {
        let ans = templateName
        if (!templateName) {
            ans = window.prompt("Please enter the desired template name");

            if (ans === "") {
                return 
            } else {    
                setTemplateName(ans)
            } 
        } 
      
        const data = {
            templateName:ans, 
            courses:courses.map(it=>({...it, online:it.online==1?1:0, templateName:ans})),
        }
        // alert(JSON.stringify(courses.map(it=>it.courseId)))
        serverPost('/updateCourseTemplate', data, handleReplyWithoutOKStatus)
    }

    const handleAdd = list => {
        let templateNameReply = templateName
        if (!templateName) {
            templateNameReply = window.prompt("Please enter the desired template name");

            if (templateNameReply === "") {
                return 
            } else {    
                setTemplateName(templateNameReply)
            } 
        } 
      
        const data = {
            templateName:templateNameReply, 
            courses:list.map(it=>({...it, online:it.online==1?1:0, templateName:templateNameReply})),
        }
        serverPost('/updateCourseTemplate', data, handleDefaultReply)
    }

    const handleDeleteRow = (tableName, id) => {
        const data = {
            tableName,
            id
        }
        serverPost('/deleteRow', data, handleDefaultReply)
    }
    
    const handleFetchTemplateReply = data => {
        const dt = new Date().toLocaleString()
        if (data.status?data.status === 'OK':false) {
            const templateNameReply = 
                data.courses.length > 0?data.courses[0].templateName
                :'Unknown'
            setTemplateName(templateNameReply)
            setCourses(data.courses?data.courses:[])
        } else {
            const message = data.message?(data.message + ' ' + dt):('Failed to fetch template at ' + dt)
            setStatus({style:STATUS_STYLE.ERROR, message})
            alert('ERROR: Message:' +  data.message?data.message:JSON.stringify(data))
        }
    }    
   
    const handleFetchTemplate = value => {
        serverFetchData('/fetchCourseTemplate?templateName=' + value, handleFetchTemplateReply)
    }    

    const handleReleaseProductionReply = data => {
        if (data.status?data.status === 'OK':false) {
            setStatus({style:STATUS_STYLE.OK, message:'Release successful'})
            setTimeout(()=>{
                setTemplateName(templateName)
                alert(data.message?data.message:'Successful release of template')
            }, 1000)
        } else {
            setStatus({style:STATUS_STYLE.ERROR, message:data.message})
            setTimeout(()=>{
                setTemplateName(templateName)
            }, 1000)
            alert('ERROR: Message:' +  data.message?data.message:JSON.stringify(data))
        }
    }    

    const handleReleaseProduction = () => {
        const data = {
            templateName,
        }
        serverPost('/releaseCourse', data, handleReleaseProductionReply)
    }    

    const handleDeleteTemplateProductionReply = data => {
        const dt = new Date().toLocaleString()
        if (data.status?data.status === 'OK':false) {
            const message = data.message?data.message:'Successful delete at ' + dt
            setReloadCounter(reloadCounter + 1)
            setStatus({status:STATUS_STYLE.OK, message})
            setTemplateName(templateName)
        } else {
            const message = data.message?data.message:'Failed to delete at ' + dt
            setStatus({style:STATUS_STYLE.ERROR, message})
            alert('ERROR: Message:' +  data.message?data.message:JSON.stringify(data))
        }
    }    



    const handleDeleteTemplateProduction = () => {
        const defaultValue = templateName?templateName:'All'
        const ans = window.prompt("Please enter the template name (or All) for the template you want to remove from production", defaultValue);
        if (ans === "All") {
            if (!window.confirm("Are you sure you want to remove all festival templates from production")) {
                // Cancel
                return
            }
        } 
        const data = ans === "All"?{}:{templateName:ans}
        serverPost('/deleteCourseTemplateProduction', data, handleDeleteTemplateProductionReply)
    }

    const handleDeleteTemplateReply = data => {
        const dt = new Date().toLocaleString()
        if (data.status?data.status === 'OK':false) {
            const message = data.message?data.message:'Successful delete at ' + dt
            setStatus({status:STATUS_STYLE.OK, message})
            setTemplateName(templateName)
            setReloadCounter(reloadCounter + 1)
            setCourses([])
            //setTimeout(()=>window.location.reload(), 2000)
        } else {
            const message = data.message?data.message:'Failed to delete at ' + dt
            setStatus({style:STATUS_STYLE.ERROR, message})
            alert('ERROR: Message:' +  data.message?data.message:JSON.stringify(data))
        }
    }    



    const handleDeleteTemplate = () => {
        const ans = window.prompt("Please enter a template name that you want to remove", templateName);

        if (ans === "") {
            return 
        } else {    
            if (!window.confirm("Are you sure you want to remove template " + templateName + " from template tables")) {
                // Cancel
                return
            }
        } 

        const data = {templateName}
        serverPost('/deleteCourseTemplate', data, handleDeleteTemplateReply)
    }

    return(
        <div style={{position:'relative'}}>
            <PicklistButtonGroups 
                groups={groups}
                labelButton='Template'
                labelName='templateName' 
                valueName='templateName' 
                value={templateName} 
                handleClick={handleFetchTemplate}
                close={true} // Close after pick
            />
            {courses?courses.length > 0?
                <div className="columns is-centered" style={{paddingTop:20}}>
                    <div className='is-size-3'>{templateName}</div>
                </div>
            :null:null}    
            <EditTableWithSelect 
                columns={COLUMNS_COURSE} 
                list={courses} 
                setList={setCourses} 
                handleUpdate={handleUpdate} 
                handleDelete={id=>handleDeleteRow('tbl_course_template', id)} 
                handleAdd={handleAdd}
            />
            {courses?   
                <>
                    <Tooltip title='Save the course template'>
                        <IconButton onClick={handleUpdate}>
                            <SaveIcon />
                        </IconButton>    
                    </Tooltip>    
        
                    <Tooltip title='Save the course template under a new name'>
                    <IconButton onClick={handleUpdateAs}>
                        <SaveAsIcon  />
                    </IconButton>    
                    </Tooltip>    
                
                    <Tooltip title='Release course template to production'>
                    <IconButton onClick={handleReleaseProduction}>
                        <MoveUpIcon />
                    </IconButton>    
                    </Tooltip>    
                
                    <Tooltip title='Delete current template from table with course templates'>
                    <IconButton onClick={handleDeleteTemplate}>
                        <DeleteOutlineIcon />
                    </IconButton>    
                    </Tooltip>    
                
                    <Tooltip title='Delete course template/s from production'>
                    <IconButton onClick={handleDeleteTemplateProduction}>
                        <DeleteSweepIcon />
                    </IconButton>    
                    </Tooltip>    
                </>
            :<CircularProgress />}
            <StatusMessage status={status} />
        </div>
    )
}

/*
<div className="columns is-size-1 is-12 is-centered">{templateName}</div>
<AddRow columns = {COLUMNS_PACKAGE} list={packages} setList={setPackages} />
{packages.length > 0?<h3 className="is-size-4">List of packages</h3>:null}
{packages.map((row, idx1)=>
    <p>
        <ViewRow columns={COLUMNS_PACKAGE} row={row} setRow={row=>packages.map((it, idx2)=>idx1===idx2?row:it)} />
    </p>

)}
<h1 className="is-size-3">Workshop</h1>
<AddRow columns = {COLUMNS_WORKSHOP} list={workshops} setList={setWorkshops} />
{workshops.length > 0?<h3 className="is-size-4">List of workshops</h3>:null}
{workshops.map((row, idx1)=>
    <small>
        <ViewRow columns={COLUMNS_WORKSHOP} row={row} setRow={row=>workshops.map((it, idx2)=>idx1===idx2?row:it)} />
    </small>
)}
*/
