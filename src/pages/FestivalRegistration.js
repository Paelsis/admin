import {useState, useEffect} from 'react'
import {useSharedState} from '../store'
import { Tooltip, IconButton, Button} from '@mui/material';

// import { useNavigate, useParams }  from 'react-router-dom';
import {serverFetchData} from '../services/serverFetch'
import {serverPost} from '../services/serverPost'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import Picklist from '../components/Picklist'
import ViewTable from '../components/ViewTable'
import FormTemplate from '../components/FormTemplate'
import {ChecklistPackage, ChecklistWorkshop} from '../components/Checklist'
import {TEXT, registrationFields} from '../services/text'


const styles = {
    button:{},
    buttonOK:{color:'white', backgroundColor:'green', borderColor:'green'},
    buttonERROR:{color:'white', backgroundColor:'red', borderColor:'red'}
}
    

const FestivalRegistration =  () => {
    const [sharedState, ] = useSharedState()
    const language = sharedState.language
    const [schedules, setSchedules] = useState()
    const [packages, setPackages] = useState()
    const [workshops, setWorkshops] = useState()
    const [status, setStatus] = useState(false)
    const [events, setEvents] = useState()
    const [registration, setRegistration] = useState({})
    const groups = events?Object.groupBy(events, it=>(it.eventType + ' ' + it.year)):undefined
    const keys = groups?Object.keys(groups):undefined

    const handleReplyFetchEvents = reply => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            setEvents(data.result.map(it=>({...it, year:Number(it.startDate.substring(0,4))})))
        } else {
            alert('ERROR: Status:' + data.status + ' Message:' +  data.message)
        }   
    }

    useEffect(()=>{
        serverFetchData('/fetchRows?tableName=tbl_event', handleReplyFetchEvents) 
    }, [])

    const renderOutput = () => {

        const handleReplyUpdate = reply => {
            const data = reply.data?reply.data:reply
            if (data.status === 'OK') {
                const orderId = data.orderId?data.orderId:99999999
                const id = data.id?data.id:999999999
                // alert('Insert of new registration successful status=' + data.status + ' orderId=' + orderId + ' id=' + id)
                setStatus('OK')
                setTimeout(()=>setStatus(undefined), 2000)
            } else if (data.status === 'ERROR') {
                setStatus('ERROR')
                setTimeout(()=>setStatus(undefined), 2000)
                alert('ERROR: status=' + data.status + ' message=' +  (data.message?data.message:'No message'))
            } else {
                setStatus('ERROR')
                setTimeout(()=>setStatus(undefined), 2000)
                alert('ERROR: Problems with response, data:' + JSON.stringify(data))
            }   
        }
    
        const handleUpdate = () => {
            const eventType = schedules?schedules[0].eventType:undefined
            const dateRange = schedules?schedules[0].dateRange:undefined 
            const year = schedules?schedules[0].year:undefined
    
            const data = {
                registration:{...registration, id:undefined, eventType, dateRange, year}, 
                workshops:{...workshops.filter(it=>it.checked).map(it=>({...it, email:registration.email, role:registration.role, id:undefined}))},
                packages:{...packages.filter(it=>it.checked).map(it=>({...it, email:registration.email, role:registration.role, id:undefined}))}
            } 
            serverPost('/updateFestivalRegistration', data, handleReplyUpdate)
        }

        const buttons= [
            {
                variant:status==="OK"?'contained':'outlined',
                style:status==='OK'?styles.buttonOK:status==='ERROR'?styles.buttonERROR:styles.button,
                label:TEXT.registration.label[language],
                tooltip:TEXT.registration.tooltip[language],
                title:TEXT.registration.tooltip[language],
                validate:true,
                handleClick:handleUpdate
            },
            {
                variant:'outlined',
                label:TEXT.cancel.label[language],
                tooltip:TEXT.cancel.tooltip[language],
                title:TEXT.cancel.tooltip[language],
                handleClick:()=>setSchedules(undefined)
            }
        ]
        const eventType = schedules?schedules[0]?schedules[0].eventType?schedules[0].eventType:'No event type 1':'No event type 2':'No eventType 3'
        const year = schedules?schedules[0]?schedules[0].year?schedules[0].year:'No year 1':'No year 2':'year 3'
        return(
            <div className='columns is-centered'>
                <div className='column is-4'>
                    {schedules.length >0?
                        <>
                            <h1 className="title is-3">{eventType + ' ' + year}</h1>
                            <FormTemplate fields = {registrationFields(language)} value={registration?registration:{}} setValue={setRegistration} buttons={buttons}>
                                <>
                                    <h5 className='title is-5'>Packages</h5>
                                    <ChecklistPackage list={packages?packages:[]} setList={setPackages} language={language} />
                                </>
                                <>
                                    <h5 className='title is-5'>Workshops</h5>
                                    <ChecklistWorkshop list={workshops?workshops:[]} setList={setWorkshops} language={language} />
                                </>
                            </FormTemplate>    
                        </>
                    :null} 
                </div>
            </div>    
        )    
    }

    const handleReplyClickEvent = reply => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            setSchedules(data.schedules?data.schedules:undefined)
            setPackages(data.packages?data.packages:undefined)
            setWorkshops(data.workshops?data.workshops:undefined)
        } else {
            alert('ERROR: Status:' + data.status + ' Message:' +  data.message)
        }   
    }



    const handleClickEvent = event => {
        const url = '/fetchFestivalProduction?templateName=' + event.templateName + '&eventType=' + event.eventType + '&year=' + event.year + '&UPPER=3000'
        serverFetchData(url, handleReplyClickEvent)
    }

    return(
        <div style = {{with:'200vw', textAlign:'left'}}>
            <div className='columns is-centered' >
                {groups? 
                <div className='column'>
                    {keys.map(key=>
                        <>
                            <Button 
                                style={{color:'black', borderColor:'black'}} 
                                variant='outlined' 
                                onClick={()=>handleClickEvent(groups[key][0])}
                            >
                                {key}
                            </Button>    
                        </>
                    )}
                </div>
                :null}
            </div>

            {schedules?
                <>
                    {renderOutput()}
                </>
            :
                null
            }    

        </div>
    )
}    

export default FestivalRegistration;
