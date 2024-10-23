import EditTable from '../components/EditTable'
import { useParams } from "react-router-dom";

export default () => {
    const {tableName} = useParams()
    return(
        <EditTable tableName={tableName} />
    )    
}


