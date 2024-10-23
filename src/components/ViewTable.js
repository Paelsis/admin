import React, {useState, useEffect} from 'react';
import {isNormalVariable} from '../services/functions'
import {IconButton, Button, Tooltip} from '@mui/material';
import EditRecord from './EditRecord'
import {replaceRow, deleteRow} from '../services/serverPost'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'

const styles = {
    container:{
    },
    th:{
        backgroundColor:'grey',
        color:'white',
        padding:8,
        margin:0, 
    },
    td:{
        fontSize:'normal',
        padding:20
    }
}


// _View uses id and not index to identify a row
const _View = ({list, cols, buttons})=> {
    const [sortCol, setSortCol] = useState()
    const [asc, setAsc] = useState(false)
    const compareFunc = (a, b) => {
        if (a[sortCol] && b[sortCol]) {
            if (typeof a[sortCol] === 'string' && typeof b[sortCol] === 'string') {
                return a[sortCol].localeCompare(b[sortCol]) * (asc?1:-1)
            } else {    
                return a[sortCol] - b[sortCol] * (asc?1:-1)
            }    
        } else if (a[sortCol]) {
            return (asc?-1:1)
        } else {
            return (asc?1:-1)
        }
    }    
    const sortedList = sortCol?list.sort(compareFunc):list
    return(
        cols?
                <table>
                    <thead>
                        <tr>
                            {cols.map(col=>
                                <th style={styles.th} onClick={()=>{setSortCol(col); setAsc(!asc) }}>{col}</th>
                            )}
                            {buttons?buttons.map(button =>
                                <th style={styles.th}>
                                    {button.label?button.label:''}
                                </th>
                            ):null}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedList.map(li=>
                            <tr>
                                {cols.map(col=>
                                    <td style={styles.td}>{(typeof li[col] == "boolean")?(li[col]?'true':'false'):li[col]}</td>
                                )}    
                                {buttons?buttons.map(button =>
                                    <>
                                        {button.icon?
                                            <td style={styles.td}>
                                                <Tooltip title={button.tooltip}>
                                                    <IconButton onClick={()=>button.onClick?button.onClick(li):null} >
                                                        {(typeof button.icon === 'function')?button.icon(li.id):button.icon}
                                                    </IconButton>    
                                                </Tooltip>    
                                            </td>
                                        :   
                                            <td style={styles.td}>
                                                <Tooltip title={button.tooltip}>
                                                    <Button onClick={()=>button.onClick?button.onClick(li):null}>
                                                        {button.label?button.label:'Button'}
                                                    </Button>
                                                </Tooltip>   
                                            </td>
                                        }    
                                    </>
                            ):null}
                            </tr>
                        )}
                    </tbody>
                </table>
    :
        <h1>No colsView</h1>  
    )   
}

// ViewTable (Note tableName, originalList and setOriginalList is used when just after update or delete )
export default ({colsView, colsEdit, colObjList, tableName, originalList, setOriginalList, list}) => {
    const [record, setRecord] = useState()

    const handleReplaceReply = (data, rec) => {
        if (data.status === 'OK') {
            if (rec.id) {
                const newList = originalList.map(it=>{
                    if (it.id === rec.id) {
                        return rec 
                    } else {
                        return it
                    }    
                })    
                setOriginalList(newList) // Note setList is the full list, while list is just part
                setRecord()
            } else {
                alert('[ListFestivalRegistrations]: No record id to update')
            }   
        } else {
            alert('[ListFestivalRegistrations]: object is missing key "id" and can therefore not be updated')
        }    
    }

    const replaceRecord = rec=>replaceRow(tableName, rec, data=>handleReplaceReply(data, rec)) 

    const handleDeleteReply = (data, id) => {
        if (data.status === 'OK') {
            if (id) {
                setOriginalList(originalList.filter(it=>it.id !=id))
            }        
        } else {
            alert('[ListFestivalRegistrations]: object is missing key "id" and can therefore not be updated')
        }    
    }
    const deleteRecord = rec=> {
        // const strRec = JSON.stringify(rec)
        if (!window.confirm("Are you sure you want to the remove record ?\n\n")) {
            // Cancel
            return
        }
        deleteRow(tableName, rec.id, data=>handleDeleteReply(data, rec.id))
    }
    const buttonsEdit = [
        {
            icon:<SaveIcon />,
            label:'Edit/Save',
            onClick:replaceRecord
        },
        {
            icon:<DeleteIcon />,
            label:'Delete',
            onClick:deleteRecord // Passes the record
        }
    ]

    const buttonsView = [
        {
            icon:<EditIcon />,
            label:'Edit/Save',
            onClick:setRecord
        },
        {
            icon:<DeleteIcon />,
            label:'Delete',
            onClick:deleteRecord
        }
    ]
    const allCols = Object.keys(list[0])


    
    return(
    list?
        record?
            <EditRecord 
                cols={colsEdit?colsEdit:allCols} 
                colObjList={colObjList}
                record = {record} 
                setRecord={setRecord}
                buttons={buttonsEdit} 
            />
        :
            <_View 
                list={list} 
                cols={colsView?colsView:allCols} 
                setRecord={setRecord}
                buttons={buttonsView} 
            />
    :
        <h1>No records in list</h1>    
    )
}
