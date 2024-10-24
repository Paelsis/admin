import React from 'react';
import { Tooltip, IconButton, Button} from '@mui/material';
import TextArea from 'react-textarea-autosize';

const styles = {
    root:{
        overflow:'auto',
        paddingBottom:2, 
        paddingLeft:2,
    },
    table:{
        fontSize:18,
    },
    tbody:{
        marginLeft:0,
    },
    tr: active=>({
        // textDecoration:active?'none':'line-through',
        fontStyle:active?'normal':'italic',
        opacity:active?1.0:0.6,
        backgroundColor:active?'lightGrey':'whitesmoke',
        wordWrap:'break-word',
        marginLeft:2,
        textAlign:'left'
    }),
    th:{
        color:'white'
    },
    thSmall:{
        color:'white',
        fontSize:10,
    },
    td: {
        wordWrap:'break-word',
        maxLength:20,
        marginLeft:2,
    },
    add: {
        wordWrap:'break-word',
        marginLeft:0,
    },
    search: {
        wordWrap:'break-word',
    }
}

const colLengthOld = col => col.Type.match(/\((.*?)\)/)[1]
const valueBetweenDelimiters = (str, delimiter1, delimiter2) => {
    let pos1
    let pos2
    if ((pos1 = str.indexOf(delimiter1)) === -1) {
        return undefined
    } 
    if ((pos2 = str.indexOf(delimiter2)) === -1) {
        return undefined
    } 
    if (pos1 < pos2) {
        return str.substring(pos1+1, pos2)
    } else {
        return undefined
    }
}   

const lengthOfType = type => {
    if (type === 'text') {
        return 32000
    } else if (type.includes('varchar')) {
        const length = valueBetweenDelimiters(type, '(', ')')
        return length?length:2000
    } else {
        return undefined
    }   
}    


// EditRecord
export default ({cols, colObjList, record, setRecord, buttons}) => {
    const colObjListReduced = colObjList?
        colObjList.filter(it => cols.find(col => col === it.Field))
    :
        cols.map(col=>(
            {
                Field:col,
                Type:'varchar(2000)'
            }
        ))

    const handleChange = e => setRecord({...record, [e.target.name]:e.target.value})
    return (
        <>
        {record?
            <table>
                <thead>
                    <tr>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Value</th>
                        <th style={styles.thSmall}>Max length</th>
                    </tr>
                </thead>

                <tbody>
                    {colObjListReduced.map((col, index)=>
                        <tr style={styles.tr(col.active)}>
                            <th style={styles.th}>
                                {col.Field}
                            </th>
                            <td style={styles.td}>
                                {(col.Type.includes('varchar') || col.Type==='text')?
                                    <TextArea 
                                        autoFocus={index==0?true:undefined} 
                                        style={styles.add} 
                                        rows={3} 
                                        cols={30} 
                                        placeholder={col.Field  } 
                                        maxlength={lengthOfType(col.Type)}
                                        name={col.Field} 
                                        value = {record[col.Field]} 
                                        onChange={handleChange}
                                    />
                                :col.Type.includes('int')?
                                    <input 
                                        autoFocus={index==0?true:undefined} 
                                        maxlength={2000}
                                        style={styles.add} 
                                        type={'number'} 
                                        placeholder={col.Field} 
                                        name={col.Field} 
                                        value = {record[col.Field]} 
                                        onChange={handleChange}
                                    />
                                :
                                    <input 
                                        autoFocus={index==0?true:undefined} 
                                        maxlength={2000}
                                        style={styles.add} 
                                        type={col.Type} 
                                        placeholder={col.Field} 
                                        name={col.Field} 
                                        value = {record[col.Field]} 
                                        onChange={handleChange}
                                    />
                                }    
                            </td>
                            <td style={{fontSize:10}}>{lengthOfType(col.Type)}</td>
                        </tr>
                    )}  

                    {buttons?     
                        <tr>
                            <td colSpan={2}>
                                {buttons.map(button => 
                                    button.icon?
                                            <Tooltip title={<h2>{button.tooltip}</h2>}>
                                                <IconButton onClick={()=>button.onClick(record)}>
                                                    {button.icon}                            
                                                </IconButton>
                                            </Tooltip>
                                    :    
                                            <Button variant={button.variant?button.variant:'outlined'} style={{color:'white'}} onClick={()=>button.onClick()}>{button.label?button.label:'No label'}</Button>
                                )}    
                            </td>
                        </tr>
                    :
                        <tr>
                            <td colSpan={2}>No buttons passed to _RenderEdit</td>
                        </tr>
                    }
                </tbody>
            </table>
        
        :
            <h3>No record</h3>
        }
        </>
    )

}
