import React, {useState, useEffect} from 'react';
import {addRow, replaceRow, deleteRow} from '../services/serverPost'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email'
import SearchIcon from '@mui/icons-material/Search'
import CancelIcon from '@mui/icons-material/Cancel'
import { Tooltip, IconButton, Button} from '@mui/material';

import ReactRte from 'react-rte';

const TEXTAREA_FIELDS=['textBody']

const styles = {
    root:{
        margin:'auto',
        overflow:'auto'
    },
    table:{
        fontSize:22
    },
    th: {
        color:'white',
        wordWrap:'break-word',
    },
    tr: active=>({
        backgroundColor:active?active==1?'orange':'transparent':'transparent',
        textDecoration:active?active==1?'none':'line-through':'none',
        opacity:active?active==1?1.0:0.4:1.0,
        wordWrap:'break-word',
        width:20
    }),
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

const Rte = ({value, handleSave}) => {
    const [rteValue, setRteValue] = useState({})
    return(
        <ReactRte 
                value={rteValue} onChange={val => setRteValue(val)}
        />
    )
}

const _RenderEdit = ({record, setRecord, buttons, columns, handleChange}) => {
    const keys = columns?columns.map(it=>it.Field):Object.entries(record).filter(it=>it[0] !== 'id' && it[0].indexOf('Timestamp') === -1)
    const onClick = (button, record) => {
        if (button.toggle) {
            setRecord(undefined)
        }
        button.handleClick(record)
    }



    return(
        record?
            <table>
                <thead>
                    <tr>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th} >Value</th>
                    </tr>
                </thead>

                <tbody>
                    {keys.map(key=>
                        <tr>
                            <th style={styles.th}>
                                {key}
                            </th>
                            <td>
                                {TEXTAREA_FIELDS.includes(key)?
                                    <textarea style={styles.add} rows={3} columns={50} name={key} placeholder={key} value = {record[key]} onChange={handleChange}/>
                                :
                                    <input style={styles.add} type={'text'} name={key} placeholder={record[key]} value = {record[key]} onChange={handleChange}/>
                                }    
                            </td>
                        </tr>
                    )}  

                    {buttons?     
                        <tr>
                            <td colSpan={2}>
                                {buttons.map(button => 
                                    button.icon?
                                            <IconButton onClick={()=>onClick(button, record)}>
                                                {button.icon}                            
                                            </IconButton>
                                    :    
                                            <Button variant={button.variant?button.variant:'outlined'} style={{color:'white'}} onClick={()=>onClick(record)}>{button.label?button.label:'No label'}</Button>
                                )}    
                            </td>
                        </tr>
                    :
                        <tr>
                            <td colSpan={2}>No buttons</td>
                        </tr>
                    }
                </tbody>
            </table>
        :
            <h3>No record</h3>
    )

}

const maillist = (list, fld) => list.map(it => it[fld]?it[fld]:'').join(', ')

const HeaderValue = ({list, fld, comment}) => 
    fld.indexOf('email')===-1?
        <Tooltip title={<h2>{comment}</h2>}>
            <th size={10} key={fld} style={styles.th}>
                {fld}
            </th>
        </Tooltip>
    :  
        <th style={styles.th}>
            {fld}&nbsp;
            <a href={'mailto:?bcc=' + maillist(list, fld) + '&subject=Mail från TK'} target="_top">
                <EmailIcon style={{cursor:'pointer', fontSize:'small', color:'lightBlue'}} />
            </a>
        </th>


const SearchValue = ({fld, search, setSearch}) => {
    const handleChange = e => setSearch({...search, [e.target.name]:e.target.value}) 

    return (
        fld.indexOf('Timestamp')===-1?
            <th key={fld}>
                <input type='text' style={styles.search} size={10} name={fld} placeholder={fld} value={search[fld]} onChange={handleChange} />
            </th>
        :  
            <th>
                <input type='text' style={styles.search} size={10} name={fld + 'From'} placeholder={fld + 'From'} value={search[fld + 'From']} onChange={handleChange} />
                <input type='text' style={styles.search} size={10}name={fld + 'To'} placeholder={fld + 'To'} value={search[fld + 'To']} onChange={handleChange} />
            </th>
    )    
    }

