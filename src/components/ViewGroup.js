import {useState, useEffect} from 'react'

import ViewTable from "./ViewTable"
const styleDefault = {width:'30%', textAlign:'center', color:'yellow', margin:'auto'}

// ViewGroup - groupBy is the column in the list that shall be grouped
const ViewGroup = ({groupBy, cols, list}) => {
    const groups = Object.groupBy(list, it=>(it[groupBy]))
    return (
        cols?
            Object.keys(groups).map(key=>
                <div>
                    <h1>{key}</h1>
                    {groups[key]?<ViewTable cols={cols} list={groups[key]} />:null}
                </div>
            )
        :null    
    )
}

export const ViewGroupWithoutClick = ({depth, groupByArr, cols, list}) => {
    const [open, setOpen] = useState()
    const continueRecursion = (depth < groupByArr.length)
    const groupBy = continueRecursion?groupByArr[depth].groupBy:undefined
    const groups = continueRecursion?Object.groupBy(list, it=>(it[groupBy])):undefined
    const style =  groups?groupByArr[depth].style?groupByArr[depth].style:styleDefault:styleDefault
    const handleClick = key => setOpen(open?undefined:key)


    return (
        cols?groups?
            Object.keys(groups).map(key=>
                <div>
                    <div style={style}>{key}</div>
                    {groups[key]?<ViewTable cols={cols} list={groups[key]} handleClick={handleClick} />:null}
                    {continueRecursion?<ViewGroupRecursive depth={depth+1} groupByArr={groupByArr} cols={cols} list={groups[key]} />:null}
                </div>
            )
        :null:null    
    )
}

export const ViewGroupRecursive = ({depth, groupByArr, cols, list, buttons}) => {
    const [open, setOpen] = useState()
    const recursionReady = (depth === groupByArr.length) 
    const groupBy = !recursionReady?groupByArr[depth].groupBy:undefined
    const groups = !recursionReady?Object.groupBy(list, it=>(it[groupBy])):undefined
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
                            {!recursionReady?<ViewGroupRecursive depth={depth+1} groupByArr={groupByArr} cols={cols} list={groups[key]} buttons={buttons}/>:null}
                        </>
                    :null:null}
                </div>
            )
        :null:null    
    )
}

export default ViewGroup


