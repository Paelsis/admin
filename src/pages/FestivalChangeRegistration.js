import {useState, useEffect} from 'react'
import {useSharedState} from '../store'
import {Button, IconButton} from '@mui/material';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

// import { useNavigate, useParams }  from 'react-router-dom';
import {serverFetchData} from '../services/serverFetch'
import {serverPost} from '../services/serverPost'
// import SaveIcon from '@mui/icons-material/Save'
// import CancelIcon from '@mui/icons-material/Cancel'
import Picklist from '../components/Picklist'
import ViewTable from '../components/ViewTable'
import FormTemplate from '../components/FormTemplate'
import {ChecklistWorkshop, ChecklistPackage} from '../components/Checklist'
import {TEXT, registrationFields} from '../services/text'

const styles = {
    button:{},
    buttonOK:{color:'white', backgroundColor:'green', borderColor:'green'},
    buttonERROR:{color:'white', backgroundColor:'red', borderColor:'red'}
}


const FestivalChangeRegistration =  () => {
    const [sharedState, ] = useSharedState()
    const language = sharedState.language
    const [groups, setGroups] = useState()
    const [registration, setRegistration] = useState()
    const [schedules, setSchedules] = useState()
    const [packages, setPackages] = useState()
    const [workshops, setWorkshops] = useState()
    const [checkedPackages, setCheckedPackages] = useState()
    const [checkedWorkshops, setCheckedWorkshops] = useState()
    const [toggleMore, setToggleMore] = useState()
    const [status, setStatus] = useState()
    const [reloadCounter, setReloadCounter] = useState(0)


    const handleReplyFetchPicklist = reply => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            let registrations = data.result.map(it=>({...it, label:it.firstName + ' ' + it.lastName + ' ' + it.email}))
            const groups = Object.groupBy(registrations, it=>it.eventType + ' ' + it.year)
            setGroups(groups)
        } else {
            alert('ERROR: Status:' + data.status + ' Message:' +  data.message)
        }   
    }

    useEffect(()=>{
        serverFetchData('/fetchFestivalRegistrationPicklist', handleReplyFetchPicklist) 
    }, [reloadCounter])

    const renderOutput = () => {
       
        const handleReplyUpdate = reply => {
            const data = reply.data?reply.data:reply
            if (data.status === 'OK') {
                const orderId = registration?registration.orderId?registration.orderId:9999999:8888888
                setReloadCounter(reloadCounter+1)
                setStatus('OK')
                setTimeout(()=>setStatus(undefined), 2000)
                // alert("Modified registration successfully. Order id =" + orderId)
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
            if (registration.eventType && registration.dateRange && registration.year) {
                const data = {
                    id:registration.id, 
                    registration:{...registration, id:undefined}, 
                    workshops:{...workshops.filter(it=>it.checked).map(it=>({...it, email:registration.email, role:registration.role, id:undefined}))},
                    packages:{...packages.filter(it=>it.checked).map(it=>({...it, email:registration.email, role:registration.role, id:undefined}))}
                }
                serverPost('/updateFestivalRegistration', data, handleReplyUpdate)
            } else {
                let missingData = {
                    registration,
                    schedules,
                    workshops, 
                    packages, 
                }
                alert('WARNING:Missing eventType/dateRange/year for /updateFestivalRegistration ' + JSON.stringify(missingData))
            }    
        }

        const buttons= [
            {
                type:'submit',
                variant:status==='OK'?'contained':'outlined',
                style:status==='OK'?styles.buttonOK:status==='ERROR'?styles.buttonERROR:styles.button,
                label:TEXT.save.label[language],
                tooltip:TEXT.save.tooltip[language],
                title:TEXT.save.tooltip[language],
                validate:true,
            },
            {
                variant:'outlined',
                label:TEXT.cancel.label[language],
                tooltip:TEXT.cancel.tooltip[language],
                title:TEXT.cancel.tooltip[language],
                handleClick:setSchedules
            }
        ]
    
        return(
            <div className='columns is-centered'>
                <div className='column is-4'>
                    {schedules?
                        <>
                            <h1 className="title is-3">{registration?(registration.eventType + ' ' + registration.year):"No title"}</h1>
                            <FormTemplate 
                                fields = {registrationFields(language)} value={registration?registration:{}} 
                                setValue={setRegistration} buttons={buttons}
                                handleSubmit={e=>{e.preventDefault(); handleUpdate()}}
                            >
                                {packages?
                                    <>
                                        <h5 className='title is-5'>Packages</h5>
                                        <ChecklistPackage list={packages?packages:[]} setList={setPackages} language={language} />
                                    </>
                                :null} 
                                {workshops?   
                                    <>
                                        <h5 className='title is-5'>Workshops</h5>
                                        <ChecklistWorkshop list={workshops?workshops:[]} setList={setWorkshops} language={language} />
                                    </>
                                :null}    
                            </FormTemplate>    
                        </>
                    :null} 
                </div>
            </div>    
        )    
    }

    const renderMoreOutput = () => {
        return(
            <div>
                {packages?
                <>
                    <h1>PACKAGES</h1>
                    <ViewTable colsView={['name', 'productId', 'checked']} list={packages} setList={setPackages} />
                </>
                :null}
                {checkedPackages?
                    <>
                        <h1>CHECKED PACKAGES</h1>
                        <ViewTable colsView={['name', 'productId']} list={checkedPackages} setList={setCheckedPackages} />
                    </>
                :null}
                {workshops?
                    <>
                        <h1>WORKSHOPS</h1>
                        <ViewTable colsView={['name', 'productId', 'checked', 'startDate', 'dayOfWeek']} list={workshops} setList={setWorkshops} />
                    </>
                :null}
                {checkedWorkshops?
                <>
                    <h1>CHECKED WORKSHOPS</h1>
                    <ViewTable colsView={['name', 'productId']} list={checkedWorkshops} setList={setCheckedWorkshops} />
                </>
                :null}
            </div>
        )
    }    

    const sortFunc = (a,b) => {
        let ret
        if ((ret = a.firstName.localeCompare(b.firstName)) !==0) {
            return ret
        } else if ((ret = a.lastName.localeCompare(b.lastName)) !==0) {
            return ret
        } else {
            return 0
        }
    }

    const handleReplyClick = reply => {

        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            setRegistration(data.registrations[0])
            setSchedules(data.schedules?data.schedules:undefined)
            setPackages(data.packages?data.packages:undefined)
            setWorkshops(data.workshops?data.workshops:undefined)
            setCheckedPackages(data.checkedPackages?data.checkedPackages:undefined)
            setCheckedWorkshops(data.checkedWorkshops?data.checkedWorkshops:undefined)
        } else {
            setPackages(undefined)
            setWorkshops(undefined)
            setCheckedPackages(undefined)
            setCheckedWorkshops(undefined)
            alert('ERROR: Status:' + data.status + ' Message:' +  data.message)
        }   
    }


    const handleClick = item => {
        // alert(JSON.stringify(item.email))
        const reg = {...item, label:undefined}

        setRegistration(reg)
        setToggleMore(undefined)

        // alert ('registration:' +  JSON.stringify(item))
       
        serverFetchData('/fetchFestivalRegistration?templateName=' + reg.templateName + '&eventType=' + reg.eventType + '&year=' + reg.year 
        + '&email=' + reg.email + '&role=' + reg.role  
        , 
        handleReplyClick)
    }

    return(
        <div style = {{with:'200vw', textAlign:'left'}}>
            <div className='columns is-centered' >
                {groups? 
                <div className='column'>
                    {Object.keys(groups).map(key=>
                        <>
                            <Picklist 
                                labelButton={key}
                                picklist = {groups[key].sort(sortFunc)}
                                labelName='label' 
                                value={registration} 
                                handleClick={handleClick}
                                close={true}
                            />
                        </>
                    )}
                </div>
                :null}
            </div>

        

            {registration?
                <>
                    {renderOutput()}

                    <IconButton onClick={()=>setToggleMore(toggleMore?false:true)}>
                        {toggleMore?<UnfoldLessIcon />:<UnfoldMoreIcon />}
                    </IconButton>    

                    {toggleMore===true?renderMoreOutput():null}
                </>
            :null}    

        </div>
    )
}    

export default FestivalChangeRegistration;
