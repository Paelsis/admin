import {useState, useEffect} from "react"
import DraftEditor, {emptyEditorState, generateEditorStateFromValue} from '../components/DraftEditor'
import draftToHtml from 'draftjs-to-html'
import { convertToRaw } from 'draft-js'
import {Button, IconButton} from '@mui/material'
import CameraIcon from '@mui/icons-material/Camera'
import {AddPhotoSingle} from './camera/AddPhoto'

import {replaceRow} from '../services/serverPost'

const styles =  {
    button:{
        color:'black',
        borderColor:'black'
    }

}

const Camera = () =>
    <IconButton onClick={()=>alert('Camera later')}>
        <CameraIcon />  
    </IconButton> 


const EditText = ({keys, list, setList}) =>
{
    const [edit, setEdit] = useState()
    const [editorState, setEditorState] = useState(emptyEditorState())
    const compareSearch = it => it.groupId === keys.groupId && it.textId === keys.textId && it.language === keys.language
    const record = keys?list.find(compareSearch):undefined
    const textBody = record?record.textBody?record.textBody:undefined:undefined

    const handleSaveReply = (reply, rec) => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            const newList = list.map(it => {
                if (compareSearch(it)) {
                    return rec
                } else {
                    return it
                }
            })
            setList(newList)
        } else {
            alert('Failed to save record for groupId = ' + keys.groupId + ' textId = ' + keys.textId)
        }
    }

    const saveRecord = rec => {
        replaceRow('tbl_text', rec, reply => handleSaveReply(reply, rec))
    }

    const handleToggleEdit = () => {
        if (edit) {
            // Leaving edit state
            const textBody = draftToHtml(convertToRaw(editorState.getCurrentContent()))
            const newRecord = {...record, textBody}
            saveRecord(newRecord)
        } else {
            // Entering edit state
            const textBody = record?record.textBody?record.textBody:undefined:undefined
            setEditorState(textBody?generateEditorStateFromValue(textBody):emptyEditorState())
        }    
        setEdit(edit?undefined:true)
    }

    return(
        <>
            <Button variant='outlined' style={styles.button} onClick = {handleToggleEdit}>
                {edit?'Save':'Edit'}
            </Button>
            <AddPhotoSingle subdir='/images'/>
            {edit?
                <>
                    <h2 className="title is-2">{keys.groupId}&nbsp;{keys.textId}&nbsp;{keys.language} </h2>
                    <DraftEditor 
                        style={{background:'white', color:'grey'}} 
                        required={false} 
                        disabled={false}
                        placeholder={'Hello'}
                        editorState={editorState} 
                        setEditorState={setEditorState} 
                    />
                </>
            :textBody?
                <div style={{textAlign:'left'}} dangerouslySetInnerHTML={{__html: textBody}} />
            :
                null
            }
        </>
    )
}

export default EditText


