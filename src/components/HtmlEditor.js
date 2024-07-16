import React, {useEffect, useState} from 'react';
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save'
import { IconButton} from '@mui/material';


const HTMLEditor = props => {
    const {value, setValue, style} = props
    const handleChange = e => setValue(e.target.value)
  
    return (
            <div>
                <textarea 
                    style={style}
                    name={'value'} 
                    cols={100} 
                    rows={25}
                    value={value} 
                    maxLength={50000}
                    onChange={handleChange}
                />
            </div>
    );
  }
  

export default HTMLEditor

