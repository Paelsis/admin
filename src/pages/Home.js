import {useState} from 'react'
import { useNavigate }  from 'react-router-dom';
import { useParams } from "react-router-dom";
import Picklist from '../components/Picklist'

            /*
            <div className='column'>
                <Picklist 
                    labelButton='Templates'
                    tableName={'tbl_course_template'} 
                    labelName='templateName' 
                    valueName={'templateName'} 
                    value={value} 
                    setValue={setValue}
                    unique={true}
                    close={true}
                />
            </div>
            <div className='column'>
            <Picklist 
                labelButton='Other Festivals'
                tableName={'v_registration_other'} 
                labelName='label' 
                valueName={'value'} 
                sortBy={'label'}
                value={value} 
                setValue={setValue}
                unique={true}
                close={true}
            />
        </div>
            */



export default () => {
    const [value, setValue] = useState()
    return(
        <div className='columns is-centered' style={{marginTop:50}}>
            <h1>Dance Administration</h1>
        </div>
    )
}    
