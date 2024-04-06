export default ({state}) => 
<table>
    <thead>
        <tr>
            <th>Column name</th>
            <th>Column value</th>
        </tr>
    </thead>

    <tbody>
        {Object.entries(state).map(it=>    
            <tr>
                <td>{it[0]}</td>    
                <td>{JSON.stringify(it[1])}</td>    
            </tr>
        )}
    </tbody>
</table>