const RenderTable = ({list, columns, filterList, handleEdit, handleDelete, search, setSearch, handleFilter, handleComment}) => {
    const keys = columns?columns.map(it=>it.Field):Object.keys(list[0])
    const filterColumns = key => keys?true:key!=='id' 
    return(
    <table style={{border:'1px solid lightGrey', margin:10}} >
        <thead>
            <tr style={{color:'white', backgroundColor:'black'}}>
                {keys.filter(filterColumns).map(it=>
                    <Tooltip title={handleComment(it)}>  
                        <HeaderValue list={list} fld={it?it:'No name'} comment={handleComment(it)}/>
                    </Tooltip>
                )}    
                <th colSpan={2} style={styles.th}/>
            </tr>
            {list > 5?
            <tr>
                {keys.map(it=>
                    <SearchValue fld={it} search={search} setSearch={setSearch} />
                )}
                {<th>
                    <SearchIcon onClick={handleFilter} />
                </th>}

                <th/>
            </tr>
            :null}
        </thead>
        <tbody>
            {filterList.map(row => 
                    <tr style={styles.tr(row.active)}>
                        {keys.map(key=>
                            <td style={styles.td}>
                                <div dangerouslySetInnerHTML={{__html: row[key]}} />
                            </td>
                        )}       
                        <td><EditIcon onClick={()=>handleEdit(row)} /></td>
                        <td><DeleteForeverIcon onClick={()=>handleDelete(row.id)} /></td>
                    </tr>            
                )
            }      
        </tbody>    
    </table>
    )
}    

const EditTable = ({tableName, columns, buttons, list, setList, style}) => {
    const [record, setRecord] = useState(undefined)
    const [recordRte, setRecordRte] = useState(undefined)
    const [search, setSearch] = useState({})
    const [filterList, setFilterList] = useState()

    useEffect(()=>{
        setRecord(undefined)
        setFilterList(undefined)
        setSearch({})
    },[tableName])

    const columnsToEmptyObject = columns => {
        let obj = {}
        if (columns) {
            columns.map(col=>col.Field).filter(it=> it !== 'id' && it.indexOf('Timestamp') === -1).forEach(col=>    
            obj = {...obj, [col.Field]:''}
            )
        } else {
            obj = {}
        }
        return obj
    }    

    const handleComment = key => {
        const foundColumn = columns.map(co=>co.Field).indexOf(key)
        return foundColumn?foundColumn.Comment?foundColumn.Comment:'No help text':'No help text'
    } 

    const handleDeleteReply = data => {
        if (data.status === 'OK') {
            if (data.list !== undefined) {
                setList(data.list) 
                handleFilter(data.list)
            } else {
                alert('Delete successful but the reply is missing value data.list, data:' + JSON.stringify(data))    
            }    
        } else {
            alert('Failed to delete row, result:' + JSON.stringify(data))    
        }
    }


    const handleDelete = id => {
        deleteRow(tableName, id, handleDeleteReply)
    }

    const handleSaveReply = data => {
        if (data.status === 'OK') {
            if (data.list !== undefined) {
                setList(data.list) 
                handleFilter(data.list)
            } else {
                alert('Replace successful but the reply is missing value data.list')    
            }    
        } else {
            alert('Failed to add row, result:' + JSON.stringify(data))    
        }
    }

    const handleReplaceReply = data => {
        if (data.status === 'OK') {
            setList(data.list)
            handleFilter(data.list)
        } else {
            alert('Failed to replace row, result:' + JSON.stringify(data))    
        }
    }    

    const handleSave = e => {
        if (record.id === undefined) {
            replaceRow(tableName, record, handleSaveReply)
        } else {
            replaceRow(tableName, record, handleReplaceReply)
        }   
        // Replace row in database
        setRecord(undefined)
    }

    const handleChange = e => {
        setRecord({...record, [e.target.name]:e.target.value})
    }

    const handleChangeRte = (key, val) => {
        setRecordRte({...recordRte, [key]:val})
    }

    const handleCancel = e => {
        setRecord(undefined)
    }


    const handleFilter = list => {
        let filterList = list
        const first = list[0] 
        Object.entries(search).forEach(it => {
            const key = it[0]
            const value = it[1]

            if ((!key.includes('From') && !key.includes('To')) || first[key]) {
                filterList = filterList.filter(li => li[key].includes(it[1]))
            } else {
                if (key.includes('From')) {
                    const fld = key.split('From')[0]
                    alert('key' + key)
                    filterList = filterList.filter(li => li[fld].localeCompare(value) >= 0)
                }    
                if (key.includes('To')) {
                    const fld = key.split('To')[0]
                    filterList = filterList.filter(li => li[fld].localeCompare(value) <= 0)
                }    

            }    
        })           
        setFilterList(filterList)         
    }

    const emptyRow = columnsToEmptyObject(columns)
  
    return(
        <div style={styles.root}>
            {record?
                <_RenderEdit 
                    columns={columns} 
                    buttons={buttons}
                    record={record} 
                    setRecord={setRecord}
                    handleChange={handleChange} 
                    handleChangeRte={handleChangeRte} 
                    handleSave={handleSave} 
                    handleCancel={handleCancel}
                />
            :list.length > 0?
                <>
                    <RenderTable 
                        list={list}
                        columns={columns}
                        search={search}
                        filterList={filterList?filterList:list} 
                        setSearch={setSearch}
                        handleFilter={()=>handleFilter(list)}
                        handleEdit={setRecord} 
                        handleDelete={handleDelete} 
                        handleComment={handleComment} 
                    />
                </>
            :<h1>List is empty</h1>}
        </div>
    )
}

export default EditTable

