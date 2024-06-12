import {useState, useEffect} from 'react'
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {serverFetchData} from '../services/serverFetch' 

export const Info = ({groupId, textId, onClose})  => {
    const [textList, setTextList] = useState()
    useEffect(()=>{ 
        const url = '/fetchRows?tableName=tbl_text'
        serverFetchData(url, data => setTextList(data.result))
    }, [])

    const findText = () => {
        const element = textList.find(it=> (it.groupId===groupId && it.textId === textId))  
        return element?element.textBody?element.textBody:'No info':'No info'
    }    

    return   (
    <Box sx={{ width: '90%', padding:'4vw'}} role="presentation" onClick={onClose}>
        <div dangerouslySetInnerHTML={{__html: textList?findText():null}} />
        
    </Box>
    )
}
  
