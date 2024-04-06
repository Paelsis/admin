import {useState} from 'react'
import { useLocation } from "react-router-dom";
import ViewObject from "./ViewObject"
import FormTemplate from '../components/FormTemplate'


const styles = {
    container:{width:'100vw'},
    object:{margin:'auto', textAlign:'center'}
}

const fields = [
    {
        type:'radio',
        label:'Dansroll',
        name:'role',
        radioValues:[
            {label:'Följare', value:'FOLLOWER'}, 
            {label:'Förare', value:'LEADER'},
            {label:'Båda roller', value:'BOTH'},
        
        ],
        required:true,
        tooltip: 'The unit of the field \"Offset between events\" right above' 
    },
    {
        name:'firstName',
        label:'Förnamn',
        type:'text',
        required:true,
        tooltip:'Förnamn på kursdeltagare',

    },
    {
        name:'lastName',
        label:'Efternamn',
        type:'text',
        required:true,
        tooltip:'Efternamn på kursdeltager',

    },
    {
        name:'email',
        label:'E-mail',
        type:'email',
        required:true,
        tooltip:'E-mail för kursdeltagare',

    },
    {
        name:'phone',
        label:'Mobil-nummer',
        type:'text',
        tooltip:'Efternamn på kursdeltager',
    },
    {
        name:'message',
        label:'Meddelande',
        type:'textarea',
        tooltip: 'Meddelande till kursledaren',
    },
]

const convertRoleToLeader = role => {
    switch(role) {
        case 'FOLLOWER':return 0
        case 'LEADER':return 1
        case 'BOTH':return 2
        default: return -1

    }
}


export default () => {
    const {state} = useLocation() // Object state passed with router via call navigate(/register:{state:course})
    const [value, setValue] = useState({})
    const buttons=[
        {
            type:'submit',
            label:'Anmälan',
            validate:true,
            handleClick:e=>{
                e.preventDefault()
                alert(JSON.stringify({...state, ...value, avaStatusText:undefined, leader:convertRoleToLeader(value.role)}))
            }    
        },
        {
            type:'button',
            label:'Avbryt'
        },
    ]

    
    return(
        <>
        {state?
            <div style={styles.container}>
                <h1>Anmälan/Register</h1>
                <FormTemplate
                            buttons={buttons}
                            tableName='tbl_registration' 
                            fields={fields} 
                            value={value} 
                            setValue={setValue}
                />
                <h3>Left to do: Send register data to databaseCreate a form and add course+form data to tbl_register</h3>
                <div style={styles.object}>
                    <h4>Kursens data</h4>
                    <div style={{width:'100vw', margin:'auto'}}>
                    <ViewObject state={state} />       
                    </div>
                </div>
            </div>
        :
            <h4 style={{color:'red'}}>Requires an object with course data. Can only be called from Pages that passes state</h4>
        }
        </>
    )
}