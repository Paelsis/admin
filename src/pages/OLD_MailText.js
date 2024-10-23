import {useState, useEffect} from "react"
import { useParams } from 'react-router-dom';
import { useSharedState } from "../store";
import {serverFetchData} from '../services/serverFetch'
import EditText, {updateTextList} from '../components/EditText'
import {compareTextFunc} from '../services/functions'

const styles = {
    table:{width:100, fontSize:10},
    thead:{color:'white'},
    th:{color:'white'},
    active:{backgroundColor:'black', color:'yellow'},
    inactive:{backgroundColor:'whitesmoke', color:'black'},
}

const mailText = {
    school:[
        {
            label:'Subject',
            groupId:'MAIL_EVENT', 
            textId:'SUBJECT' 
        },
        {
            label:'Body',
            groupId:'MAIL_EVENT', 
            textId:'BODY' 
        },
        {
            label:'Legal',
            groupId:'MAIL_EVENT', 
            textId:'LEGAL' 
        },
        {
            label:'Thank you',
            groupId:'MAIL_EVENT', 
            textId:'THANK_YOU' 
        },
    ],
    event:[
        {
            label:'Subject',
            groupId:'MAIL_EVENT', 
            textId:'SUBJECT' 
        },
        {
            label:'Body',
            groupId:'MAIL_EVENT', 
            textId:'BODY' 
        },
        {
            label:'Legal',
            groupId:'MAIL_EVENT', 
            textId:'LEGAL' 
        },
        {
            label:'Thank you',
            groupId:'MAIL_EVENT', 
            textId:'THANK_YOU' 
        },
    ],
}


export default () => {
    const [sharedState,] = useSharedState()
    const language = sharedState.langauge
    return(
        <>
            <h1 className='label is-1'>Mail texts</h1>
            <h3 className='label is-3'>Classes</h3>
            <div className='columns is-centered is-multiline'>
                {mailText.school.map(it=>
                <div className = 'column is-3'>
                    <h4 className='label is-4'>{it.label + ' ' + it.language}</h4>
                    <EditText 
                        groupId={it.groupId} 
                        textId={it.textId} 
                        language={language}
                    />
                </div>
                )}
            </div>    
            <h3 className='label is-3'>Events</h3>
            <div className='columns is-centered is-multiline'>
                {mailText.event.map(it=>
                <div className = 'column is-3'>
                    <h4 className='label is-4'>{it.label + ' ' + it.language}</h4>
                    <EditText 
                        url={'/getText'}
                        groupId={it.groupId} 
                        textId={it.textId} 
                        language={language}
                    />
                </div>
                )}
            </div>
        </>        
    )
}





