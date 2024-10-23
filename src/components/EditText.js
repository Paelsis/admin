import {useState, useEffect} from "react"
import { useSharedState } from "../store"
import DraftEditor, {emptyEditorState, generateEditorStateFromValue} from './DraftEditor'
import draftToHtml from 'draftjs-to-html'
import {useAutosave} from 'react-autosave'
import { convertToRaw } from 'draft-js'
import {IconButton, Tooltip} from '@mui/material'
import {replaceRow} from '../services/serverPost'
import HtmlIcon from '@mui/icons-material/Html';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import {serverFetchData} from '../services/serverFetch' 


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
export const compareTextFunc = (a,b) => {
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
export const updateTextList = (rec, list)  => {    
    return list.map(it => {
        if (compareTextFunc(rec, it)===0) {
            return rec
        } else {
            return it
        }
    })
}

// EditText
export default ({groupId, textId}) => 
{
    const [edit, setEdit] = useState()
    const [list, setList] = useState()
    const [editor, setEditor] = useState(DRAFT)
    const [sharedState, ] = useSharedState()

    const [editorState, setEditorState] = useState(emptyEditorState())
    const [record, setRecord] = useState()
    const [placeholder, setPlaceholder] = useState('No text so far')
    const language = sharedState.language
    
    // const handleAutoSave = () => saveRecord(record)
    // useAutosave({ data: record, interval:3000, onSave: handleAutoSave });

    const lookupRecordInList = lst => {
        const recordFound = lst.find(it=>it.groupId === groupId && it.textId === textId && it.language === language)
        if (recordFound) {
            return recordFound
        } else {
            return ({groupId, textId, language, textBody:'No record found'})
        }   
    }    
    
    const handleReplyFetchData = reply => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            setList(data.result)
            const rec = lookupRecordInList(data.result)
            setRecord(rec)
        } else {    
            alert(data.message)
        }    
    } 

    useEffect(()=>{ 
        serverFetchData('/fetchRows?tableName=tbl_text', handleReplyFetchData)
    },[])


    useEffect(()=>{
        if (!edit && list) {
            let rec = lookupRecordInList(list)
            setRecord(rec) 
            let edState = rec?rec.textBody?generateEditorStateFromValue(textBody):emptyEditorState():emptyEditorState()
            setEditorState(edState)
        }    
    }, [groupId, textId, language])


    const removeNonASCII = input => {
        return input.replace(/[^\x00-\x7F]/g, "")
    }

    const handleSaveReply = (reply, rec) => {
        const data = reply.data?reply.data:reply
        if (data.status === 'OK') {
            // alert('handleSaveReply:' + JSON.stringify(reply) + 'rec:' + JSON.stringify(rec))
            // Update list with rec
            setRecord(rec)
            setList(updateTextList(rec, list))
            setEdit(edit?undefined:true)
        } else {
            alert('Failed to save record for groupId = ' + (rec.groupId?rec.groupId:'missing') + ' textId = ' + (rec.textId?rec.textId:'missing'))
            setEdit(edit?undefined:true)
        }
    }
    

    const handleToggleEdit = () => {
        if (edit) {
            // Leaving edit state
            let textBody = 'No text body'
            if (editor===HTML) {
                textBody = record.textBody 
            } else {
                textBody = draftToHtml(convertToRaw(editorState.getCurrentContent()))
            }
            //removeNonASCII(textBody)
            let rec = {id:record.id?record.id:undefined, textId, groupId, language, textBody}
            replaceRow('tbl_text', rec, reply => handleSaveReply(reply, rec))
        } else {
            // Entering edit state
            const textBody = record?record.textBody?record.textBody:'No value':'No value'
            if (editor!==HTML) {
                setEditorState(textBody?generateEditorStateFromValue(textBody):emptyEditorState())
            }
            setEdit(edit?undefined:true)
        }    
    }

    const handleToggleEditor = () => setEditor(editor === DRAFT?HTML:DRAFT)

    const handleCancel = () => setEdit(undefined)

    const textBody = record?record.textBody?record.textBody:'No text body':'No record'

    return(
        <>  
            {sharedState.email?
                <IconButton key='1' variant='outlined' style={styles.button} onClick = {handleToggleEdit}>
                    {edit?
                        <Tooltip placement='top' title = 'Save the text'>
                            <SaveIcon />
                        </Tooltip>    
                    :
                        <Tooltip placement='top' title = 'Edit the text with editor choice of the button to the right'>
                            <EditIcon />
                        </Tooltip>
                    }
                </IconButton>
            :
                null
            }        
            
            {sharedState.email?
                edit?
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
                :null    
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
                            value={textBody} 
                            placeholder={placeholder}
                            onChange={e=>setRecord({...record, textBody:e.target.value})}
                        />
                    }    
                </>
            :               
                <div style={{textAlign:'left'}} dangerouslySetInnerHTML={{__html: textBody}} />
            }    
        </>
    )
}
