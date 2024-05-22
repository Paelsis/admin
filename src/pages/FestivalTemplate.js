import {useState} from 'react'
import Picklist from '../components/Picklist'
import Select from '../components/Select'
import {Button, IconButton} from '@mui/material';
import SaveIcon from '@mui/icons-material/SaveOutlined'
import SaveAsIcon from '@mui/icons-material/SaveAsOutlined';
import AddIcon from '@mui/icons-material/Add'
import CopyIcon from '@mui/icons-material/ContentCopy'
import MoveUpIcon from '@mui/icons-material/MoveUp';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Tooltip from '@mui/material/Tooltip';
import EditTableWithSelect from '../components/EditTableWithSelect';
import { serverPost } from '../services/serverPost';
import { serverFetchData } from '../services/serverFetch';
import StatusMessage from '../components/StatusMessage';
import {STATUS_STYLE} from '../services/constant'


const COLUMNS_SCHEDULE=[
    {type:'text', label:'Festival name SV', name:'nameSV',  placeholder:'Namn på svenska', required:true, cols:30, maxlength:50,
        tooltip:'Swedish title of the event'},   
    {type:'text', label:'Festival name EN', name:'nameEN',  placeholder:'Namn på engelska', required:true, cols:30, maxlength:50,
        tooltip:'English title of the event'},   
    {type:'select', 
        name:'eventType',  
        label:'Event type',
        tableName:'ref_event_type', 
        selectLabel:'eventType', 
        selectValue:'eventType',
        required:true,
        unique:true,
        tooltip:'Identifies on what page the event shall be shown'
    },    
    {type:'date', label:'Startdate reg', name:'openRegDate',  required:true, tooltip:'Start registration date'},    
    {type:'time', label:'Starttime reg', name:'openRegTime',  required:true, tooltip:'Start registration time at date above'},    
    {type:'date', label:'Startdate', name:'startDate',  required:true, tooltip:'Start date for event'},    
    {type:'time', label:'Starttime', name:'startTime',  required:true, tooltip:'Start time for event'},    
    {type:'date', label:'Enddate', name:'endDate',  required:true, tooltip:'End date for event'},    
    {type:'time', label:'Endtime', name:'endTime',  required:true, tooltip:'End time for event at end date'},    
    {type:'text', label:'Image url (url)', name:'replyImage', tooltip:'URL to the image sent in the reply mail at registration'},    
    {type:'number', label:'Max imbalance', name:'maxImbalance', tooltip:'Max allowed imbalance between leaders and followers'},    
    {type:'number', label:'Max participants', name:'maxParticipants', tooltip: 'Max allowed number of participants'},    
]

const COLUMNS_PACKAGE=[
    {type:'text', label:'Shortname', name:'packageId', unique:true, required:true, maxlength:50,
          tooltip:'Unieue package key that is used to map package to registrations'},    
    {type:'text', label:'Package name', name:'name',  cols:15, required:true, maxlength:500,
          tooltip:'Name of the package shown in registration form'},    
    {type:'textarea', label:'Description', name:'description',  cols:20, maxlength:1000,
          tooltip:'Full description of the contents of the package'},
    {type:'number', label:'Nbr of WS', name:'wsCount',  required:true,
        tooltip:'Number of units (1,2 or 3) that this workshop has when counting for package pricing'
    },    
    {type:'number', label:'Minutes WS', name:'minutes',  placeholder:450, required:true,    
        tooltip:'Number of minutes that this workshop lasts when counting for package pricing'
    },    
    {type:'select', 
        name:'productType',  
        label:'Product-type',
        tableName:'tbl_package_product_type', 
        selectLabel:'nameEN', 
        selectValue:'productType',
        unique:true,
        required:true,
        tooltip:'Used for counting the different tracks when makeing package pricing'
    },    
    {type:'number', label:'Price(SEK)', name:'priceSEK', required:true,    
        tooltip:'Price for the package in SEK'},
    {type:'number', label:'Price(EUR)', name:'priceEUR',     
        tooltip:'Price for the package in EUR'},
    {type:'checkbox', label:'Luxury pack', name:'allWorkshops',    
        tooltip:'Luxury pack includes all dancing and all workshops'},
    {type: 'number', label:'Sekvens nummer', name:'sequenceNumber', 
        tooltip:'Sequence number of the presentation of the pakcagein the registration form'},
]

