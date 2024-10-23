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
import {calcAmount} from '../services/functions'
import { useNavigate }  from 'react-router-dom';
import {PRODUCTION, DEVELOPMENT} from '../services/constant'

const styles = {
    button:{},
    buttonOK:{color:'white', backgroundColor:'green', borderColor:'green'},
    buttonERROR:{color:'white', backgroundColor:'red', borderColor:'red'}
}

const initialReg = {
    role:'LEADER',
    leader:true,
    firstName:'Per',
    lastName:'Eskilson',
    email:'paelsis@hotmail.com',
    address:'Skomakaregatan 10A, Malmö',
    havePartner:true,
    payForPartner:true,
    phone:'0733-780749',
    firstNamePartner:'Greta',
    lastNamePartner:'Thunberg',
    emailPartner:'greta@thunberg.com'
}

    
// FestivalSchema
export default () => {
    const [sharedState, ] = useSharedState()
    const language = sharedState.language
    const [schedules, setSchedules] = useState()
    const [packages, setPackages] = useState()
    const [workshops, setWorkshops] = useState()
    const [status, setStatus] = useState(false)
    const [events, setEvents] = useState()
    const [mailSubject, setMailSubject] = useState()
    const [mailBody, setMailBody] = useState()
    const [registration, setRegistration] = useState(DEVELOPMENT?initialReg:{})
    const groups = events?Object.groupBy(events, it=>(it.eventType + ' ' + it.year)):undefined
    const keys = groups?Object.keys(groups):undefined
    const navigate = useNavigate()

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
    
        const handleSendMailReply = (mailReply, mailInputData) => {
            if (mailReply.status === 'OK') {
                alert(TEXT.success[language] + '\norderId =' + mailInputData.orderId)
                navigate('/')
            } else {
                const strMailInputData = JSON.stringify(mailInputData)
                alert(TEXT.successNoMail[language] + '.\nThe mail input is:' + strMailInputData)
                //navigate('/festivalSchema')
            }
        }

        const handleInsertReply = regReply => {
            if (regReply.status === 'OK') {
                const orderId = regReply.orderId?regReply.orderId:99999999
                const id = regReply.id?regReply.id:999999999
                const email = registration.email?registration.email:'No email'
                const emailResponsible = schedules?schedules[0].emailResponsible:'paelsis@hotmail.com'

                // alert('Insert of new registration successful status=' + regReply.status + ' orderId=' + orderId + ' id=' + id)
                setStatus('OK')
                setTimeout(()=>setStatus(undefined), 2000)
                alert('You registration was successful with order number ' + (regReply.orderId?regReply.orderId:'Unknown') + ' Please check your mailbox for confirmation mail.')
    
                // Data needed to send reply mail to customer and responsible organizer
                const mailData = {
                    orderId, 
                    id, 
                    email,
                    emailResponsible,
                    mailSubjectToCustomer:regReply.mailSubject, 
                    mailBodyToCustomer:regReply.mailBody,  
                    mailSubjectToCourseLeader:regReply.mailSubject, 
                    mailBodyToCourseLeader:regReply.mailBody,  
                }

                if (DEVELOPMENT) {
                    alert('data:' + JSON.stringify('mailData:' + JSON.stringify(mailData)))
                } else {
                    // alert("Data sent to SMTP-server:" + JSON.stringify(mailData))
                    serverPost('/sendMailReg', mailData, reply=>handleSendMailReply(reply, mailData))
                }    
               
            } else if (regReply.status === 'ERROR') {
                setStatus('ERROR')
                setTimeout(()=>setStatus(undefined), 2000)
                alert(TEXT.error[language])
            } else {
                setStatus('ERROR')
                setTimeout(()=>setStatus(undefined), 2000)
                alert('ERROR: Problems with response, data:' + JSON.stringify(regReply))
            }   
        }
    
        const handleInsert = () => {
            const eventType = schedules?schedules[0].eventType:undefined
            const dateRange = schedules?schedules[0].dateRange:undefined 
            const year = schedules?schedules[0].year:undefined
            const emailResponsible = schedules?schedules[0].emailResponsible:'paelsis@hotmail.com'

            const data = {
                // Note that ide must be undefined to insert the record, otherwise it updates the id since it is primary index
                registration:{...registration, eventType, dateRange, year, emailResponsible, id:undefined}, 
                workshops:{...workshops.filter(it=>it.checked).map(it=>({...it, product:it.workshopId, ...registration, id:undefined}))},
                packages:{...packages.filter(it=>it.checked).map(it=>({...it, product:it.packageId, ...registration, id:undefined}))}
            } 
            // Note that update with id undefined will insert record
            serverPost('/updateFestivalRegistration', data, handleInsertReply)
        }

        const buttons= [
            {
                type:'submit',
                variant:status==="OK"?'contained':'outlined',
                style:status==='OK'?styles.buttonOK:status==='ERROR'?styles.buttonERROR:styles.button,
                label:TEXT.registration.label[language],
                tooltip:TEXT.registration.tooltip[language],
                title:TEXT.registration.tooltip[language],
                validate:true,
            },
            {
                type:'button',
                variant:'outlined',
                label:TEXT.cancel.label[language],
                tooltip:TEXT.cancel.tooltip[language],
                title:TEXT.cancel.tooltip[language],
                handleClick:()=>setSchedules(undefined)
            }
        ]
        const eventType = schedules?schedules[0]?schedules[0].eventType?schedules[0].eventType:'No event type 1':'No event type 2':'No eventType 3'
        const year = schedules?schedules[0]?schedules[0].year?schedules[0].year:'No year 1':'No year 2':'year 3'
        const amount = calcAmount(packages, workshops, 'SEK')

        return(
            <div className='columns is-centered'>
                <div className='column is-6'>
                    {schedules.length >0?
                        <>
                            <h1 className="title is-3">{eventType + ' ' + year}</h1>
                            <FormTemplate 
                                fields = {registrationFields(language)} 
                                value={registration?registration:{}} 
                                setValue={setRegistration} buttons={buttons}
                                handleSubmit={e=>{e.preventDefault(); handleInsert()}}
                            >
                                <>
                                    <h5 className='title is-5'>Price:{amount}</h5>
                                </>
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
                renderOutput()
            :
                null
            }    

        </div>
    )
}    

