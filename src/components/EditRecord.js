import React from 'react';
import { Tooltip, IconButton, Button} from '@mui/material';
import TextArea from 'react-textarea-autosize';

const styles = {
    root:{
        margin:'auto',
        overflow:'auto',
        paddingBottom:20, 
        paddingLeft:20,
    },
    table:{
        fontSize:22,
        padding:20
    },
    tr: active=>({
        // textDecoration:active?'none':'line-through',
        fontStyle:active?'normal':'italic',
        opacity:active?1.0:0.6,
        backgroundColor:active?'lightGrey':'whitesmoke',
        wordWrap:'break-word',
        width:20,
    }),
    th:{
        color:'white'
    },
    td: {
        wordWrap:'break-word',
        maxLength:20
    },
    add: {
        wordWrap:'break-word',
    },
    search: {
        wordWrap:'break-word',
    }
}

// EditRecord
export default ({cols, colObjList, record, setRecord, buttons}) => {
    const colObjListReduced = colObjList?colObjList.filter(it => cols.find(col =>col === it.Field))
    :cols.map(col=>({
            Field:col,
            Type:'varchar(2000)'
    }))

    const handleChange = e => setRecord({...record, [e.target.name]:e.target.value})
    return (
        <>
        {record?
            <table>
                <thead>
                    <tr>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Value</th>
                    </tr>
                </thead>

                <tbody>
                    {colObjListReduced.map((col, index)=>
                        <tr>
                            <th style={styles.th}>
                                {col.Field}
                            </th>
                            <td>
                                {col.Type.includes('varchar')?
                                    <TextArea 
                                        autoFocus={index==0?true:undefined} 
                                        style={styles.add} 
                                        rows={3} 
                                        cols={30} 
                                        placeholder={col.Field} 
                                        maxlength={colObjList?col.Type.match(/\((.*?)\)/)[1]?col.Type.match(/\((.*?)\)/)[1]:2000:2000}
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
