import {useState, useEffect} from 'react'
const styleDefault = {textAlign:'center', color:'yellow', margin:'auto', width:'100vw'}

export const GroupByFlat = props => {
    const {depth, groupByArr, list, language} = props
    const recursionReady = (depth === groupByArr.length) 

    if (recursionReady) {
        // Just return the view of the table with the remaining list
        return;
    } else {
        // Return recursive view and call make recursive call again until gropuByArr reached depth
        const groupByItem = groupByArr[depth]
        const RenderView = groupByItem.RenderView?groupByItem.RenderView:undefined
        const groupByFunc = groupByItem.groupByFunc?groupByItem.groupByFunc:undefined
        const groups = groupByFunc?Object.groupBy(list, groupByFunc):undefined
        const className = groupByItem.className
        const classNameItem = groupByItem.classNameItem
        return(
            <div className={className}>
            {groups?Object.keys(groups).map(key=>
                <div className={classNameItem}>
                    {RenderView?<RenderView key={key} depth={depth} groupByArr={groupByArr} list={groups[key]} language={language} />:null}    
                    <GroupByFlat depth={depth+1} groupByArr={groupByArr} list={groups[key]} language={language} />
                </div>
            ):<h5 className='title-is-5'>No groups</h5>}
            </div>
        )
    }
}    


export const GroupByRecursive = props => {
    const {depth, groupByArr, list, language} = props
    const [open, setOpen] = useState()
    const recursionReady = (depth === groupByArr.length) 

    if (recursionReady) {
        return;
    } else {
        // Return recursive view and call make recursive call again until gropuByArr reached depth
        const groupByItem = groupByArr[depth]
        const RenderView = groupByItem.RenderView?groupByItem.RenderView:undefined
        const groupByFunc = groupByItem.groupByFunc?groupByItem.groupByFunc:undefined
        const groups = Object.groupBy(list, groupByFunc)
        const className = groupByItem.className
        const handleClick = key => setOpen(open?undefined:key)
        return(
            Object.keys(groups).map(key=>
                <div className={className}>
                    {(!open||open===key)?
                        <div onClick={()=>handleClick(key)}>
                            {RenderView?<RenderView key={key} depth={depth} groupByArr={groupByArr} list={groups[key]} language={language} />:null}    
                        </div>
                    :null}
                    {open?(open===key)?
                        <GroupByRecursive depth={depth+1} groupByArr={groupByArr} list={groups[key]} language={language} />
                    :null:null}
                </div>
            )
        )
    }
}    



export default GroupByRecursive


