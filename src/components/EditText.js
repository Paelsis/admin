import {useState, useEffect} from "react"
import DraftEditor, {emptyEditorState, generateEditorStateFromValue} from '../components/DraftEditor'
import draftToHtml from 'draftjs-to-html'
import { convertToRaw } from 'draft-js'
import {IconButton, Tooltip} from '@mui/material'
import CameraIcon from '@mui/icons-material/Camera'
import {AddPhotoSingle} from './camera/AddPhoto'
import {replaceRow} from '../services/serverPost'
import HtmlIcon from '@mui/icons-material/Html';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

const DRAFT = "DRAFT"
const HTML = "HTML"

const styles =  {
    button:{
        color:'black',
        borderColor:'black'
    },
    editor:{
        color:'grey',
        backgroundColor:'white'
    }


}

const RECORD_DEFAULT = {
    groupId:'DEFAULT',
    textId:'DEFAULT',
    language:'SV',
    textBody:'No default text'
}

const TooltipTitle1 = () => 
<>
    <h2 className='title is-4' style={{color:'yellow'}}>WARNING</h2>
    You have chosed to use the more advanced HTML-editor to change this text.
    <br/>HTML-changes will be overwritten if you later use the default WYSIWYG-editor.
</>

const TooltipTitle2 = () =>
<>
    <h2 className='title is-4' style={{color:'yellow'}}>WARNING</h2>You are currently using the WYSIWYG editor.<br/>
    By clicking this button you change your editor choice to the HTML-editor.<br/>
    Modifications of the text with the HTML-editor will be overwritten if you later choose to use the default WYSIWYG-editor.
</>

// Compare function for groupId, textId, language
export const compareFunc = (a,b) => {
    let ret 
    if (a.groupId && b.groupId) {
        ret = a.groupId.localeCompare(b.groupId)
        if (ret !==0) {
            return ret
        }
    } 
    if (a.textId && b.textId) {
        ret = a.textId.localeCompare(b.textId)
        if (ret !==0) {
            return ret
        }
    }    
    if (a.language && b.language) {
        ret = a.language.localeCompare(b.language)
        if (ret !==0) {
            return ret
        }
    }
    return 0
}

// Update function that updates the list element with the keys (groupId, textId, language) given in rec
export const updateList = (rec, list)  => {    
    return list.map(it => {
        if (compareFunc(rec, it)===0) {
            return rec
        } else {
            return it
        }
    })
}

const EditText = ({record, setRecord}) =>
{
    const [edit, setEdit] = useState()
    const [editor, setEditor] = useState(DRAFT)
    const [editorState, setEditorState] = useState(emptyEditorState())
    const [value, setValue] = useState()
    const textBody = record?record.textBody?record.textBody:'':''
    const placeholder = textBody?(textBody.length > 0)?'Start writing text here ...':undefined:undefined

    useEffect(()=>{
        draftToHtml(convertToRaw(editorState.getCurrentContent()))
        setEditorState(textBody?generateEditorStateFromValue(textBody):emptyEditorState())
        setValue(textBody)
    }, [record.groupId, record.textId, record.language])

    const handleSaveReply = (reply, rec) => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            setRecord(rec)
        } else {
            alert('Failed to save record for groupId = ' + (rec.groupId?rec.groupId:'missing') + ' textId = ' + (rec.textId?rec.textId:'missing'))
        }
    }

    const saveRecord = rec => {
        // alert(JSON.stringify(rec))
        replaceRow('tbl_text', rec, reply => handleSaveReply(reply, rec))
    }

    const handleToggleEdit = () => {
        if (edit) {
            // Leaving edit state
            const textBody = editor===HTML?value
            :draftToHtml(convertToRaw(editorState.getCurrentContent()))
            
            const newRecord = {...record, textBody}
            saveRecord(newRecord)
        } else {
            // Entering edit state
            const textBody = record?record.textBody?record.textBody:undefined:undefined
            editor===HTML?setValue(textBody)
            :setEditorState(textBody?generateEditorStateFromValue(textBody):emptyEditorState())
        }    
        setEdit(edit?undefined:true)
    }

    const handleToggleEditor = () => setEditor(editor === DRAFT?HTML:DRAFT)

    const handleCancel = () => setEdit(undefined)

    return(
        <>
            <IconButton key='1' variant='outlined' style={styles.button} onClick = {handleToggleEdit}>
                {edit?
                    <Tooltip title = 'Save the text'>
                        <SaveIcon />
                    </Tooltip>    
                :
                    <Tooltip title = 'Edit the text with editor choice of the button to the right'>
                        <EditIcon />
                    </Tooltip>
                }
            </IconButton>
            {edit?
                <IconButton key='3' variant='outlined' style={styles.button} onClick = {handleCancel}>
                    <CancelIcon />
                </IconButton>
            :
                <IconButton key='2' variant='outlined' style={styles.button} onClick = {handleToggleEditor}>
                    {editor===HTML?
                        <Tooltip title = {<TooltipTitle1 />}>
                            <HtmlIcon />
                        </Tooltip>
                    :
                        <Tooltip title = {<TooltipTitle2 />}>
                            <WysiwygIcon />
                        </Tooltip>    
                    }
                </IconButton>
            }
            {edit?
                <>
                    <h5 className="title is-5">groupId={record.groupId}&nbsp;textId={record.textId}&nbsp;language={record.language} </h5>
                    {editor===DRAFT?
                        <DraftEditor 
                            style={styles.editor} 
                            required={false} 
                            disabled={false}
                            placeholder={placeholder}
                            editorState={editorState} 
                            setEditorState={setEditorState} 
                        />
                    :   
                        <textarea 
                            style={styles.editor} 
                            cols={100} 
                            rows={25}
                            maxLength={50000}
                            value={value} 
                            placeholder={placeholder}
                            onChange={e=>setValue(e.target.value)}
                        />
                    }    
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

/*
<>
<h2 className='title is-4' style={{color:'yellow'}}>WARNING</h2>
You have chosed to use the more advanced HTML-editor to change this text.
<br/>HTML-changes will be overwritten if you later use the default WYSIWYG-editor.
</>
}

<>
<h2 className='title is-4' style={{color:'yellow'}}>WARNING</h2>You are currently using the WYSIWYG editor.<br/>
By clicking this button you change your editor choice to the HTML-editor.<br/>
Modifications of the text with the HTML-editor will be overwritten if you later choose to use the default WYSIWYG-editor.
</>
*/