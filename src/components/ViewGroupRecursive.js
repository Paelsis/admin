import {useState, useEffect} from 'react'

import ViewTable from "./ViewTable"
const styleDefault = {textAlign:'center', color:'yellow', margin:'auto', width:'100vw'}



export const ViewGroupRecursiveNoClick = ({depth, groupByArr, cols, list, buttons}) => {
    const [open, setOpen] = useState()
    const recursionReady = (depth === groupByArr.length) 
    const groupBy = !recursionReady?groupByArr[depth].groupBy:undefined
    const groups = !recursionReady?Object.groupBy(list, it=>(it[groupBy])):undefined
    const labelFields = !recursionReady?groupByArr[depth].labelFields?groupByArr[depth].labelFields:groupBy:undefined
    const style =  groups?groupByArr[depth].style?groupByArr[depth].style:styleDefault:styleDefault
    const handleClick = key => setOpen(open?undefined:key)

    return (
        cols?groups?
            Object.keys(groups).map(key=>
                <div>
                    {(!open||open===key)?<div style={style} onClick={()=>handleClick(key)}>{key}</div>:null}
                    {open?(open===key)?
                        <>
                            {groups[key]?(depth === groupByArr.length -1)?<ViewTable cols={cols} buttons={buttons} list={groups[key]} />:null:null}
                            {!recursionReady?<ViewGroupRecursiveNoClick depth={depth+1} groupByArr={groupByArr} cols={cols} list={groups[key]} buttons={buttons}/>:null}
                        </>
                    :null:null}
                </div>
            )
        :null:null    
    )
}





export const ViewGroupRecursiveFlat = props => {
    const {depth, groupByArr, list} = props
    const recursionReady = (depth === groupByArr.length) 

    if (recursionReady) {
        // Just return the view of the table with the remaining list
        return;
    } else {
        // Return recursive view and call make recursive call again until gropuByArr reached depth
        const groupByItem = groupByArr[depth]
        const RenderView = groupByItem.RenderView?groupByItem.RenderView:undefined
        const groupBy = groupByItem.groupBy
        const groups = Object.groupBy(list, it=>it[groupBy])
        const className = groupByItem.className
        return(
            Object.keys(groups).map(key=>
                <div className={className}>
                    {RenderView?<RenderView key={key} depth={depth} groupByArr={groupByArr} list={groups[key]} />:null}    
                    <ViewGroupRecursiveFlat depth={depth+1} groupByArr={groupByArr} list={groups[key]} />
                </div>
            )
        )
    }
}    


export const ViewGroupRecursive = props => {
    const {depth, groupByArr, list} = props
    const [open, setOpen] = useState()
    const recursionReady = (depth === groupByArr.length) 

    if (recursionReady) {
        return;
    } else {
        // Return recursive view and call make recursive call again until gropuByArr reached depth
        const groupByItem = groupByArr[depth]
        const RenderView = groupByItem.RenderView?groupByItem.RenderView:undefined
        const groupBy = groupByItem.groupBy
        const groups = Object.groupBy(list, it=>it[groupBy])
        const className = groupByItem.className
        const handleClick = key => setOpen(open?undefined:key)
        return(
            Object.keys(groups).map(key=>
                <div className={className}>
                    {(!open||open===key)?
                        <div onClick={()=>handleClick(key)}>
                            {RenderView?<RenderView key={key} depth={depth} groupByArr={groupByArr} list={groups[key]} />:null}    
                        </div>
                    :null}
                    {open?(open===key)?
                        <ViewGroupRecursive depth={depth+1} groupByArr={groupByArr} list={groups[key]} />
                    :null:null}
                </div>
            )
        )
    }
}    

const RenderHeader = ({firstListItem, groupByItem, style}) => {
    const groupBy = groupByItem.groupBy
    const labelFields = groupByItem.labelFields?groupByItem.labelFields:[groupBy]

    return(
        <div style={style}>
            {labelFields?
                labelFields.map(it=>
                    <span>
                        {firstListItem[it]?firstListItem[it]:groupBy}&nbsp;
                    </span>
                )
            :groupBy}    
        </div>

    )    
}

export const OLDViewGroupRecursive = ({depth, groupByArr, cols, list, buttons}) => {
    const [open, setOpen] = useState()
    const recursionReady = (depth === groupByArr.length) 

    if (recursionReady) {
        // Just return the view of the table with the remaining list
        return(
            <ViewTable cols={cols} buttons={buttons} list={list}  />
        )
    } else {
        // Return recursive view and call make recursive call again until gropuByArr reached depth
        const groupByItem = groupByArr[depth]
        const groupBy = groupByItem.groupBy
        const groups = Object.groupBy(list, it=>it[groupBy])
        const style =  groupByItem.style?groupByItem.style:styleDefault
        const handleClick = key => setOpen(open?undefined:key)
        return(
            Object.keys(groups).map(key=>
                <div>
                    {(!open||open===key)?
                        <div style={style} onClick={()=>handleClick(key)}>
                            {groupByItem?<RenderHeader firstListItem={groups[key][0]} groupByItem={groupByItem} style={style} />:null}
                        </div>
                    :null}
                    {open?(open===key)?
                        <ViewGroupRecursive depth={depth+1} groupByArr={groupByArr} cols={cols} list={groups[key]} buttons={buttons}/>
                    :null:null}
                </div>
            )
        )
    }
}    

export default ViewGroupRecursive


