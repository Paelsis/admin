import {useState} from 'react'
import Picklist, {Select} from '../components/Picklist'
import {Button, IconButton} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save'
import AddIcon from '@mui/icons-material/Add'
import CopyIcon from '@mui/icons-material/ContentCopy'
import EditTableWithPicklist from './EditTableWithPicklist';
import { serverPost_SLIM4 } from '../services/serverPost';
import { serverFetchData_SLIM4 } from '../services/serverFetch';


const COLUMNS_PACKAGE=[
    {type:'textarea', label:'Name (shown to customer)', name:'name',  placeholder:'Name in english', required:true},    
    {type:'text', label:'Shortname', name:'packageId',  placeholder:'Ex: PACKAGE_1', unique:true, required:true, },    
    {type:'number', label:'Nbr of WS', name:'wsCount',  placeholder:'Ex: 5'},    
    {type:'number', label:'Minutes WS', name:'minutes',  placeholder:450},    
    {type:'picklist', 
        name:'productType',  
        label:'Product-type',
        tableName:'tbl_package_product_type', 
        selectLabel:'nameEN', 
        selectValue:'productType',
        required:true,
        unique:true,
    },    
    {type:'number', label:'Price(SEK)', name:'priceSEK',  placeholder:'Ex: 300 SEK', required:true},    
    {type:'number', label:'Price(EUR)', name:'priceEUR',  placeholder:'Ex: 300 EUR'},    
    {type:'checkbox', label:'Luxury pack', name:'allWorkshops'},    
    {type: 'number', label:'Sekvens nummer', name:'sequenceNumber',  placeholder:'1,2,...N'},    
]

const COLUMNS_WORKSHOP=[
//    {label:'Schedule', name:'scheduleId',  type:'select', tableName:'tbl_schedule_def', selectKey:'scheduleId', selectValue:'scheduleId', hidden:true},    
//    {label:'Workshop def', name:'workshopId',  type:'select', placeholer:'tbl_workshop_def', selectKey:'workshopId', selectValue:'workshopId'},    
//    {label:'Workshop id', name:'workshopId',  type:'text', placeholer:'Workshop Id'},    
    {type:'textarea', label:'Name (shown to customer)', name:'name',  placeholder:'Name in english', required:true, unique:true},    
    {type:'text', label:'Shortname', name:'workshopId', placeholder:'Short name', required:true, unique:true},    
    {type:'number', label:'Nbr of WS', name:'wsCount', placeholder:1},  
    {type:'number', label:'Minutes WS', name:'minutes', placeholder:90},  
    {type:'select', 
        name:'productType',  
        label:'Product-type',
        tableName:'tbl_workshop_product_type', 
        selectLabel:'productType', 
        selectValue:'productType',
        required:true,
        unique:true,
    },    
    {type:'number', label:'Price(SEK)', name:'priceSEK',  placeholder:'Ex: 300 SEK', required:true},    
    {type:'number', label:'Price(EUR)', name:'priceEUR',  placeholder:'Ex: 300 EUR'},    
    {type:'select', 
        label:'Teacher1',
        name:'teacher1',  // Name of varible where we save data
        tableName:'v_ref_teacher', 
        selectLabel:'name',  // Column-name in tableName that is shown in picklist as item label
        selectValue:'shortName', // Column-name in tableName that is used as value when onClick is sending its value
        required:true,
        unique:true,
    },    
    {type:'select', 
        label:'Teacher2',
        name:'teacher2',  
        tableName:'v_ref_teacher', 
        selectLabel:'name', 
        selectValue:'shortName',
        required:true,
        unique:true,
    },    
    {type:'select', 
        label:'Location',
        tableName:'tbl_site', 
        name:'siteId',
        selectLabel:'siteName', 
        selectValue:'siteId',
        required:true,
        unique:true,
    },    
    {type:'date', label:'Start date', name:'startDate',  placeholder:'YYYY-MM-DD', required:true},    
    {type:'time', label:'Time', name:'startTime', placeholder:'HH:MI', required:true},    
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

const AddRow = ({columns, list, setList}) => {
    const [value, setValue] = useState({})
    return(
        <div className='columns is-bottom'>
            {columns.map(col => 
                <div className='column'>
                    <Column col={col} value={value} setValue={setValue} />
                </div>
            )}    
            <div className='column'>
            <IconButton>
                <AddIcon onClick={()=>setList([...list, value])} />
            </IconButton>
            </div>
        </div>    
    )
 }

 const ViewRow = ({columns, row, setRow}) => {
    return(
        <div className='columns is-bottom'>
            {columns.map(col => 
                <div className='column'>
                    <Column noLabel={true} col={col} value={row} setValue={v=>setRow({...row, [col.name]:v})} />
                </div>
            )}    
            <div className='column'>
            <IconButton>
                <AddIcon/>
            </IconButton>
            <IconButton>
                <SaveIcon/>
            </IconButton>
            <IconButton>
                <CopyIcon/>
            </IconButton>
            </div>
        </div>    
    )
 }


export default () =>
{
    const [templateName, setTemplateName] = useState([])
    const [workshops, setWorkshops] = useState([])
    const [packages, setPackages] = useState([])

    const handleReplyUpdate = data => {
        if (data.status?data.status === 'OK':false) {
            setWorkshops(data.workshops)
            setPackages(data.packages)
        } else {
            alert('ERROR: Message:' +  data.message?data.message:JSON.stringify(data))
        }
    }    
    
    
    const handleUpdate = () => {
        const data = {
            workshops:{...workshops.filter(it=>it.checked).map(it=>({...it, templateName}))},
            packages:{...packages.filter(it=>it.checked).map(it=>({...it, templateName}))}
        } 
        serverPost_SLIM4('/updateTemplateFestival', data, handleReplyUpdate)
    }
    

    const handleFetchTemplateReply = data => {
        if (data.status?data.status === 'OK':false) {
            setWorkshops(data.workshops)
            setPackages(data.packages)
        } else {
            alert('ERROR: Message:' +  data.message?data.message:JSON.stringify(data))
        }
    }    
   
    const handleFetchTemplate = value => {
        setTemplateName(value)
        serverFetchData_SLIM4('/fetchFestivalTemplate?templateName=' + templateName, handleFetchTemplateReply)
    }    
    return(
        <div style={{position:'relative'}}>
            <Picklist 
                labelButton='Template' 
                tableName='tbl_workshop_template' l
                labelName='templateName' 
                valueName='templateName' 
                value={templateName} 
                handleClick={handleFetchTemplate} unique={true} 
                close={true} // Close after pick
            />
            <h1 className="is-size-3">Packages</h1>
            <EditTableWithPicklist columns={COLUMNS_PACKAGE} list={packages} setList={setPackages} />
            <h1 className="is-size-3">Workshops</h1>
            <EditTableWithPicklist columns={COLUMNS_WORKSHOP} list={workshops} setList={setWorkshops} />
            <IconButton onClick={handleUpdate}>
            <SaveIcon />
            </IconButton>    
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
