import {dayName} from "../services/functions"

const styles = {
    table:{
        fontSize:'small'
    },
    tdHeader:{
        fontSize:14,
        fontWeight:700,
    }
    ,
    tdDescription:{
        wordWrap:'break-word',
    }
}

export const ChecklistPackage = ({list, setList, language}) => {
    const handleChange = (id, name, checked) => {
        setList(list.map((it, idx) => {
            if (id === it.id) {
                return {...it, checked} 
            } else {
                return it
            }
    }))
    }
    const sortFunc = (a,b) => {
        let ret = 0
        if (a.startDate && b.startDate && a.startTime && b.startTime) {
            ret = a.startDate.localeCompare(b.startDate)
            if (ret !==0) {
                return ret
            }
            ret = a.startTime.localeCompare(b.startTime)
            if (ret !==0) {
                return ret
            }
            return 0
        } else {
            return 0
        }    
    }
    const groups = Object.groupBy(list, it=>it.name?it.name:true)
    const keys = Object.keys(groups)

    return(
        <table style={styles.table}>
                <tbody >
                {list.sort(sortFunc).map(it=>
                    <>
                    <tr>
                        <td>
                            <input type={it.type} checked={it.checked?true:false} name={it.name} onChange = {e=>handleChange(it.id, e.target.name, e.target.checked)}/>
                        </td>
                        <td colSpan={2}  style={styles.tdHeader}>
                         {it.name} {it.siteId?it.siteId:null}
                        </td> 
                    </tr>
                    {it.description?
                        <tr>
                            <td/>
                            <td colSpan={2} style={styles.tdDescription} >
                                {it.description}
                             </td> 
                        </tr>
                    :null}    
                   </>

                )}
                </tbody>
        </table>
    )
}

export const ChecklistWorkshop = ({list, setList, language}) => {
    const handleChange = (id, name, checked) => {
        setList(list.map((it, idx) => {
            if (id === it.id) {
                return {...it, checked} 
            } else {
                return it
            }
    }))
    }
    const sortFunc = (a,b) => {
        let ret = 0
        if (a.startDate && b.startDate && a.startTime && b.startTime) {
            ret = a.startDate.localeCompare(b.startDate)
            if (ret !==0) {
                return ret
            }
            ret = a.startTime.localeCompare(b.startTime)
            if (ret !==0) {
                return ret
            }
            return 0
        } else {
            return 0
        }    
    }
    const groups = Object.groupBy(list.sort(sortFunc), it=>it.startDate?it.startDate:true)
    const keys = Object.keys(groups)

    return(
        <table style={styles.table}>
            {keys.map(key=>
                <>
                <thead>
                    <tr>
                        <th colSpan={2} style={{color:'white', padding:2}}>{dayName[groups[key][0].dayOfWeek][language]}</th>
                        <th colSpan={1} style={{color:'white', padding:2}}>{key}</th>
                    </tr>
                </thead>
                <tbody>
                {groups[key].sort(sortFunc).map(it=>
                    <>
                    <tr>
                        <td style={styles.tdHeader}>
                            <input type={it.type} checked={it.checked?true:false} name={it.name} onChange = {e=>handleChange(it.id, e.target.name, e.target.checked)}/>
                        </td>
                        <td style={styles.tdHeader}>
                            {it.startTime?it.startTime.substring(0,5):null}
                        </td>
                        <td style={styles.tdHeader}>
                         {it.name}&nbsp;{it.siteId?it.siteId:null}
                        </td> 
                    </tr>
                    {it.description?
                        <tr>
                            <td/>
                            <td colSpan={2} style={styles.tdDescription} >
                                {it.description}
                             </td> 
                        </tr>
                    :null}    
                   </>


                )}
                </tbody>
                </>
            )}
        </table>
    )
}


