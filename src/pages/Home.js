import {useState} from 'react'
import { useNavigate }  from 'react-router-dom';
import { useParams } from "react-router-dom";
import Picklist from '../components/Picklist'


const styles = {
    container:  {
        marginTop:50, 
        marginLeft:'auto', 
        marginRight:'auto', 
        textAlign:'center',
        width:'100vw'
    }
}    

export default () => {
    return(
        <div style={styles.container}>
            <h1>Dance Administration</h1>
        </div>
    )
}    
