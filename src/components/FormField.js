
import React, {useState, useEffect, useRef} from 'react';
import RteEditor from './RteEditor'
import {defaultDate} from '../services/functions'
import TextArea from 'react-textarea-autosize';
import DraftEditor, {emptyEditorState, generateEditorStateFromValue} from './DraftEditor'
import draftToHtml from 'draftjs-to-html'
import { convertToRaw } from 'draft-js'

const DRAFT_EDITOR='draft' 
const DRAFT_PREFIX = 'draft_'

const styles  = {
    textarea:{
        //fontFamily: 'Regular', 
        overflow:'auto',
    }    
}

// FormField 
const FormField = props => {
    const [editorState, setEditorState] = useState(emptyEditorState())
    const {fld, key, value, setValue, handleKeyPress} = props
    const radioValues = fld.radioValues?fld.radioValues.map(it=>it.trim()):[]
    const selectValues = fld.selectValues?fld.selectValues.map(it=>it.trim()):[]
    const label = fld.label?fld.label:''
    const draftName = DRAFT_PREFIX + fld.name
    const handleChange = e => {
        setValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked?1:0:e.target.value})
    }    

    useEffect(()=>{
        if (fld.type===DRAFT_EDITOR) {
            let edState = value[fld.name]?generateEditorStateFromValue(value[fld.name]):emptyEditorState()
            setEditorState(edState)
        }    
    }, [])

    const handleChangeWithPre = e => {
        if (fld.preSetValue) {
            setValue(fld.preSetValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked?1:0:e.target.value}))
        } else {
            setValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked?1:0:e.target.value})
        }    
    }    
    const handleChangeRte = (fld, val) => setValue({...value, [fld]:val})
    const handleChangeDate = e => {
        setValue({...value, [e.target.name]:e.target.value < 8?defaultDate():e.target.value});
    }    
    const required = fld.required?true:false 
    const disabled = fld.disabledFunc?fld.disabledFunc(value):false
    const labelStyle={fontWeight:700, ...props.labelStyle?props.labelStyle:{}}
    const supStyle = {color:'red', fontWeight:700, ...props.subStyle?props.subStyle:{}}
    const valueStyle = props.valueStyle?props.valueStyle:{}

        switch (fld.type) {
            case 'checkbox':
                    const checked = value[fld.name]?1:0
                    return(
                        <p>
                            <label style={labelStyle}>
                            <input 
                                key={key}
                                size={200} 
                                type={fld.type} 
                                checked={checked} 
                                name={fld.name} 
                                style={valueStyle}  
                                required={required} 
                                ref={fld.ref}
                                disabled={disabled}
                                onChange={handleChangeWithPre}
                            />
                            &nbsp;<span style={valueStyle}>{label}</span>&nbsp;&nbsp;&nbsp;&nbsp;{required?<sup style={supStyle}>*</sup>:null}
                            </label> 
                        </p>
                    )
            case 'checkboxes':
                return(
                    <p>
                        <label style={labelStyle}>
                                {label}&nbsp;{required?<sup style={supStyle}>*</sup>:null}&nbsp;
                        </label>    
                        <br/>
                        {fld.names?fld.names.map(name =>
                            <label>
                                {name}&nbsp;
                                <input 
                                    key={key}
                                    type={'checkbox'} 
                                    name={name} 
                                    checked={value[fld.name]?true:false} 
                                    required={required} 
                                    disabled={disabled}
                                    onChange={handleChange}
                                />
                            </label>
                        ):null}
                    </p> 
                )
            case 'radio':
                return(
                    <p>
                        <label style={{fontWeight:700}}>
                                {label}&nbsp;{required?<sup style={supStyle}>*</sup>:null}&nbsp;
                        </label>    
                        <br/>
                        {radioValues.map((it, idx) =>
                            <label>
                                <input 
                                    key={(it.value?it.value:it) + idx}
                                    type={fld.type}
                                    value={it.value?it.value:it} 
                                    name={fld.name} 
                                    required={required}
                                    disabled={disabled}
                                    checked={value[fld.name]?(value[fld.name] === (it.value?it.value:it)):undefined}
                                    onChange={handleChangeWithPre}
                                />
                                &nbsp;<span>{it.label?it.label:it}</span>&nbsp;
                            </label>
                        )}
                    </p> 
                )
                case 'select':
                    return(
                            <p>      
                            <label style={labelStyle}>
                                    {label}&nbsp;{required?<sup style={supStyle}>*</sup>:null}&nbsp;
                            </label>    
                            <br/>
                            <select 
                                key={key}
                                name={fld.name} 
                                value={value[fld.name]?value[fld.name]:''} 
                                required={required} 
                                disabled={disabled}
                                onChange={handleChange}
                            >
                                <option selected disabled value={""}>Välj</option>
                                {selectValues.map(val => <option value={val}>{val}</option>)}
                            </select>
                        </p>
                    )
                case 'textarea':
                return(
                    <p>
                        {label?
                            <>
                            <label style={labelStyle}>
                                    {label}&nbsp;{required?<sup style={supStyle}>*</sup>:null}&nbsp;
                            </label>    
                            <br/>
                            </>
                        :null}    
                        <textarea 
                            style={styles.textarea}
                            key={key}
                            rows={fld.rows?fld.rows:5} 
                            cols={fld.cols?fld.cols:40} 
                            maxlength={fld.maxlength}
                            name={fld.name} 
                            value={value[fld.name]?value[fld.name]:''} 
                            disabled={disabled}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            autoFocus={fld.autoFocus}
                        />
                    </p>
                    )    
                case 'TextArea':
                    return(
                        <p>
                            <label style={labelStyle}>
                                    {label}&nbsp;{required?<sup style={supStyle}>*</sup>:null}&nbsp;
                            </label>    
                            <br/>
                            <TextArea
                                style={styles.textarea}
                                placeholder=''
                                name={fld.name}
                                value={value[fld.name]?value[fld.name]:''} 
                                variant="default"
                                borderRadius="medium"
                                cols={fld.cols?fld.cols:40} 
                                minRows={fld.minRows?fld.minRows:5}
                                maxRows={fld.maxRows?fld.maxRows:400}
                                maxlength={fld.maxlength}
                                fixedSize={true}
                                AutoGrow={true}
                                onChange={handleChange}
                                disabled={disabled}
                                addClass="myTextareaClass"
                                autoFocus={fld.autoFocus}
                                />
                        </p>
                        )    
                case 'rte':
                    return(
                        <p>
                            <label style={labelStyle}>
                                    {label}&nbsp;{required?<sup style={supStyle}>*</sup>:null}&nbsp;
                            </label>    
                            <br/>
                            <RteEditor 
                                        value={value[fld.name]?value[fld.name]:''} 
                                        name={fld.name} 
                                        style={{cols:50}} 
                                        required={required} 
                                        disabled={disabled}
                                        onChange={val => handleChangeRte(fld.name, val)} 
                            />
                        </p>
                        )    
                
                    case DRAFT_EDITOR:
                        const onEditorStateChange = val => {
                            const html = draftToHtml(convertToRaw(val.getCurrentContent()))
                            setEditorState(val)
                            setValue({...value, [draftName]:val, [fld.name]:html})
                        }    
                        return (
                            <p className='content'>
                                <label style={labelStyle}>
                                        {label}&nbsp;{required?<sup style={supStyle}>*</sup>:null}&nbsp;
                                </label>    
                                <br/>
                                <DraftEditor 
                                    style={{cols:50}} 
                                    required={required} 
                                    disabled={disabled}
                                    placeholder={fld.placeholder}
                                    editorState={editorState} 
                                    onEditorStateChange={onEditorStateChange} 
                                />
                            </p>
                        )    
                    case 'date':
                        return(
                            <p>
                                <label style={labelStyle}>
                                        {label}&nbsp;{required?<sup style={supStyle}>*</sup>:null}&nbsp;
                                </label>    
                                <br/>
                                <input 
                                    key={key}
                                    {...fld} 
                                    type={fld.type} 
                                    size={40}
                                    value={value[fld.name]}
                                    name={fld.name}
                                    style={valueStyle} 
                                    required={required}
                                    disabled={disabled}
                                    defaultValue={fld.useDefaultDate?defaultDate():undefined} 
                                    onChange={handleChangeDate} 
                                />
                            </p>
                        )    
                case 'number':
                    return(
                        <p>
                            <label style={labelStyle}>
                                    {label}&nbsp;{required?<sup style={supStyle}>*</sup>:null}&nbsp;
                            </label>    
                            <br/>
                            <input 
                                type={fld.type}
                                min={0}
                                max={fld.max}
                                step={fld.step}
                                style={styles.textarea}
                                key={key}
                                name={fld.name} 
                                value={value[fld.name]?value[fld.name]:''} 
                                disabled={disabled}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                autoFocus={fld.autoFocus}
                            />
                            {fld.txtName?value[fld.txtName]?<span>&nbsp;{'('+value[fld.txtName]+')'}</span>:null:null}
                        </p>
                    )    
                case 'comment':
                    return(
                        <p>
                                <label style={labelStyle}>
                                        {label}
                                </label>    
                                <br/>
                                {value[fld.name]?value[fld.name]:''}
                        </p>
                    )    
                case 'html':
                        return(
                            <p>
                                    <label style={labelStyle}>
                                            {label}
                                    </label>    
                                    <br/>
                                    {value[fld.name]?<div dangerouslySetInnerHTML={{__html: value[fld.name]}} />:''}
                            </p>
                        )    
                default:
            return(
                <p>
                    <label style={labelStyle} >
                            {label}&nbsp;{required?<sup style={supStyle}>*</sup>:null}&nbsp;
                    </label>    
                    <br/>
                    <input 
                        {...fld} 
                        key={key}
                        type={fld.type}
                        size={40}
                        name={fld.name} style={valueStyle} 
                        value={value[fld.name]?value[fld.name]:''} 
                        required={required} 
                        disabled={disabled}
                        maxlength={fld.maxlength}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        ref={fld.inputRef?fld.inputRef:undefined}
                        autoFocus={fld.autoFocus}
                    />
                </p>
            )   
        }   
}    

