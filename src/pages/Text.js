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

export default () => {
    const {groupId, textId} = useParams()
    const [sharedState,] = useSharedState()
    const language = sharedState.langauge
    return(
        <div className='columns is-centered'>
            <div className = 'column is-12'>
                <EditText 
                    groupId={groupId} 
                    textId={textId} 
                    language={language}
                />
            </div>
        </div>
    )
}





