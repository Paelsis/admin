import {useState, useEffect} from 'react'
import {useSharedState} from '../store'
import { useLocation, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import {IconButton} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import ViewObject from "./ViewObject"
import FormTemplate from './FormTemplate'
import {serverPost} from '../services/serverPost'
import {PRODUCTION} from '../services/constant'
import {TEXT} from '../services/text'

const styles = {
    object:{margin:'auto', maxWidth:600, textAlign:'left'},
    button:{color:'grey', borderColor:'grey'}
}
const dayName = [
    {SV:'No dow 0', EN:'No dow 0'},
    {SV:'Måndag', EN: 'Monday'},
    {SV:'Tisdag', EN: 'Tuesday'},
    {SV:'Onsdag', EN: 'Wednesday'},
    {SV:'Torsdag', EN: 'Thursday'},
    {SV:'Fredag', EN: 'Friday'},
    {SV:'Lördag', EN: 'Saturday'},
    {SV:'Söndag', EN:'Sunday'},
]


const fieldsFunc = language =>([
    {
        type:'radio',
        name:'role',
        label:TEXT.role.label[language],
        radioValues:[
            {label:TEXT.role.radio.FOLLOWER[language], value:'FOLLOWER'}, 
            {label:TEXT.role.radio.LEADER[language], value:'LEADER'},
            {label:TEXT.role.radio.BOTH[language], value:'BOTH'},
        ],
        required:true,
        tooltip: TEXT.role.tooltip[language]
    },
    {
        name:'firstName',
        type:'text',
        required:true,
        autoFocus:true, 
        label:TEXT.firstName.label[language],
        tooltip: TEXT.firstName.tooltip[language]
    },
    {
        name:'lastName',
        type:'text',
        required:true,
        label:TEXT.lastName.label[language],
        tooltip: TEXT.lastName.tooltip[language]
    },
    {
        name:'email',
        type:'email',
        required:true,
        label:TEXT.email.label[language],
        tooltip: TEXT.email.tooltip[language]

    },
    {
        type:'text',
        name:'phone',
        label:TEXT.phone.label[language],
        tooltip: TEXT.phone.tooltip[language],
        minLength:10, 
        maxLength:20,
    },
    {
        name:'address',
        type:'text',
        label:TEXT.address.label[language],
        tooltip: TEXT.address.tooltip[language]
    },
    {
        name:'havePartner',
        type:'checkbox',
        label:TEXT.havePartner.label[language],
        tooltip: TEXT.havePartner.tooltip[language]
    },
    {
        name: 'payForPartner',
        type:'checkbox',
        tooltip: TEXT.payForPartner.tooltip[language],
        label:TEXT.payForPartner.label[language],
        notHiddenIf:'havePartner'
    },
    {
        name:'firstNamePartner',
        type:'text',
        required:true,
        label:TEXT.firstNamePartner.label[language],
        tooltip: TEXT.firstNamePartner.tooltip[language],
        notHiddenIf:'havePartner'
    },
    {
        name:'lastNamePartner',
        type:'text',
        required:true,
        label:TEXT.lastNamePartner.label[language],
        tooltip: TEXT.lastNamePartner.tooltip[language],
        notHiddenIf:'havePartner'

    },
    {
        name:'emailPartner',
        type:'email',
        label:TEXT.emailPartner.label[language],
        tooltip: TEXT.emailPartner.tooltip[language],
        notHiddenIf:'havePartner',
    },
    {
        name:'message',
        type:'textarea',
        label:TEXT.message.label[language],
        tooltip: TEXT.message.tooltip[language]
    },
])

const convertRoleToLeader = role => {
    switch(role) {
        case 'FOLLOWER':return 0
        case 'LEADER':return 1
        case 'BOTH':return 2
        default: return -1

    }
}

const defaultValue = {
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


export default () => {
    const {state} = useLocation() // Object state passed with router via call navigate(/register:{state:productId})
    const navigate = useNavigate()
    const [value, setValue] = useState(PRODUCTION?{}:defaultValue)
    const [regReply, setRegReply] = useState()
    const [sharedState, ] = useSharedState()
    const [view, setView] =  useState({})
    const [showMail, setShowMail] = useState(false)
    const [readyMessage, setReadyMessage] = useState()
    const language = sharedState.language
    const extraValues = {id:undefined, avaStatusText:undefined, leader:convertRoleToLeader(value.role), language}

    if (!state) {
        alert('The componeent CourseRegistration must be called from component CourseSchema')
    }
    useEffect(()=>{
        setRegReply()
        setShowMail()
    }, state);


    const reg = state?
        {...state, ...value, ...extraValues}
    :
        {...value, ...extraValues}


    const handleTestreply = regReply => {
        if (regReply.status === 'OK') {
            // In developkment environment we cannot send mail
            setRegReply(regReply)
        } else {
            const message = regReply.message
            setRegReply(regReply)
            alert('ERROR: Failed to create test mail. Message:' + message)
        }
    }

    const handleMailReply = mailReply => {
        if (mailReply.status === 'OK') {
            alert(TEXT.success[language])
            navigate('/festivalSchema')
        } else {    
            // const strRegReply = JSON.stringify(mailReply);
            alert(TEXT.successNoMail[language] + '(Error message when sending mail:' + mailReply.message + ')')
        }    
    }

    const handleRegistrationReply = reply => {
        if (reply.status === 'OK') {
            const {orderId, mailSubjectToCustomer, mailBodyToCustomer, mailSubjectToCourseLeader, mailBodyToCourseLeader} = reply
            
            const data = {...reg, orderId, mailSubjectToCustomer, mailBodyToCustomer, mailSubjectToCourseLeader, mailBodyToCourseLeader}
            if (PRODUCTION) {
                setRegReply(reply)
                serverPost('/sendMailReg', data, handleMailReply)
            } else {
                setRegReply(reply)
                serverPost('/sendMailReg', data, handleMailReply)
                alert('Registration went OK on DEVELOPMENT system.\nNo mail could be sent with SMTP-server on DEVELOPMENT SYSTEM\nData sent to url /sendMailReg\n' + JSON.stringify(data))
            }
        } else {
            setRegReply(reply)
            alert('ERROR:failed to perform registration, (Error message from server:' + reply.message + ')')
        }
    }

    const buttons=[
        {
            type:'submit',
            label:TEXT.register.label[language],
            tooltip:TEXT.register.tooltip[language],

            validate:true,
            handleClick:e=>{
                e.preventDefault()
                serverPost('/courseRegistration', reg, handleRegistrationReply)
            }    
        },
        {
            type:'button',
            label:TEXT.cancel.label[language],
            tooltip:TEXT.cancel.tooltip[language],
            handleClick:e=>{
                e.preventDefault()
                alert('Cancel')
            }    
        },
    ]

    const fields = fieldsFunc(language)   
    const dayOfWeek = state?state.dayOfWeek?state.dayOfWeek:0:0 
    if (regReply) {
        const {mailSubjectToCourseLeader, mailBodyToCourseLeader, mailSubjectToCustomer, mailBodyToCustomer} = regReply
        return(
            <div style={styles.object}>

                {regReply.status==='OK'?
                    <h1 className='title-is-3'>{TEXT.success[language]}</h1>
                :
                    <h1 className='title-is-3'>{regReply.message}</h1>
                }    
                <Button variant='outlined' style={styles.button} onClick={()=>setShowMail(showMail?false:true)}>
                    {TEXT.labelButton[language]}
                </Button>
                {showMail?
                    <>
                        <div className="title is-4">Mail subject course leader</div>
                        <div dangerouslySetInnerHTML={{__html: JSON.stringify(mailSubjectToCourseLeader)}} />
                        <div className="title is-4">Mail body course leader</div>
                        <div dangerouslySetInnerHTML={{__html: JSON.stringify(mailBodyToCourseLeader)}} />
                        <div className="title is-4">Mail subject to customer</div>
                        <div dangerouslySetInnerHTML={{__html: JSON.stringify(mailSubjectToCustomer)}} />
                        <div className="title is-4">Mail body to customer</div>
                        <div dangerouslySetInnerHTML={{__html: JSON.stringify(mailBodyToCustomer)}} />
                        <IconButton variant='outlined' style={styles.button} onClick={()=>setView(view.showInput?{showInput:undefined}:{showInput:true})}>
                            {view.showInput?<VisibilityIcon />:<VisibilityOffIcon/>}
                        </IconButton>
                    </>
                :null}

                {view.showInput?
                    <>
                        <h4>Input Data</h4>
                        <div style={{width:'100vw', margin:'auto', fontSize:12}}>
                        <ViewObject state={state} />       
                        </div>
                    </>
                :null}    
            </div>
        )
    } else if (state) {
        return(
                <div style={styles.object}>
                    <>
                        <div className="title is-3">{TEXT.header[language]}</div>
                        <div className="title is-5">{state['name' + language] + ' ' + ' ' + state.city + ' ' + dayName[dayOfWeek][language] + ' ' + state.startTime}</div> 
                        <div className="title is-6">{TEXT.starts[language] + ' ' + state.startDate}</div>
                    </>
                    <FormTemplate
                                buttons={buttons}
                                tableName='tbl_registration' 
                                fields={fields} 
                                value={value} 
                                setValue={setValue}
                    />
                </div>
        )
    } else {        
        return(
            <h4 style={{color:'red'}}>Requires an object with course data. Can only be called from Pages that passes state</h4>
        )
    }
}