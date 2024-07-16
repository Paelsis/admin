import {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import {AddPhotoSingle} from '../components/camera/AddPhoto'
import PhotoList from '../components/camera/PhotoList'

const DEFAULT_SUBDIR='/images/other'

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL

const ViewList = list =>
<ul style={{listStyleType:'none'}}>
    {list?list.map(it=>
    <li>{JSON.stringify(it.fname)}</li>    
    ):null}
</ul>


export default () => {
    const location = useLocation()
    const subdir = location?location.state?location.state.subdir?location.state.subdir:DEFAULT_SUBDIR:DEFAULT_SUBDIR:DEFAULT_SUBDIR
    const [list, setList] = useState()
    return (
        <>
        <h3 style={{margin:'auto'}}>{subdir?apiBaseUrl + subdir:'No path'}</h3>
        <p/>
        <div className="columns">
            <div className="column is-3">
                <AddPhotoSingle subdir={subdir} list={list} setList={setList} />
            </div>

            <div>
                <PhotoList subdir={subdir} list={list} setList={setList} />
            </div>
        </div>
        </>
    )
}
