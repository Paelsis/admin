import React, { useState } from 'react';
import {AddPhotoSingle} from './AddPhoto';
import PhotoList from './PhotoList';

// Camera
export default props => {
        const [list, setList] = useState([])
        return(
                <div style = {{marginLeft:'auto', marginRight:'auto', marginTop:50}}>
                        <div >
                            <AddPhotoSingle {...props} list={list} setList={setList} />
                        </div>
                        <div>
                            <PhotoList {...props} list={list} setList={setList} />
                        </div>
                </div>
        )
}
      