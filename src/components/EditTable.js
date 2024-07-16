import React, {useState, useEffect} from 'react';
import {addRow, replaceRow, deleteRow} from '../services/serverPost'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email'
import SearchIcon from '@mui/icons-material/Search'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import CameraIcon from '@mui/icons-material/Camera'
import { Tooltip, IconButton, Button} from '@mui/material';
import { cyan, red } from '@mui/material/colors';
import { STATUS_STYLE } from '../services/constant';
import StatusMessage from './StatusMessage';
import ReactRte from 'react-rte';

const TEXTAREA_FIELDS=['textBody']

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

const Rte = ({value, handleSave}) => {
    const [rteValue, setRteValue] = useState({})
    return(
        <ReactRte 
                value={rteValue} onChange={val => setRteValue(val)}
        />
    )
}

const _RenderEdit = ({columns, record, buttons, handleChange}) => {
    const columnsTable = columns?columns:Object.entries(record).map(it => ({
            Field:it[0],
            type:'text'
    }))
    const filterFunc = it => (it.Field !== 'id' && it.Field.indexOf('Timestamp') === -1)
    const columnsReduced = columnsTable.filter(filterFunc)
    return(
        record?
            <table>
                <thead>
                    <tr>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Value</th>
                    </tr>
                </thead>

                <tbody>
                    {columnsReduced.map((col, index)=>
                        <tr>
                            <th style={styles.th}>
                                {col.Field}
                            </th>
                            <td>
                                {TEXTAREA_FIELDS.includes(col.Field)?
                                    <textarea autoFocus={index==0?true:undefined} style={styles.add} rows={3} columns={50} name={col.Field} placeholder={col.Field} value = {record[col.Field]} onChange={handleChange}/>
                                :
                                    <input autoFocus={index==0?true:undefined} style={styles.add} type={col.type} name={col.Field} placeholder={record[col.Field]} value = {record[col.Field]} onChange={handleChange}/>
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
                                                <IconButton onClick={()=>button.onClick(button, record)}>
                                                    {button.icon}                            
                                                </IconButton>
                                            </Tooltip>
                                    :    
                                            <Button variant={button.variant?button.variant:'outlined'} style={{color:'white'}} onClick={()=>button.onClick(record)}>{button.label?button.label:'No label'}</Button>
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
    )

}

const maillist = (list, fld) => list.map(it => it[fld]?it[fld]:'').join(', ')

const HeaderValue = ({list, fld, comment}) => 
    fld.indexOf('email')===-1?
        <Tooltip title={<h2>{comment}</h2>}>
            <th style={styles.th} size={10} key={fld}>
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
                <input type='text' size={10} name={fld} placeholder={fld} value={search[fld]?search[fld]:''} onChange={handleChange} />
            </th>
        :  
            <th>
                <input type='text' size={10} name={fld + 'From'} placeholder={fld + 'From'} value={search[fld + 'From']} onChange={handleChange} />
                <input type='text' size={10}name={fld + 'To'} placeholder={fld + 'To'} value={search[fld + 'To']} onChange={handleChange} />
            </th>
    )    
    }

const _RenderView = ({list, columns, buttons, handleAdd, search, setSearch, filterList, setFilterList, handleFilter, handleComment}) => {
    const keys = columns?columns.map(it=>it.Field):Object.keys(list[0])
    const filterFunc = key => key=='id'?false:true 
    
    const clearFilter = () => {
        setSearch({})
        setTimeout(()=>setFilterList(list) ,500)
    }

    return(
    <table>
        <thead>
            <tr>
                {keys.filter(filterFunc).map(it=>
                    <Tooltip title={handleComment(it)}>  
                        <HeaderValue list={list} fld={it?it:'No name'} comment={handleComment(it)}/>
                    </Tooltip>
                )}    
                <th colSpan={2} />
            </tr>
            {list.length > 5?
            <tr>
                {keys.filter(filterFunc).map(it=>
                    <SearchValue fld={it} search={search} setSearch={setSearch} />
                )}
                {<th>
                    <IconButton  onClick={handleFilter} >
                        <SearchIcon/>
                    </IconButton> 
                </th>}
                {<th>
                    <IconButton  onClick={()=>clearFilter()} >
                        <CancelIcon />
                    </IconButton> 
                </th>}
            </tr>
            :null}
        </thead>
        <tbody>
            {filterList.map(row => 
                <tr style={styles.tr(row.active)}>
                    {keys.filter(filterFunc).map(key=>
                        <td style={styles.td}>
                            <div dangerouslySetInnerHTML={{__html: row[key]}} />
                        </td>
                    )}       
                    {buttons.map(but=>
                        <td style={styles.td}>
                            <Tooltip title={<h2>{but.tooltip}</h2>}>
                                <IconButton onClick={()=>but.onClick(row)}>
                                        {but.icon}
                                </IconButton>
                            </Tooltip>
                        </td>
                    )}    
                </tr>     
            )}      
                <tr style={styles.tr(false)}>
                    <td colSpan = {keys.length + 2} style={styles.td} >
                        <IconButton>
                            <AddIcon onClick={()=>handleAdd({})} />
                        </IconButton>
                    </td>                
                </tr>       

            </tbody>    
    </table>
    )
}    

// EditTable
export default ({tableName, columns, list, setList}) => {
    const [record, setRecord] = useState()
    const [recordRte, setRecordRte] = useState()
    const [search, setSearch] = useState({})
    const [filterList, setFilterList] = useState()
    const [status, setStatus] = useState({})

    useEffect(()=>{
        setRecord(undefined)
        setFilterList(undefined)
        setSearch({})
    },[columns, list])

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

    const handleDeleteReply = (data, id) => {
        const dt = new Date().toLocaleString()
        if (data.status === 'OK') {
            const message='Successful delete of record in table ' + tableName + ' at ' + dt
            setStatus({style:STATUS_STYLE.OK, message})

            if (data.list) {
                setList(data.list) 
                handleFilter(data.list)

            } else {    
                let newList = []
                if (id) {
                    newList = list.filter(it=>it.id !== id)
                } else {
                    newList = list 
                }
                setList(newList)
                handleFilter(newList)
            } 
        } else {
            const message='Failed delete record in table ' + tableName + ' at ' + dt
            setStatus({style:STATUS_STYLE.OK, message})

            alert('Failed to delete row, result:' + JSON.stringify(data))    
        }
    }


    const handleDelete = id => {
        deleteRow(tableName, id, data=>handleDeleteReply(data, id))
    }

    const handleReplaceReply = data => {
        const dt = new Date().toLocaleString()
        if (data.status === 'OK') {
            const message='OK: Successful save/replace of record in table ' + tableName + ' at ' + dt
            setStatus({style:STATUS_STYLE.OK, message})

            if (data.list !== undefined) {
                const message='Successful save in table ' + tableName + ' at ' + dt
                setStatus({style:STATUS_STYLE.OK, message})
                setList(data.list) 
                handleFilter(data.list)
            } else {
                let newList = []
                if (record.id) {
                    // If id exists in record, then it is an update
                    let found = false;
                    newList = list.map(it=>{
                        if (record.id === it.id) {
                            found = true
                            return record
                        } else {
                            return it
                        }    
                    })    
                } else {
                    // If id does not exist in record, then it as an add
                    let newId = data.id?data.id:list.length > 0?list[list.length-1].id+10000:10000
                    newList = [...list, {...record, id:newId}] 
                }
                setList(newList)
                handleFilter(newList)


                setRecord(undefined)
            }    
        } else {
            const message='ERROR: Failed to add row in table ' + tableName + ' at ' + dt
            setStatus({style:STATUS_STYLE.ERROR, message})
            alert('Failed to add row, result:' + JSON.stringify(data))    
        }
    }


    const handleReplace = () => {
        replaceRow(tableName, record, handleReplaceReply)
    }


    const handleChange = e => {
        setRecord({...record, [e.target.name]:e.target.value})
    }

    const handleChangeRte = (key, val) => {
        setRecordRte({...recordRte, [key]:val})
    }

    const handleCancel = row => {
        setRecord(undefined)
    }

    const handleFilter = list => {
        let filterList = list
        const first = list[0] 
        Object.entries(search).forEach(it => {
            const key = it[0]
            const value = it[1]

            if ((!key.includes('From') && !key.includes('To')) || first[key]) {
                filterList = filterList.filter(li => li[key]?li[key].includes(it[1]):true)
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



    //const emptyRow = columnsToEmptyObject(columns)

    const buttonsEdit = [
        {
            icon:<SaveIcon />,
            tooltip:'Save row',
            onClick:handleReplace
        },
        {
            icon:<CancelIcon />,
            tooltip:'Cancel edit',
            onClick:row=>handleCancel(row)
        },
        {
            icon:<DeleteIcon />,
            tooltip:'Delete row',
            onClick:row=>handleDelete(row.id)
        },
    ]

    const buttonsView = [
        {
            icon:<EditIcon />,
            tooltip:'Edit row',
            onClick:row=>setRecord(row)
        },
        {
            icon:<DeleteIcon />,
            tooltip:'Delete row',
            onClick:row=>handleDelete(row.id)
        },
    ]    
  
    return(
        <div style={styles.root}>
            {record?
                <_RenderEdit 
                    columns={columns} 
                    buttons={buttonsEdit}
                    record={record} 
                    handleChange={handleChange} 
                    handleChangeRte={handleChangeRte} 
                />
            :list.length > 0?
                <>
                    <_RenderView 
                        list={list}
                        columns={columns}
                        buttons={buttonsView}
                        search={search}
                        setSearch={setSearch}
                        handleAdd={setRecord}
                        filterList={filterList?filterList:list} 
                        setFilterList={setFilterList} 
                        handleFilter={()=>handleFilter(list)}
                        handleComment={handleComment} 
                    />
                </>
            :<h1>List is empty</h1>}
            <StatusMessage status={status} />
        </div>
    )
}


