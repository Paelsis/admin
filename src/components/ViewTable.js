import {isNormalVariable} from '../services/functions'

const styles = {
    container:{
        /*
        overflow:'auto',
        marginLeft:'auto',
        marginRight:'auto',
        */
    },
    th:{
        padding:4,
    },
    td:{
        padding:4
    }
}


export default ({cols, list, buttons}) => {
    const colons = cols?cols:list.length > 0?Object.keys(list[0]).filter(key=>isNormalVariable(list[0][key])):[]
    return(
    list?    
    <div className='container'>
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
                {list.map(li=>
                    <tr>
                        {colons.map(col=>
                            <td style={styles.td}>{(typeof li[col] == "boolean")?(li[col]?'true':'false'):li[col]}</td>
                        )}    
                        {buttons?buttons.map(button =>
                            <td style={styles.td}>
                                <button onClick={()=>button.onClick(li)}>{button.label?button.label:'Button'}</button>
                            </td>
                        ):null}
                    </tr>
                )}
            </tbody>
        </table>
    </div>
    :<h1>No list</h1>
    )
}
