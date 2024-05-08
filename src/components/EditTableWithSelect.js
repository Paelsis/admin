
import {useState} from 'react'
import {IconButton, Tooltip} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save'
import AddIcon from '@mui/icons-material/Add'
import CopyIcon from '@mui/icons-material/ContentCopy'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { Select } from './Picklist'

const LabelWithSup = ({col}) => {
    const supStyle = {color:'red', fontWeight:700}
    return(
        <>
            {col.label}&nbsp;{col.required?<sup style={supStyle?supStyle:{}}>*</sup>:null}&nbsp;
        </>    
    )
}

const Column = ({noLabel, col, value, setValue, style}) => {
    const defaultArguments = {
        type:col.type,
        name:col.name,
        placeholder:col.placeholder?col.placecolder:'',
        checked:col.type === 'checkbox'?value[col.name]:undefined,
        maxlength:col.maxlength,
        value:col.type === 'checkbox'?undefined:(value[col.name]?value[col.name]:''),
        required:col.required,
        radioValues:col.type==='radio'?col.radioValues:undefined,
    } 
    const label = col.label?col.label:'No label'
    const labelStyle = col.labelStyle?col.labelStyle:{}
    const selectValues = col.selectValues?col.selectValues:['ADAM', 'BERTIL', 'CESAR']

    const handleChange = e => {
        setValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked:e.target.value})
    }    

    return(
        <>
            {noLabel?null:
                <>
                <label style={labelStyle}>
                    <LabelWithSup col={col} />
                </label>    
                <br />
                </>
            }
        {col.type === 'textarea'?
                <>
                <textarea 
                    {...defaultArguments}
                    cols={col.cols?col.cols:30} 
                    rows={1} 
                    onChange={handleChange}
                    style={style?style:{}}
                />
                </>
            :col.type === 'radio'?
                    <>
                        {col.radioValues?col.radioValues.map((radio, idx) =>
                            <label>
                                <input 
                                    {...defaultArguments}
                                    // checked={value[col.name] === (radio.value?radio.value:radio)}
                                    onChange={handleChange}
                                    style={style?style:{}}
                               />
                                &nbsp;<span>{radio.label?radio.label:radio}</span>&nbsp;
                            </label>
                            )
                        :
                            <h1>No radio values</h1>
                        }
                    </> 
            :col.type === 'select'?
                <>      
                    <Select 
                        {...col}
                        value={value[col.name]?value[col.name]:''}
                        handleClick={val => setValue({...value, [col.name]:val})} 
                        style={style?style:{}}
                    />
                </>
            :col.type === 'number'?
                <input 
                    {...defaultArguments} 
                    onChange={handleChange} size={7} 
                    style={style?style:{}}
                />
            :
            <>
                <input 
                    {...defaultArguments} 
                    onChange={handleChange}
                    style={style?style:{}}
                />

            </>
            }
        </>
    )    
}


