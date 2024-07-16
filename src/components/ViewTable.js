import {isNormalVariable} from '../services/functions'
import {IconButton, Button, Tooltip} from '@mui/material';

const styles = {
    container:{
        overflow:'auto',
        width:'100vw'
    },
    th:{
        padding:4,
    },
    td:{
        fontSize:'normal',
        padding:20
    }
}

const _Edit = record => 
    <small>
        {JSON.stringify(record)}
    </small>


const _View = ({colons, buttons, list})=>
    <div style={styles.container}>
        <table>
            <thead>
                <tr>
                    {colons.map(col=>
                        <th style={styles.th}>{col}</th>
                    )}
                    {buttons?buttons.map(button =>
                        <th style={styles.th}>
                            {button.label?button.label:'Button'}
                        </th>
                    ):null}
                </tr>
            </thead>
            <tbody>
                {list.map((li, idx)=>
                    <tr>
                        {colons.map(col=>
                            <td style={styles.td}>{(typeof li[col] == "boolean")?(li[col]?'true':'false'):li[col]}</td>
                        )}    
                        {buttons?buttons.map(button =>
                            <>
                                {button.icon?
                                    <td style={styles.td}>
                                        <Tooltip title={button.tooltip}>
                                            <IconButton onClick={()=>button.onClick?button.onClick(idx):null} >
                                                {(typeof button.icon === 'function')?button.icon(idx):button.icon}
                                            </IconButton>    
                                        </Tooltip>    
                                    </td>
                                :   
                                    <td style={styles.td}>
                                        <Tooltip title={button.tooltip}>
                                            <Button onClick={()=>button.onClick?button.onClick(idx):null}>
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
    </div>
    


export default ({cols, edit, list, setList, buttons}) => {
    const colons = cols?cols:list.length > 0?Object.keys(list[0]).filter(key=>isNormalVariable(list[0][key])):[]
    return(
    list?(edit !==undefined)?
        <_Edit record={list[edit]} setList={setList} />
    :
        <>
        <_View list={list} buttons={buttons} colons={colons} />
        </>
    :
        <h1>No list</h1>
    )
}
