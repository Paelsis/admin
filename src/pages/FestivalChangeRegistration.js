import {useState, useEffect} from 'react'
// import { useNavigate, useParams }  from 'react-router-dom';
import {serverFetchData, serverFetchData_SLIM4} from '../services/serverFetch'
import {serverPost} from '../services/serverPost'
import {Button, IconButton} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import Picklist from '../components/Picklist'
import ViewTable from '../components/ViewTable'
import FormTemplate from '../components/FormTemplate'
import RenderChecklist from '../components/RenderChecklist'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

    
const FIELDS_REGISTRATION = [
    {
        label:'Name (first name)',
        name:'firstName',
        type:'text',
    },
    {
        label:'Sirname (last name)',
        name:'lastName',
        type:'text',
    },
    {
        label:'email',
        name:'email',
        type:'email', 
    },
    {
        label:'Dance role',
        name:'role',
        type:'radio',
        radioValues:[{label:'Leader', value:'LEADER'}, {label:'Follower', value:'FOLLOWER'}, {label:'Both', value:'BOTH'}],
    }
]
    


const FestivalChangeRegistration =  () => {
    const [registrations, setRegistrations] = useState()
    const [registrationOld, setRegistrationOld] = useState()
    const [registration, setRegistration] = useState()
    const [schedules, setSchedules] = useState()
    const [packages, setPackages] = useState()
    const [workshops, setWorkshops] = useState()
    const [checkedPackages, setCheckedPackages] = useState()
    const [checkedWorkshops, setCheckedWorkshops] = useState()
    const [toggleMore, setToggleMore] = useState()
    const [statusColor, setStatusColor] = useState(false)
    const [list, setList] = useState()

    const [templateName, setTemplateName] = useState()
    const [eventType, setEventType] = useState()
    const [year, setYear] = useState()

    const [email, setEmail] = useState()
    const [role, setRole] = useState()

    const handleReplyFetchRegistrations = reply => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            setRegistrations(data.result.map(it=>({...it, label:it.firstName + ' ' + it.lastName + ' ' + it.email})))
        } else {
            alert('ERROR: Status:' + data.status + ' Message:' +  data.message)
        }   
    }

    useEffect(()=>{
        serverFetchData('/fetchRows?tableName=tbl_registration_festival&UPPER=3000', handleReplyFetchRegistrations) 
    }, [])

    const groups = registrations?Object.groupBy(registrations, it=>it.eventType + ' ' + it.year):undefined
    const keys = groups?Object.keys(groups):undefined

    const handleReply = reply => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            setSchedules(data.schedules[0]?data.schedules[0]:undefined)
            setPackages(data.packages?data.packages:undefined)
            setWorkshops(data.workshops?data.workshops:undefined)
            setCheckedPackages(data.checkedPackages?data.checkedPackages:undefined)
            setCheckedWorkshops(data.checkedWorkshops?data.checkedWorkshops:undefined)
        } else {
            alert('ERROR: Status:' + data.status + ' Message:' +  data.message)
        }   
    }

    const handleReplyUpdate = reply => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            setStatusColor('green')
            setTimeout(()=>setStatusColor(undefined), 2000)
        } else {
            setStatusColor('red')
            setTimeout(()=>setStatusColor(undefined), 2000)
            alert('ERROR: status=' + data.status + ' message=' +  (data.message?data.message:'No message'))
        }    
    }

    const handleUpdate = () => {
        const data = {
            registrationOld,
            registration, 
            workshops:{...workshops.filter(it=>it.checked).map(it=>({...it, email:registration.email, role:registration.role}))},
            packages:{...packages.filter(it=>it.checked).map(it=>({...it, email:registration.email, role:registration.role}))}
        } 
        serverPost('/updateFestivalRegistration', data, handleReplyUpdate)
    }




    const handleClick = item => {
        // alert(JSON.stringify(item.email))
        const reg = {...item, label:undefined}
        setRegistrationOld(reg)
        setRegistration(reg)


        // alert ('registration:' +  JSON.stringify(item))
       
        serverFetchData_SLIM4('/fetchFestivalRegistration?templateName=' + reg.templateName + '&eventType=' + reg.eventType + '&year=' + reg.year 
        + '&email=' + reg.email + '&role=' + reg.role  
        , 
        handleReply)
    }



    const renderOutput = () => {
        return(
            <>
                {registration?
                    <>
                        <FormTemplate fields = {FIELDS_REGISTRATION} value={registration} setValue={setRegistration} />
                    </>
                :null} 

                {schedules?
                    <>
                        <h1>SCHEDULE</h1>
                        {JSON.stringify(schedules[0])}            
                    </>
                :null}
                {packages?
                    <>
                        <h1>PACKAGES</h1>
                        <RenderChecklist list={packages} setList={setPackages} />
                    </>
                :null}
                {workshops?
                    <>
                        <h1>WORKSHOPS</h1>
                        <RenderChecklist list={workshops} setList={setWorkshops} />
                    </>
                :null}
            </>
        )    
    }

    const renderMoreOutput = () => {
        return(
            <div>
                {packages?
                <>
                    <h1>PACKAGES</h1>
                    <ViewTable cols={['name', 'productId', 'checked']} list={packages} />
                </>
                :null}
                {checkedPackages?
                    <>
                        <h1>CHECKED PACKAGES</h1>
                        <ViewTable cols={['name', 'productId']} list={checkedPackages} />
                    </>
                :null}
                {workshops?
                    <>
                        <h1>WORKSHOPS</h1>
                        <ViewTable cols={['name', 'productId', 'checked']} list={workshops} />
                    </>
                :null}
                {checkedWorkshops?
                <>
                    <h1>CHECKED WORKSHOPS</h1>
                    <ViewTable cols={['name', 'productId']} list={checkedWorkshops} />
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

    return(
        <div style = {{with:'200vw', textAlign:'left'}}>
            <div className='columns is-centered' >
                {groups? 
                <div className='column'>
                    {keys.map(key=>
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

                    {toggleMore===true?renderMoreOutput():null}

                    <IconButton onClick={handleUpdate}>
                        <SaveIcon style = {{color:statusColor?statusColor:undefined}} />
                    </IconButton>    
                    <IconButton onClick={()=>setToggleMore(toggleMore?false:true)}>
                        {toggleMore?<UnfoldLessIcon />:<UnfoldMoreIcon />}
                    </IconButton>    
                </>
            :null}    

        </div>
    )
}    

export default FestivalChangeRegistration;
