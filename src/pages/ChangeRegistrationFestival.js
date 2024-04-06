import {useState} from 'react'
// import { useNavigate, useParams }  from 'react-router-dom';
import {serverFetchData_SLIM4} from '../services/serverFetch'
import Picklist from '../components/Picklist'
import EditTable from '../components/EditTable'
import ViewTable from '../components/ViewTable'
import {Button, IconButton} from '@mui/material';
import FormTemplate from '../components/FormTemplate'

const RenderForm = ({list, setList}) => {
    const handleChange = (index, name, checked) => {
        setList(list.map((it, idx) => {
            if (index === idx) {
                return {...it, checked} 
            } else {
                return it
            }
    }))
    }
    return(
        <form>
            {list.map((pk, index)=>
                <>
                <label>
                    <input type={pk.type} checked={pk.checked} name={pk.name} onChange = {e=>handleChange(index, e.target.name, e.target.checked)}/>
                &nbsp;
                {pk.name}&nbsp;{pk.checked?'true':'false'}    
                </label>
                <br/>
                </>
            )}
        </form>
    )
}
    
const columns = [
    {
        Field:'firstName',
    },
    {
        Field:'lastName',
    },
    {
        Field:'email',
    },
    {
        Field:'role',
    }
]
    


const Function =  () => {
    const [registration, setRegistration] = useState()
    const [schedule, setSchedule] = useState()
    const [packages, setPackages] = useState()
    const [workshops, setWorkshops] = useState()
    const [checkedPackages, setCheckedPackages] = useState()
    const [checkedWorkshops, setCheckedWorkshops] = useState()

    const [eventType, setEventType] = useState()
    const [year, setYear] = useState()

    const [email, setEmail] = useState()
    const [role, setRole] = useState()

    const handleReply = reply => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            setSchedule(data.schedule[0]?data.schedule[0]:undefined)
            setPackages(data.packages?data.packages:undefined)
            setWorkshops(data.workshops?data.workshops:undefined)
            setCheckedPackages(data.checkedPackages?data.checkedPackages:undefined)
            setCheckedWorkshops(data.checkedWorkshops?data.checkedWorkshops:undefined)
        } else {
            alert('ERROR: Status:' + data.status + ' Message:' +  data.message)
        }   
    }

    const handleClick = item => {
        // alert(JSON.stringify(item.email))
        setRegistration(item)
       
        serverFetchData_SLIM4('/fetchFestival?eventType=' + item.eventType + '&year=' + item.year 
        + '&email=' + item.email + '&role=' + item.role
        , 
        handleReply)
    }

    const handleSave = () => {
        const checkedWorkshops = workshops.filter(it => it.checked === true)
        const checkedPackages = workshops.filter(it => it.checked === true)

        alert(
            'registration:' + JSON.stringify(registration) + '\n' + 
            'PACKAGES:' + JSON.stringify(checkedPackages) + '\n' + 
            'WORKSHOPS:' + JSON.stringify(checkedWorkshops)
        )

    }

    const setValue = e => {
        setRegistration({...registration, [e.target.name]:e.target.value})
    }   

    const renderOutput = () => {
        return(
            <>
                {registration?
                    <EditTable list={[registration]} columns={columns} value={registration} setValue={setValue} />
                :null} 

                {schedule?
                    <>
                        <h1>SCHEDULE</h1>
                        {JSON.stringify(schedule)}            
                    </>
                :null}
                {packages?
                    <>
                        <h1>PACKAGES</h1>
                        <RenderForm list={packages} setList={setPackages} />
                    </>
                :null}
                {workshops?
                    <>
                        <h1>WORKSHOPS</h1>
                        <RenderForm list={workshops} setList={setWorkshops} />
                    </>
                :null}

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
            </>
        )    
    }





    return(
        <div style = {{with:'200vw', textAlign:'left'}}>
            <div className='columns is-centered' >
                <div className='column'>
                    <Picklist 
                        labelButton='Easter'
                        tableName={'v_registration_easter'} 
                        labelName='label' 
                        // valueName={'id'} 
                        value={registration} 
                        handleClick={handleClick}
                        close={true}
                    />
                </div>
                <div className='column'>
                    <Picklist 
                        labelButton='Summer'
                        tableName={'v_registration_summer'} 
                        labelName='label' 
                        // valueName={'id'} 
                        value={registration} 
                        handleClick={handleClick}
                        close={true}
                    />
                </div>
                <div className='column'>
                    <Picklist 
                        labelButton='Festivalito'
                        tableName={'v_registration_festivalito'} 
                        labelName='label' 
                        // valueName={'value'} 
                        value={registration} 
                        handleClick={handleClick}
                        close={true}
                    />
                </div>
                
            </div>

            {registration?
                <>
                    {renderOutput()}
                    <IconButton onClick={handleSave}>
                        <Button variant='outlined' />
                    </IconButton>    
                </>
            :null}    

        </div>
    )
}    

export default Function;