const COLUMNS_WORKSHOP=[
//    {label:'Schedule', name:'scheduleId',  type:'select', tableName:'tbl_schedule_def', selectKey:'scheduleId', selectValue:'scheduleId', hidden:true},    
//    {label:'Workshop def', name:'workshopId',  type:'select', placeholer:'tbl_workshop_def', selectKey:'workshopId', selectValue:'workshopId'},    
//    {label:'Workshop id', name:'workshopId',  type:'text', placeholer:'Workshop Id'},    
    {type:'text', label:'Shortname', name:'workshopId', unique:true, required:true, maxlength:50, 
        tooltip:'Per festival unique key that is used to connect registration with the proper workshop'},    
    {type:'text', label:'Workshop name', name:'name',  required:true, unique:true, cols:15, maxlength:500, 
        tooltip:'Name of the workshop shown in the registration form '},    
    {type:'textarea', label:'Description', name:'description',  placeholder:'Description', unique:true, cols:20, maxlength:1000, 
        tooltip:'Name of the workshop'},    
    {type:'number', label:'Nbr of WS', name:'wsCount', required:true, 
        tooltip:'Number workhops this workshop shall count for in package counting (Some counts as 2 or 3)'},  
    {type:'number', label:'Minutes WS', name:'minutes', required:true, 
        tooltip:'The number of minutes that the workshop lasts'},  
    {type:'select', 
        name:'productType',  
        label:'Product-type',
        tableName:'tbl_workshop_product_type', 
        selectLabel:'productType', 
        selectValue:'productType',
        unique:true,
        required:true,
        tooltip:'Kind of workshop used for calculating package price',
    },    
    {type:'number', label:'Price(SEK)', name:'priceSEK',  required:true, tooltip:'Price given in SEK'},    
    {type:'number', label:'Price(EUR)', name:'priceEUR',  tooltip:'Price given in EUR'},    
    {type:'select', 
        label:'Teacher1',
        name:'teacher1',  // Name of varible where we save data
        tableName:'v_ref_teacher', 
        selectLabel:'name',  // Column-name in tableName that is shown in picklist as item label
        selectValue:'shortName', // Column-name in tableName that is used as value when onClick is sending its value
        unique:true,
        required:true,
        tooltip:'Responsible first teacher of the workshop',

    },    
    {type:'select', 
        label:'Teacher2',
        name:'teacher2',  
        tableName:'v_ref_teacher', 
        selectLabel:'name', 
        selectValue:'shortName',
        unique:true,
        required:true,
        tooltip:'Second teacher of the workshop',
    },    
    {type:'select', 
        label:'Location',
        tableName:'tbl_site', 
        name:'siteId',
        selectLabel:'siteName', 
        selectValue:'siteId',
        required:true,
        unique:true,
        tooltip:'Location for the workshop',
    },    
    {type:'date', label:'Start date', name:'startDate',  required:true, tooltip:''},    
    {type:'time', label:'Time', name:'startTime', placeholder:'HH:MI', required:true, tooltip:''},    
]


