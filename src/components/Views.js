import { Tooltip, IconButton, Button} from '@mui/material';

const defaultStyle = {
    background:'red',
    color:'yellow',
    width:'20vw'
}

export const ViewBar = props => {
    const {depth, groupByArr, list} = props
    const groupByItem = groupByArr[depth]
    const buttons = groupByItem.buttons?groupByItem.buttons:[]
    const style = groupByItem.style?groupByItem.style:defaultStyle
    const cols = groupByItem.labelFields
    const viewClassName=groupByItem.viewClassName
    return(
        <div className={viewClassName}>
            {cols.map(col=>
                    <span style={{...style}}>
                        {list[0][col]}
                    </span>
            )}
        </div>
    )
}



export const ViewCourses = props => {
    const {depth, groupByArr, list} = props
    const groupByItem = groupByArr[depth]
    const groupBy = groupByItem.groupBy
    const buttons = groupByItem.buttons?groupByItem.buttons:[]
    const style = groupByItem.style?groupByItem.style:defaultStyle
    const cols =groupByItem.labelFields
    const groups = Object.groupBy(list, it=>it[groupBy])
    const keys = Object.keys(groups)            
    return(
        <table style={style}>
            <tbody>
                {keys.map(key=>
                    <tr>
                        {cols.map(col=>
                            <td style={{width:50, margin:2, padding:2}} >{groups[key][0][col]}</td>
                        )}
                        {buttons?buttons.map(but=>
                            <td style={{margin:2, padding:2}}>
                            {but.icon?
                                <IconButton style={{background:'yellow'}} onClick={()=>but.onClick(groups[key][0].productId)}>
                                    {but.icon}
                                </IconButton>    
                            :
                                <Button size='small' variant='outlined' style={{color:'grey', borderColor:'grey'}} onClick={()=>but.onClick(groups[key][0].productId)}>
                                    {but.label?but.label:'No label'}
                               </Button>                            
                            }
                            </td>
                        ):null}    
                    </tr>
                )}
            </tbody>      
        </table>
    )
}

export const ViewCoursesWithAnchor = props => {
    const {depth, groupByArr, list} = props
    const groupByItem = groupByArr[depth]
    const groupBy = groupByItem.groupBy
    const buttons = groupByItem.buttons?groupByItem.buttons:[]
    const anchors = groupByItem.anchors
    const style = groupByItem.style?groupByItem.style:defaultStyle
    const headerFields = groupByItem.headerFields
    const cols = groupByItem.labelFields
    const groups = Object.groupBy(list, it=>it[groupBy])
    const sortFunc = (a,b)=>{
        let ret
        if ((ret = a.sequenceNumber > b.sequenceNumber) !== 0) {
            return ret
        } else if((ret = a.dayOfWeek?b.dayOfWeek:0 - b.dayOfWeek?a.dayOfWeek:0) !==0) {
            return ret
        } else if((ret = a.startTime.localeCompare(b.startTime)) !==0) {
            return ret
        } else {
            return 0
        } 
    }    
    const sortedList = list.sort(sortFunc)
    const colSpan = cols.length + buttons.length    
    return(
        <table style={style}>
            <thead style={{textAlign:'center'}}>
                <tr>
                    <th colSpan={colSpan}>{list[0].nameEN}</th>
                </tr>
                {headerFields?
                    <tr>
                        {headerFields.map(col=><th>{col}</th>)}
                    </tr>    
                :null}           
            </thead>
            <tbody>
                {sortedList.map(li=>
                    <tr>
                        {cols.map(col=>
                            anchors?anchors[col]?
                                <td style={{padding:2}}><a onClick={e=>{e.preventDefault(); alert(li[anchors[col]])}}>{li[col]}</a></td>
                            :
                                <td style={{padding:2}} >{li[col]}</td>
                            :
                                <td style={{padding:2}} >{li[col]}</td>
                            
                        )}
                        {buttons?buttons.map(but=>
                            <td style={{margin:2, padding:2}}>
                            {but.icon?
                                <IconButton style={{background:'yellow'}} onClick={()=>but.onClick(li[0].productId)}>
                                    {but.icon}
                                </IconButton>    
                            :
                                <Button size='small' variant='outlined' style={{color:'grey', borderColor:'grey'}} onClick={()=>but.onClick(li.productId)}>
                                    {but.label?but.label:'No label'}
                               </Button>                            
                            }
                            </td>
                        ):null}    
                    </tr>
                )}
            </tbody>      
        </table>
    )
}
