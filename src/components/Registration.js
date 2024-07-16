import {useState} from 'react'
import {useSharedState} from '../store'
import { useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import ViewObject from "./ViewObject"
import FormTemplate from './FormTemplate'
import {serverPost} from '../services/serverPost'
const styles = {
    container:{width:'100vw'},
    object:{margin:'auto', width:'90vw', textAlign:'left'},
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

const TEXT = {
    header:{
        SV:'Kursanmälan',
        EN:'Course registration'
    },
    starts:{
        SV:'Kursen startar ',
        EN:'Course starts '
    },
    role:{
        label:{
            SV:'Dansroll',
            EN:'Dance role'
        },
        tooltip:{
            SV:'Dansroll',
            EN:'Dance role'
        },
        radio:{
            LEADER:{
                SV:'Förare',
                EN:'Leader'
            },
            FOLLOWER:{
                SV:'Följare',
                EN:'Follower'
            },
            BOTH:{
                SV:'Båda roller',
                EN:'Both roles'
            }    
        }
    },    
    firstName:{
        label:{
            SV:'Förnamn',
            EN:'Name'
        },    
        tooltip:{
            SV:'Förnamn på registrant',
            EN:'Name on registrant'
        }    
    },    
    lastName:{
        label:{
            SV:'Efternamn',
            EN:'Sirname'
        },    
        tooltip:{
            SV:'Efternamn på registrant',
            EN:'Sirname on registrant'
        }    
    },    
    email:{
        label:{
            SV:'E-mail',
            EN:'E-mail'
        },    
        tooltip:{
            SV:'E-mail',
            EN:'E-mail'
        }    
    },
    phone:{
        label:{
            SV:'Telefonnummer',
            EN:'Phone number'
        },    
        tooltip:{
            SV:'Telefonnummer',
            EN:'Phone number'
        }    
    },
    address:{
        label:{
            SV:'Adress',
            EN:'Address'
        },    
        tooltip:{
            SV:'Adress',
            EN:'Address'
        }    
    },
    havePartner:{
        label:{
            SV:'Jag har en danspartner',
            EN:'I have a dance-partner'
        },    
        tooltip:{
            SV:'Jag har en danspartner',
            EN:'I have a dance-partner'
        }    
    },
    payForPartner:{
        label:{
            SV:'Jag önskar även betala för min danspartner',
            EN:'I also want to pay for my dance-partner'
        },    
        tooltip:{
            SV:'Jag önskar även betala för min danspartner',
            EN:'I also want to pay for my dance-partner'
        }    
    },
    firstNamePartner:{
        label:{
            SV:'Förnamn danspartner',
            EN:'Name dance-partner'
        },    
        tooltip:{
            SV:'Förnamn på registrant',
            EN:'Name on registrant'
        }    
    },    
    lastNamePartner:{
        label:{
            SV:'Efternamn danspartner',
            EN:'Sirname dance-partner'
        },    
        tooltip:{
            SV:'Efternamn på din danspartner',
            EN:'Sirname on dance-partner'
        }    
    },    
    emailPartner:{
        label:{
            SV:'E-mail danspartner',
            EN:'E-mail dance-partner'
        },    
        tooltip:{
            SV:'E-mail danspartner',
            EN:'E-mail dance-partner'
        }    
    },
    message:{
        label:{
            SV:'Meddelande',
            EN:'Message'
        },    
        tooltip:{
            SV:'Meddelande till kursledaren',
            EN:'Message to course leader'
        }    
    },
    register:{
        label:{
            SV:'Kursanmälan',
            EN:'Register'
        },    
        tooltip:{
            SV:'Kursanmälan',
            EN:'Register'
        }    
    },
    cancel:{
        label:{
            SV:'Avbryt',
            EN:'Cancel'
        },    
        tooltip:{
            SV:'Avbryt',
            EN:'Cancel'
        }    
    },
    testmail:{
        label:{
            SV:'Testa Mail',
            EN:'Test Mail'
        },    
        tooltip:{
            SV:'Testa mail funktionaliteten',
            EN:'Test the mail functionality'
        }    
    },
}


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
    const [value, setValue] = useState(defaultValue)
    const [reply, setReply] = useState({})
    const [sharedState, ] = useSharedState()
    const [view, setView] =  useState({})
    const language = sharedState.language
    const extraValues = {id:undefined, avaStatusText:undefined, leader:convertRoleToLeader(value.role), language}

    const reg = state?
        {...state, ...value, ...extraValues}
    :
        {...value, ...extraValues}


    const handleTestResult = reply => {
        if (reply.status === 'OK') {
            // In developkment environment we cannot send mail
            setReply(reply)
        } else {
            const message = reply.message
            setReply(reply)
            alert('ERROR: Failed to create test mail. Message:' + message)
        }
    }

    const handleSendMailReply = reply => {
        if (reply.status === 'OK') {
            if (process.env.NODE_ENV === 'development') {
                // In developkment environment we cannot send mail
                setReply(reply)
            } else {
                setReply(reply)
            }
        } else {
            const message = reply.message
            if (process.env.NODE_ENV === 'development') {
                // In developkment environment we cannot send mail
                setReply(reply)
                alert(message)
            } else {
                setReply({reply})
                alert('ERROR: Failed to send mail to registrant. Message:' + message)
            }
        }
    }


    const {mailSubjectToCourseLeader, mailBodyToCourseLeader, mailSubjectToCustomer, mailBodyToCustomer} = reply

    const handleRegistrationReply = reply => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            const orderId = data.orderId?data.orderId:-9999999
            const regWithOrderId = {...reg, orderId}
            serverPost('/sendMailReg', regWithOrderId, handleSendMailReply)
        } else {
            alert('ERROR:failed to perform registration, message:' + JSON.stringify(data.message))
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
        {
            type:'submit',
            label:TEXT.testmail.label[language],
            tooltip:TEXT.testmail.tooltip[language],

            validate:true,
            handleClick:e=>{
                e.preventDefault()
                serverPost('/testRegMail', reg, handleTestResult)
            }    
        },

    ]

    const fields = fieldsFunc(language)   
    const dayOfWeek = state?state.dayOfWeek?state.dayOfWeek:0:0 
    return(
        <>
        {state?
            <div style={styles.container}>
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
                    <div style={styles.object}>
                        <div className="title is-4">Mail subject course leader</div>
                        <div dangerouslySetInnerHTML={{__html: JSON.stringify(mailSubjectToCourseLeader)}} />
                        <div className="title is-5">Mail body course leader</div>
                        <div dangerouslySetInnerHTML={{__html: JSON.stringify(mailBodyToCourseLeader)}} />
                        <div className="title is-4">Mail subject to customer</div>
                        <div dangerouslySetInnerHTML={{__html: JSON.stringify(mailSubjectToCustomer)}} />
                        <div className="title is-5">Mail body to customer</div>
                        <div dangerouslySetInnerHTML={{__html: JSON.stringify(mailBodyToCustomer)}} />

                        <Button variant='outlined' style={styles.button} onClick={()=>setView(view.showInput?{showInput:undefined}:{showInput:true})}>
                            {view.showInput?'Hide Input':'Show input'}
                        </Button>
                        {view.showInput?
                            <>
                                <h4>Input Data</h4>
                                <div style={{width:'100vw', margin:'auto', fontSize:12}}>
                                <ViewObject state={state} />       
                                </div>
                            </>
                        :null}    
                    </div>
                </div>
            </div>
        :
            <h4 style={{color:'red'}}>Requires an object with course data. Can only be called from Pages that passes state</h4>
        }
        </>
    )
}