const Column = ({noLabel, col, value, setValue}) => {
    const defaultArguments = {
        type:col.type,
        name:col.name,
        placeholder:noLabel?col.name:col.placeholder,
        checked:col.type === 'checkbox'?value[col.name]:undefined,
        value:col.type === 'checkbox'?undefined:(value[col.name]?value[col.name]:''),
        required:col.required,
        radioValues:col.type==='radio'?col.radioValues:undefined,
    } 
    const label = col.label?col.label:'No label'
    const labelStyle = col.labelStyle?col.labelStyle:{}
    const supStyle = col.supStyle?col.supStyle:undefined
    const selectValues = col.selectValues?col.selectValues:['ADAM', 'BERTIL', 'CESAR']

    const handleChange = e => {
        setValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked:e.target.value})
    }    

    return(
        <>
            {noLabel?null:
                <>
                <label style={labelStyle}>
                        {label}&nbsp;{col.required?<sup style={supStyle?supStyle:{}}>*</sup>:null}&nbsp;
                </label>    
                <br />
                </>
            }
        {col.type === 'textarea'?
                <>
                <textarea 
                    {...defaultArguments}
                    cols={col.cols?col.cols:20} 
                    rows={1} 
                    onChange={handleChange}
                />
                </>
            :col.type === 'radio'?
                    <>
                        <label style={{fontWeight:500}}>
                                {label}&nbsp;{col.required?<sup style={supStyle}>*</sup>:null}&nbsp;
                        </label>    
                        <br/>
                        {col.radioValues?col.radioValues.map((radio, idx) =>
                            <label>
                                <input 
                                    {...defaultArguments}
                                    // checked={value[col.name] === (radio.value?radio.value:radio)}
                                    onChange={handleChange}
                                />
                                &nbsp;<span>{radio.label?radio.label:radio}</span>&nbsp;
                            </label>
                            )
                        :
                            <h1>No radio values</h1>
                        }
                    </> 
            :col.type === 'select'?
                <>      
                    <Select 
                        {...col}
                        value={value[col.name]?value[col.name]:''}
                        handleClick={val => setValue({...value, [col.name]:val})} 
                    />
                </>
            :
            <>
                <input 
                    {...defaultArguments} 
                    onChange={handleChange}
                />

            </>
            }
        </>
    )    
}