const _AddRow = ({columns, addRow, noLabel}) => {
    const [value, setValue] = useState({})
    return(
        <tr style={{fontSize:12}}>
            {columns.map(col => 
                <td>
                    <Column noLabel={noLabel} col={col} value={value} setValue={setValue} style={{backgroundColor:'lightYellow'}} />
                </td>
            )}    
            <td colSpan={3}>
            <IconButton onClick={()=>{addRow(value); setValue({})}}>
                <AddIcon  />
            </IconButton>
            </td>
        </tr>    
    )
 }

 const _EditRowHorizontal = ({columns, row, handleRow, toggleEdit}) => {
    return(
        <tr>
            {columns.map(col => 
                <td>
                    <Column noLabel={true} col={col} value={row} setValue={handleRow} />
                </td>
            )}    
            <td colSpan={3}>
            <IconButton onClick={toggleEdit}>
                <SaveIcon />
            </IconButton>
            </td>
        </tr>
    )    
 }

 const _EditRowVertical = ({columns, row, handleRow, toggleEdit}) => {
    return(
        <div class='column is-half'>
            <table>
            <tbody>
                {columns.map(col => 
                    <tr>
                        <Tooltip title={col.tooltip}>
                        <th>
                            <LabelWithSup col={col} />
                        </th> 
                        </Tooltip>
                        <td>

                        <Column noLabel={true} col={col} value={row} setValue={handleRow} />
                        </td>
                    </tr>
                )}    

                <tr colSpan={2}>
                <IconButton onClick={toggleEdit}>
                    <SaveIcon />
                </IconButton>
                </tr>
            </tbody>
        </table>
        </div>
    )    
 }



 const _ViewRow = ({columns, row, toggleEdit, copyRow, deleteRow}) => 
    <tr>
        {columns.map(col=>
            <td style={{maxWidth:80}}>{row[col.name]}</td>
        )}
        <td>
            <Tooltip title={'Edit the row'}>
                <IconButton onClick={toggleEdit}>
                    <EditIcon />
                </IconButton>
            </Tooltip>
        </td>
        {copyRow?
            <td>
                <Tooltip title={'Copy the row. NOTE: The new copy of the row is not saved to the database until you have modified its Shortname and saved it'}>
                    <IconButton onClick={copyRow}>
                        <CopyIcon />
                    </IconButton>
                </Tooltip>
            </td>
        :
            <td />
        }
        {deleteRow?
            <td>
                <Tooltip title={'Delete the row'}>
                    <IconButton onClick={deleteRow}>
                        <DeleteIcon />
                    </IconButton >
                </Tooltip>
            </td>
        :
            <td/>
        }
    </tr>

const _EditTable = ({columns, list, setList, ignoreAdd, verticalEdit, triggerUpdate, triggerDelete}) => {
    const [edit, setEdit] = useState([])
    const copyRow = row => {
        const random = Math.floor(100000 + Math.random() * 900000)
        setList([...list, {...row, id:undefined}])
    }
    const deleteRow = index => {
        setList(list.filter((it, idx)=> idx !==index))
        triggerDelete(list[index].id)
    }    

    const toggleEdit = index => {
        if (edit.includes(index)) {
            setEdit(edit.filter(it=>it !== index))
            triggerUpdate()
        } else {
            setEdit([...edit, index])
        }   
    }    

    const addRow = row => {
        setList([...list, row])
        triggerUpdate()
    }

    const handleRow = (row, index) => {
        setList(list.map((it, idx)=>index===idx?row:it))
    }    

    return(
            <table>
                <thead>
                        <tr>
                            {columns.map(col=>
                                <Tooltip title={col.tooltip}>
                                    <th>
                                        <LabelWithSup col={col} />
                                    </th>
                                </Tooltip>    
                            )}    

                            <th colSpan={3} />
                        </tr>
                </thead>
                <tbody>
                {list.map((row, index)=>
                    edit.includes(index)?
                        <>
                            {verticalEdit?
                                <_EditRowVertical 
                                    columns={columns} 
                                    row={list[index]} 
                                    handleRow={row=>handleRow(row, index)} 
                                    toggleEdit={()=>toggleEdit(index)} 
                                />    
                            :   
                                <_EditRowHorizontal 
                                    columns={columns} 
                                    row={list[index]} 
                                    handleRow={row=>handleRow(row, index)} 
                                    toggleEdit={()=>toggleEdit(index)} 
                                />
                            }    
                        </>
                    :    
                        <_ViewRow 
                            columns = {columns}
                            row={row} toggleEdit={()=>toggleEdit(index)} 
                            copyRow={()=>copyRow(row)} 
                            deleteRow={()=>deleteRow(index)}
                        />
                )}
                {(list.length !== 0 && ignoreAdd)?null:<_AddRow columns={columns} addRow={addRow} noLabel={true} />}
                </tbody>
            </table>
    )
}


// EditTableWithSelect 
export default ({columns, list, setList, ignoreAdd, verticalEdit, triggerUpdate, triggerDelete, statusColor}) => {
    return(
        <div style={{overflowX:'auto'}}>
            <_EditTable
                columns={columns} 
                list={list}
                setList={setList}
                ignoreAdd={ignoreAdd}
                verticalEdit={verticalEdit}
                triggerUpdate={triggerUpdate}
                triggerDelete={triggerDelete}
                statusColor={statusColor} 
            />
        </div>        
    )
}
