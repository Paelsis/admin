import {useState, useEffect} from 'react'
const styleDefault = {textAlign:'center', margin:2, color:'yellow', margin:'auto', width:'100vw'}

export const GroupByFlat = props => {
    const {depth, groupByArr} = props
    const recursionReady = (depth === groupByArr.length) 

    if (recursionReady) {
        // Just return the view of the table with the remaining list
        return;
    } else {
        // Return recursive view and call make recursive call again until gropuByArr reached depth
        const groupByItem = groupByArr[depth]
        const RenderView = groupByItem.RenderView?groupByItem.RenderView:undefined
        const groupByFunc = groupByItem.groupByFunc?groupByItem.groupByFunc:undefined
        let groups = groupByFunc?Object.groupBy(props.list, groupByFunc):undefined
        let keys = groups?Object.keys(groups):undefined
        const className = groupByItem.className
        const classNameItem = groupByItem.classNameItem
        return(
            <div className={className}>
                {keys?keys.map(key=>
                    <div className={classNameItem}>
                        {RenderView?<RenderView {...props} key={key} list={groups[key]} />:null}    
                        <GroupByFlat {...props} depth={depth+1} list={groups[key]} />
                    </div>
                    )
                :
                    <h5 className='title-is-5'>No groups</h5>
                }
            </div>
        )
    }
}    

// GroupByRecursive
export const GroupByRecursive = props => {
    // Note that handleChange must be defined in top level since it has to replace the full list
    const {depth, groupByArr, list} = props
    const [open, setOpen] = useState()    
    const lastIteration = (depth === groupByArr.length-1) 

    // Return recursive view and call make recursive call again until gropuByArr reached depth
    const groupByItem = groupByArr[depth]
    const className = groupByItem.className
    const RenderView = groupByItem.RenderView
    const groupByFunc = groupByItem.groupByFunc
    const groups = groupByFunc?Object.groupBy(list, groupByFunc):undefined
    const keys = groups?Object.keys(groups):[]

    const handleClick = key => {
        setOpen(open?undefined:key)
    }

    return(
        lastIteration?
            <div style={{margin:'auto', width:'100vw'}}>
                {RenderView?<RenderView {...props} />:null}
            </div>    
        :
            keys.map(key=>
                <div className={className}>
                    {(!open || (open === key))?
                        <div style={{margin:'auto'}} onClick={()=>handleClick(key)}>
                            {RenderView?<RenderView {...props} list={groups[key]} />:null}    
                        </div>
                    :null}
                    {open?(open===key)?
                        <GroupByRecursive {...props} depth={depth+1} list={groups[key]} />
                    :null:null}
                </div>
            )
    )
}    

export default GroupByRecursive