export default () =>
{
    const [templateName, setTemplateName] = useState()
    const [schedules, setSchedules] = useState([])
    const [workshops, setWorkshops] = useState([])
    const [packages, setPackages] = useState([])
    const [status, setStatus] = useState({})
    const [reloadCounter, setReloadCounter] = useState(0)

    const handleDefaultReply = data => {
        const dt = new Date().toLocaleString()
        if (data.status?data.status === 'OK':false) {
            setReloadCounter(reloadCounter+1)
            setStatus({style:STATUS_STYLE.OK, message:'OK:' + data.message?data.message + ' ' + dt:'Successful database operation at ' + dt})
        } else {
            setStatus({style:STATUS_STYLE.ERROR, message:data.message?data.message + ' ' + dt:'Failed database operation at ' + dt})
            alert('ERROR: Message:' +  data.message?data.message:JSON.stringify(data))
        }
    }    

    const handleUpdateAs = () => {

        const ans = window.prompt("Please enter templateName (Examples:SUMMER_2024 or FESTIVALITO_2024, EASTER_2025", templateName);
        if (ans === null) {
            alert('Nothing saved')
        } else {   
            setTemplateName(ans)
            const data = {
                templateName:ans, 
                schedules: [...schedules.map(it=>({...it, id:undefined, templateName:ans}))], 
                workshops:[...workshops.filter(it=>it.checked).map(it=>({...it, id:undefined, templateName:ans}))],
                packages:[...packages.filter(it=>it.checked).map(it=>({...it, id:undefined, templateName:ans}))]
            }
            serverPost('/updateFestivalTemplate', data, handleDefaultReply)
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

        const eventType = schedules?schedules[0]?schedules[0].eventType?schedules[0].eventType:'UNKOWN':'UNKOWN_1':'UNKOWN_2'
        const startDate = schedules?schedules[0]?schedules[0].startDate?schedules[0].startDate:'2000-01-01':'2000-01-02':'2000-01-03'
        const d = new Date(startDate);
        let year = d.getFullYear();

        const data = {
            templateName:ans, 
            schedules:schedules.map(it=>({...it, templateName:ans, eventType})),
            workshops:workshops.map(it=>({...it, templateName:ans, eventType, year})),
            packages:packages.map(it=>({...it, templateName:ans, eventType, year}))
        }
        serverPost('/updateFestivalTemplate', data, handleDefaultReply)
    }

    const handleAddPackages = list => {
        const eventType = schedules?schedules[0]?schedules[0].eventType?schedules[0].eventType:'UNKOWN':'UNKOWN_1':'UNKOWN_2'
        const startDate = schedules?schedules[0]?schedules[0].startDate?schedules[0].startDate:'2000-01-01':'2000-01-02':'2000-01-03'
        const d = new Date(startDate);
        let year = d.getFullYear();

        const data = {
            templateName, 
            packages:list.map(it=>({...it, templateName, eventType, year}))
        }
        serverPost('/updateFestivalTemplate', data, handleDefaultReply)
    }

    const handleAddWorkshops = list => {
        const eventType = schedules?schedules[0]?schedules[0].eventType?schedules[0].eventType:'UNKOWN':'UNKOWN_1':'UNKOWN_2'
        const startDate = schedules?schedules[0]?schedules[0].startDate?schedules[0].startDate:'2000-01-01':'2000-01-02':'2000-01-03'
        const d = new Date(startDate);
        let year = d.getFullYear();

        const data = {
            templateName, 
            workshops:list.map(it=>({...it, templateName, eventType, year})),
        }
        serverPost('/updateFestivalTemplate', data, handleDefaultReply)
    }


    const handleDeleteRow = (tableName, id) => {
        const data = {
            tableName,
            id
        }
        serverPost('/deleteRow', data, data=>handleDefaultReply(data))
    }
    
    const handleFetchTemplateReply = data => {
        if (data.status?data.status === 'OK':false) {
            const templateNameReturn = 
                data.schedules.length > 0?data.schedules[0].templateName
                :data.packages.length > 0?data.packages[0].templateName 
                :data.workshops.length > 0?data.workshops[0].templateName
                :'Unknown'
            setTemplateName(templateNameReturn)
            setSchedules(data.schedules?data.schedules:[])
            setWorkshops(data.workshops)
            setPackages(data.packages)
        } else {
            alert('ERROR: Message:' +  data.message?data.message:JSON.stringify(data))
        }
    }    
   
    const handleFetchTemplate = value => {
        serverFetchData('/fetchFestivalTemplate?templateName=' + value, handleFetchTemplateReply)
    }    

    const handleReleaseProductionReply = data => {
        if (data.status?data.status === 'OK':false) {
            setStatus({style:STATUS_STYLE.OK, message:'Release successful'})
            setTimeout(()=>{
                setTemplateName(templateName)
                setReloadCounter(reloadCounter+1)
                alert(data.message?data.message:'Successful release of template')
            }, 1000)
        } else {
            setStatus({style:STATUS_STYLE.ERROR, message:data.message})
            setTimeout(()=>{
                setTemplateName(templateName)
            }, 21000)
            alert('ERROR: Message:' +  data.message?data.message:JSON.stringify(data))
        }
    }    

    const handleReleaseProduction = () => {
        const data = {
            templateName,
            /*
            schedules: [...schedules.map(it=>({...it, templateName}))], 
            workshops:[...workshops.filter(it=>it.checked).map(it=>({...it, templateName}))],
            packages:[...packages.filter(it=>it.checked).map(it=>({...it, templateName}))]
            */
        }
        serverPost('/releaseFestival', data, handleReleaseProductionReply)
    }    

    const handleDeleteTemplateProductionReply = data => {
        if (data.status?data.status === 'OK':false) {
            const message = data.message?data.message:'Successful delete'
            setStatus({status:STATUS_STYLE.OK, message})
            setTemplateName(templateName)
            setReloadCounter(reloadCounter+1)
        } else {
            const message = data.message?data.message:'Failed to delete'
            setStatus({style:STATUS_STYLE.ERROR, message})
            alert('ERROR: Message:' +  data.message?data.message:JSON.stringify(data))
        }
    }    

    const handleDeleteTemplateProduction = () => {
        const defaultValue = templateName?templateName:'All'
        const ans = window.prompt("Please enter a template name you want to remove from production (All means all templates)", defaultValue);
        if (ans === "All") {
            if (!window.confirm("Are you sure you want to remove all festival templates from production")) {
                // Cancel
                return
            }
        } 
        const data = ans === "All"?{}:{templateName:ans}
        serverPost('/deleteFestivalTemplateProduction', data, handleDeleteTemplateProductionReply)
    }

    const handleDeleteTemplateReply = data => {
        if (data.status?data.status === 'OK':false) {
            const message = data.message?data.message:'Successful delete'
            setReloadCounter(reloadCounter+1)
            setStatus({status:STATUS_STYLE.OK, message})
            setSchedules([])
            setPackages([])
            setWorkshops([])
            setTemplateName(undefined)
            // setTimeout(()=>window.location.reload(), 2000)
        } else {
            const message = data.message?data.message:'Failed to delete'
            setStatus({style:STATUS_STYLE.ERROR, message})
            alert('ERROR: Message:' +  data.message?data.message:JSON.stringify(data))
        }
    }    



    const handleDeleteTemplate = () => {
        const ans = window.prompt("Please enter a template Name you want to remove from production", templateName);

        if (ans === "") {
            return 
        } else {    
            if (!window.confirm("Are you sure you want to remove template " + templateName + " from template tables")) {
                // Cancel
                return
            }
        } 

        const data = {templateName}
        serverPost('/deleteFestivalTemplate', data, handleDeleteTemplateReply)
    }

    return(
        <div style={{position:'relative'}}>
            <Picklist 
                labelButton='Template' 
                tableName='tbl_event_template' 
                labelName='templateName' 
                valueName='templateName' 
                value={templateName} 
                handleClick={handleFetchTemplate} unique={true} 
                close={true} // Close after pick
                reloadCounter={reloadCounter}
            />
            {templateName?
                <div className="columns is-centered">
                    <div className='is-size-3'>{templateName}</div>
                </div>
            :null}    
            {schedules?schedules.length > 0?
                <h1 className="is-size-4">Schedule for {schedules[0].eventType + ' ' + schedules[0].startDate + ' - ' + schedules[0].endDate}</h1>
            :null:null}
            <EditTableWithSelect 
                columns={COLUMNS_SCHEDULE} 
                list={schedules} 
                setList={setSchedules} 
                noAddButton={true} 
                handleUpdate={handleUpdate} 
            />
            {packages?<h1 className="is-size-4">Packages</h1>:null}
            <EditTableWithSelect 
                columns={COLUMNS_PACKAGE} 
                list={packages} 
                setList={setPackages} 
                handleUpdate={handleUpdate} 
                handleDelete={id=>handleDeleteRow('tbl_package_template', id)} 
                handleAdd={handleAddPackages}
            />
            {workshops?<h1 className="is-size-4">Workshops</h1>:null}
            <EditTableWithSelect 
                columns={COLUMNS_WORKSHOP} 
                list={workshops} 
                setList={setWorkshops} 
                handleUpdate={handleUpdate} 
                handleDelete={id=>handleDeleteRow('tbl_workshop_template', id)} 
                handleAdd={handleAddWorkshops}
            />
            {schedules?   
                <>
                    <Tooltip title='Save the festival template'>
                        <IconButton onClick={handleUpdate}>
                            <SaveIcon />
                        </IconButton>    
                    </Tooltip>    
        
                    <Tooltip title='Save the the festival template under a new name'>
                    <IconButton onClick={handleUpdateAs}>
                        <SaveAsIcon  />
                    </IconButton>    
                    </Tooltip>    
                
                    <Tooltip title='Release the current festival template to production'>
                    <IconButton onClick={handleReleaseProduction}>
                        <MoveUpIcon />
                    </IconButton>    
                    </Tooltip>    
                
                    <Tooltip title='Deleted festival template from table with templates'>
                    <IconButton onClick={handleDeleteTemplate}>
                        <DeleteOutlineIcon />
                    </IconButton>    
                    </Tooltip>    
                
                    <Tooltip title='Delete festival template/s from production'>
                    <IconButton onClick={handleDeleteTemplateProduction}>
                        <DeleteSweepIcon />
                    </IconButton>    
                    </Tooltip>    
                </>
            :null}
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
