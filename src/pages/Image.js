import {useState} from 'react'
import {AddPhotoSingle} from '../components/camera/AddPhoto'
import PhotoList from '../components/camera/PhotoList'

const ViewList = list =>
<ul style={{listStyleType:'none'}}>
    {list?list.map(it=>
    <li>{JSON.stringify(it.fname)}</li>    
    ):null}
</ul>


export default () => {
    const [list, setList] = useState()
    return (
        <>
            <AddPhotoSingle subdir='/images' list={list} setList={setList} />
            <PhotoList subdir='/images' list={list} setList={setList} />
        </>
    )
}
