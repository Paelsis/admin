
import {useState} from 'react'
import {IconButton} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save'
import AddIcon from '@mui/icons-material/Add'
import CopyIcon from '@mui/icons-material/ContentCopy'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { Select } from './Picklist'

const Column = ({noLabel, col, value, setValue}) => {
    const defaultArguments = {
        type:col.type,
        name:col.name,
        placeholder:noLabel?col.name:col.placeholder,
        checked:col.type === 'checkbox'?value[col.name]:undefined,
        value:col.type === 'checkbox'?undefined:(value[col.name]?value[col.name]:''),
        required:col.required,
        radioValues:col.type==='radio'?col.radioValues:undefined,
    } 
    const label = col.label?col.label:'No label'
    const labelStyle = col.labelStyle?col.labelStyle:{}
    const supStyle = col.supStyle?col.supStyle:undefined
    const selectValues = col.selectValues?col.selectValues:['ADAM', 'BERTIL', 'CESAR']

    const handleChange = e => {
        setValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked:e.target.value})
    }    

    return(
        <>
            {noLabel?null:
                <>
                <label style={labelStyle}>
                        {label}&nbsp;{col.required?<sup style={supStyle?supStyle:{}}>*</sup>:null}&nbsp;
                </label>    
                <br />
                </>
            }
        {col.type === 'textarea'?
                <>
                <textarea 
                    {...defaultArguments}
                    cols={col.cols?col.cols:20} 
                    rows={1} 
                    onChange={handleChange}
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
                    />
                </>
            :
            <>
                <input 
                    {...defaultArguments} 
                    onChange={handleChange}
                />

            </>
            }
        </>
    )    
}


const AddRow = ({columns, list, setList}) => {
    const [value, setValue] = useState({})
    return(
        <tr>
            {columns.map(col => 
                <td>
                    <Column col={col} value={value} setValue={setValue} />
                </td>
            )}    
            <td>
            <IconButton>
                <AddIcon onClick={()=>setList([...list, value])} />
            </IconButton>
            </td>
        </tr>    
    )
 }

 const EditRow = ({columns, row, handleRow, toggleEdit}) => {
    return(
        <div class='column is-half'>
            <table>
            <tbody>
                {columns.map(col => 
                    <tr>
                        <th>{col.label}</th>
                        <td>
                        <Column noLabel={true} col={col} value={row} setValue={handleRow} />
                        </td>
                    </tr>
                )}    
                <tr colSpan={2}>
                <IconButton onClick={()=>toggleEdit(-1)}>
                    <CloseIcon/>
                </IconButton>
                </tr>
            </tbody>
        </table>
        </div>
    )    
 }

 const ViewRow = ({columns, row, toggleEdit, copyRow, deleteRow}) => 
    <tr>
    {columns.map(col=>
        <td>{row[col.name]}</td>
    )}
    <td>
        <IconButton onClick={toggleEdit}>
            <EditIcon/>
        </IconButton>
    </td>
    {copyRow?
        <td>
            <IconButton onClick={copyRow}>
                <CopyIcon/>
            </IconButton>
        </td>
    :
        <td />
    }
    {deleteRow?
        <td>
            <IconButton onClick={deleteRow}>
                <DeleteIcon/>
            </IconButton>
        </td>
    :
        <td/>
    }
    </tr>



const ViewTable = ({columns, list, setList, toggleEdit}) => {
    const copyRow = row => {setList([...list, row])}
    const deleteRow = index => setList(list.filter((it, idx)=> idx !==index))
    return(
        list.length > 0?    
            <table>
                <thead>
                    <tr>
                        {columns.map(col=>
                            <th>{col.label}</th>
                        )}    
                        <th colSpan={3} />
                    </tr>
                </thead>
                <tbody>
                {list.map((row, index)=>
                    <ViewRow columns = {columns} row={row} toggleEdit={()=>toggleEdit(index)} copyRow={()=>copyRow(row)} deleteRow={()=>deleteRow(index)} />
                )}
                </tbody>
            </table>
        :null
    )
}

// EditTableWithPicklist 
export default ({columns, list, setList}) => {
    const [editRowIndex, setEditRowIndex] = useState()
    const [add, setAdd] = useState(false)
    const toggleEdit = idx => setEditRowIndex(idx)
    const toggleAdd = () => setAdd(!add)
    const handleRow = row => {
        if (editRowIndex !== undefined) {  
            setList(list.map((it, idx)=>editRowIndex===idx?row:it))
        }    
    }    
    return(
        <>
            {add?
                <AddRow columns = {columns} list={list} setList={lst=>{setList(lst);toggleAdd()}} />
            :
                <IconButton>
                    <AddIcon onClick={toggleAdd} />
                </IconButton>
            }
            {editRowIndex >= 0?
                <EditRow 
                    columns={columns} 
                    row={list[editRowIndex]} 
                    handleRow={handleRow} 
                    toggleEdit={idx=>toggleEdit(idx)} 
                />
            :
                <ViewTable 
                    columns={columns} 
                    list={list}
                    setList={setList}
                    toggleEdit={idx=>toggleEdit(idx)}
                />
            }
        </>        
    )
}