const FormField1 = props => {
    const {fld, key, value, setValue, handleKeyPress} = props
    const radioValues = fld.radioValues?fld.radioValues.map(it=>it.trim()):[]
    const selectValues = fld.selectValues?fld.selectValues.map(it=>it.trim()):[]
    const label = fld.label?fld.label:'No label'
    const handleChange = e => {
        setValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked?1:0:e.target.value})
    }    
    const handleChangeRte = (fld, val) => setValue({...value, [fld]:val})
    const handleChangeDate = e => {
        setValue({...value, [e.target.name]:e.target.value < 8?defaultDate():e.target.value});
    }    
    const required = fld.required?true:false 
    const disabled = fld.disabledFunc?fld.disabledFunc(value):false
    const labelStyle={fontWeight:700, ...props.labelStyle?props.labelStyle:{}}
    const supStyle = {color:'red', fontWeight:700, ...props.subStyle?props.subStyle:{}}
    const valueStyle = props.valueStyle?props.valueStyle:{}

    return(
    <p>
        <h1 style={supStyle}>Before</h1>
        {JSON.stringify(props)}    
        <h1>After</h1>
        <p/>
    </p>
    )
}

export default FormField

/*
export const RenderField1 = ({fld, value, setValue}) => {
    const handleChange = e => setValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked:e.target.value})
    return(    
        <input {...fld} type={fld.type} size={40} value={value[fld.name]?value[fld.name]:''} name={fld.name} style={style} required={fld.required} onChange={handleChange} />
    )
}

*/