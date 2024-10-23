import React, {useState, useEffect} from "react"
import EditText from '../components/EditText'
import { serverFetchData } from '../services/serverFetch';
import CircularProgress from "../components/CirkularProgress"

const styles = {
    event:{
        width:'100%',
        textAlign:'center'
    },
    language:{
        width:'100%',
        textAlign:'center'
    },
    label:{
        width:'100%',
        textAlign:'center'
    },
    table:{width:100, fontSize:10},
    thead:{color:'white'},
    th:{color:'white'},
    active:{backgroundColor:'black', color:'yellow'},
    inactive:{backgroundColor:'whitesmoke', color:'black'},
}

const _EditText = ({groupId, textId, language}) =>   <EditText url='/getTexts' groupId={groupId} textId={textId} overruleLanguage={language} />

const mailTextList = [
    {
        label:'Subject',
        textId:'SUBJECT', 
    },
    {
        label:'Body',
        textId:'BODY', 
    },
    {
        label:'Legal',
        textId:'LEGAL', 
    },
    {
        label:'Thank you',
        textId:'THANK_YOU', 
    },
]

const GROUP_ID_PREFIX='MAIL_'


export default () => {
    const [eventTypeList, setEventTypeList] = useState() 

    const handleReplyFetchRows = reply => {
        if (reply.status ==='OK') {
            const list = reply.result.map(it=>({eventType:it.eventType, nameEN:it.nameEN}))
            const extendedList = [ {eventType:'COURSE', nameEN:'General event'}, ...list, {eventType:'EVENT', nameEN:'General event'}]
            setEventTypeList(extendedList)
        } else {
            alert('[MailText] ERROR: Faield to fetch rows from ref_event_type')
        }
    }


    useEffect(()=>{
        const tableName = 'ref_event_type'
        serverFetchData('/fetchRows?tableName=' + tableName, handleReplyFetchRows)
    })

    return(
        <div className='has-background-primary' style={{width:'99vw'}}>
            <h3 className='title is-3 has-text-light' style={styles.event}>Mail texts</h3>

            {eventTypeList?eventTypeList.map(ev=>
                    <div  className='has-text-light has-background-link' >
                        <h4 className='title is-4 has-text-light' style={styles.event}>{ev.nameEN}</h4>
                        {['SV', 'EN'].map(language=>
                            <div className="has-background-danger">
                                <h5 className='title is-5 has-text-light has-background-danger' style={styles.language}>Language = {language}</h5>
                                <div className='columns is-centered m-0 is-multiline'>
                                    {mailTextList.map(it=>
                                        <div className='has-background-warning has-text-dark column is-3 is-narrow'>
                                            <h6 className='title is-6 has-text-dark ' style={styles.label}>{it.label}</h6>
                                            <_EditText 
                                                groupId={GROUP_ID_PREFIX + (ev.eventType?ev.eventType:null)} 
                                                textId={it.textId} 
                                                language={language}
                                            />
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}
                    </div>
                )
            :
                <CircularProgress />
            }       
        </div>        
    )
}





