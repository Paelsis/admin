
import React, {useState, useEffect, useRef} from 'react';
import RteEditor from './RteEditor'
import DraftEditor from './DraftEditor'
import draftToHtml from 'draftjs-to-html'
import { convertToRaw } from 'draft-js'
//import {isAndroidOperatingSystem} from '../services/isAndroid'
//const isAndroid = isAndroidOperatingSystem()

const styles  = {
    textarea:{
        //fontFamily: 'Regular', 
        overflow:'auto',
    }    
}

const FormField1 = props => {
    const {fld, value, setValue, handleKeyPress} = props
    const radioValues = fld.radioValues?fld.radioValues.map(it=>it.trim()):[]
    const selectValues = fld.selectValues?fld.selectValues.map(it=>it.trim()):[]
    const label = fld.label?fld.label:'No label'
    const handleChange = e => {
        setValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked?1:0:e.target.value})
    }    
    const required = fld.required?true:false 
    const disabled = fld.disabledFunc?fld.disabledFunc(value):false
    const labelStyle={fontWeight:700, ...props.labelStyle?props.labelStyle:{}}
    const supStyle = {color:'red', fontWeight:700, ...props.subStyle?props.subStyle:{}}
    const valueStyle = props.valueStyle?props.valueStyle:{}
    const draftName = 'draft_' + fld.name 

    return(
    <p>
        <h1 style={supStyle}>Before</h1>
        {JSON.stringify(props)}    
        <h1>After</h1>
        <p/>
    </p>
    )
}

// FormField 
const FormField = props => {
    const {fld, value, setValue, handleKeyPress} = props
    const radioValues = fld.radioValues
    const selectValues = fld.selectValues?fld.selectValues.map(it=>it.trim()):[]
    const label = fld.label?fld.label:'No label'
    const maxLength = fld.maxLength?fld.maxLength:undefined
    const handleChange = e => {
        setValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked?1:0:e.target.value})
    }    
    const handleChangeRte = val => setValue({...value, [fld.name]:val})

    const isObjectArray = fld.type === 'radio' && Array.isArray(fld.radioValues)

    useEffect(()=>{
        if (fld.type === 'draft') {
            const draftFieldName = 'draft_' + fld.name;
            if (value[fld.name] && !value[draftFieldName]) {
                alert('The variable value[' + draftFieldName + '] must be initialized with function enhanceValueWithDraftVariables()')
            }    
        }    
    }, []);
    
    const onEditorStateChange = val => {
        const draftName='draft_' + fld.name
        const html = draftToHtml(convertToRaw(val.getCurrentContent()))
        setValue({...value, [draftName]:val, [fld.name]:html})
    }    
    const handleChangeDate = e => {
        setValue({...value, [e.target.name]:e.target.value});
    }    


    const required = fld.required?true:false 
    const disabled = fld.disabled?fld.disabled:fld.disabledFunc?fld.disabledFunc(value):false
    const labelStyle={fontWeight:700, ...props.labelStyle?props.labelStyle:{}, opacity:disabled?0.4:1.0}
    const supStyle = {color:'red', fontWeight:700, ...props.subStyle?props.subStyle:{}}
    const valueStyle = props.valueStyle?props.valueStyle:{}

        switch (fld.type) {
            case 'checkbox':
                    return(
                        <p>  
                            <label style={labelStyle}>
                            <input 
                                key={fld.name}
                                size={200} 
                                type={fld.type} 
                                checked={value[fld.name]?true:false} 
                                name={fld.name} 
                                style={valueStyle}  
                                required={required} 
                                ref={fld.ref}
                                disabled={disabled}
                                onChange={handleChange}
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
                                    key={fld.name}
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
                        {radioValues.map((radio, idx) =>
                            <label>
                                <input 
                                    key={fld.name + idx}
                                    type={fld.type}
                                    value={radio.value?radio.value:radio} 
                                    name={fld.name} 
                                    required={required}
                                    disabled={disabled}
                                    checked={value[fld.name] === (radio.value?radio.value:radio)}
                                    onChange={handleChange}
                                />
                                &nbsp;<span>{radio.label?radio.label:radio}</span>&nbsp;
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
                                key={fld.name}
                                name={fld.name} 
                                value={value[fld.name]?value[fld.name]:''} 
                                required={required} 
                                disabled={disabled}
                                onChange={handleChange}
                            >
                                <option defaultValue disabled value={""}>Välj</option>
                                {selectValues.map(val => <option value={val}>{val}</option>)}
                            </select>
                        </p>
                    )
                case 'textarea':
                return(
                    <p>
                        <label style={labelStyle}>
                            {label}
                            &nbsp;{required?<sup style={supStyle}>*</sup>:null}&nbsp;
                        </label>    
                        <br/>
                        <textarea 
                            style={styles.textarea}
                            key={fld.name}
                            rows={5} 
                            cols={fld.cols?fld.cols:40} 
                            name={fld.name} 
                            value={value[fld.name]?value[fld.name]:''} 
                            disabled={disabled}
                            onChange={handleChange}
                            maxLength={maxLength}
                            onKeyPress={handleKeyPress}
                        />
                    </p>
                    )    
                case 'rte':
                    return(
                        <p className='content'>
                            <label style={labelStyle}>
                                    {label}&nbsp;{required?<sup style={supStyle}>*</sup>:null}&nbsp;
                            </label>    
                            <br/>
                            <RteEditor 
                                        value={value[fld.name]?value[fld.name]:''} 
                                        style={{cols:50}} 
                                        required={required} 
                                        disabled={disabled}
                                        onChange={val => handleChangeRte(val)} 
                            />
                        </p>
                        )    
                
                case 'draft':
                            return(
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
                                                editorState={value['draft_' + fld.name]?value['draft_' + fld.name]:''} 
                                                onEditorStateChange={val => onEditorStateChange(val)} 
                                    />
                                </p>
                                )    
                case 'date':
                        return(
                        <p>
                            <label style={labelStyle}>
                                {label}
                                &nbsp;{required?<sup style={supStyle}>*</sup>:null}&nbsp;
                            </label>    
                            <br/>
                            <input 
                                key={fld.name}
                                {...fld} 
                                type={fld.type} 
                                size={40}
                                value={value[fld.name]}
                                name={fld.name}
                                style={valueStyle} 
                                required={required}
                                disabled={disabled}
                                onChange={handleChangeDate} 
                            />
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
                        key={fld.name}
                        size={fld.type==='text'?40:undefined}
                        style={valueStyle} 
                        value={value[fld.name]?value[fld.name]:''} 
                        maxLength={maxLength}
                        required={required} 
                        disabled={disabled}
                        placeholder={fld.placeholder}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        ref={fld.inputRef?fld.inputRef:undefined}
                    />
                </p>
            )   
        }   
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