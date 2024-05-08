const RenderChecklist = ({list, setList}) => {
    const handleChange = (index, name, checked) => {
        setList(list.map((it, idx) => {
            if (index === idx) {
                return {...it, checked} 
            } else {
                return it
            }
    }))
    }
    return(
        <>
            {list.map((pk, index)=>
                <>
                <label>
                    <input type={pk.type} checked={pk.checked?true:false} name={pk.name} onChange = {e=>handleChange(index, e.target.name, e.target.checked)}/>
                &nbsp;
                {pk.name}
                </label>
                <br/>
                </>
            )}
        </>
    )
}

export default RenderChecklist
