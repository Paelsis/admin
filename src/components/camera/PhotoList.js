import React, {useState, useEffect} from 'react'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import SaveIcon from '@mui/icons-material/Save';
import Rotate90DegIcon from '@mui/icons-material/RotateRight'
import Button, { buttonClasses } from '@mui/material/Button';
import {serverFetchData} from '../../services/serverFetch'
import {serverPost} from '../../services/serverPost'
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL

// PhotoList
const Func = props => {
        const {subdir, list, setList, matching} = props; // If matching is among calling parameters, then only files matching this string is is shown

        const handleReplyFetchData = reply => {
                const data = reply.data?reply.data:reply
                if (data.status === 'OK') {
                    if (matching) {
                        const newlist = data.result.filter(it=>it.fname.includes(matching) && !it.fname.includes('_thumb'))
                        /* alert('Fetch of'  + newlist.length + ' rows successful') */
                        setList(newlist)
                    } else {
                        /* alert('Fetch of'  + data.result.length + ' rows successful') */
                        setList(data.result)
                    }        
                } else {
                    alert('ERROR PhotoList:' +  JSON.stringify(data)) 
                }        
        }        


        useEffect(()=>{
                // Fetch the list of images from subdir in sorted order with latest mdate put first
                const irl='/listData?subdir=' + (subdir?subdir:'/images/other')
                /* setList([]) */
                serverFetchData(irl, handleReplyFetchData)
        },[subdir])

        const handleReply = reply =>{
                const data = reply.data?reply.data:reply
                if (data.status==='OK') {
                        if (data?data.list:false) {
                                setList(data.list)
                        }        
                        // alert('Delete successful')
                } else {
                        alert('Delete/Rotate failed. Message, status:' + reply.status + ' message:' + (reply.message?reply.message:'No message'))     
                }
        }
    

        const handleDelete = index => {
                const newList = list.map((it,idx)=>{
                        if (idx === index) {
                                return({...it, delete:it.delete?false:true})
                        } else {
                                return it
                        }
                })        
                const url = apiBaseUrl + '/removeOrRotateImages'
                const files = newList
                serverPost(url, {subdir, files}, handleReply)

        }

        const handleRotate = index => {
                const newList = list.map((it, idx)=>{
                        if (idx === index) {
                                return({...it, rotate:(it.rotate && it.rotate !== 360)?it.rotate+90:90})
                        } else {
                                return it
                        }
                })        
                const url = apiBaseUrl + '/removeOrRotateImages'
                const files = newList
                serverPost(url, {subdir, files}, handleReply)
        }

        const path = apiBaseUrl + (subdir?('/'+subdir+'/'):'/') 
        return (
                <div>
                        <div className="columns is-centered is-flex-wrap-wrap">
                                {list?list.map((li, idx) =>
                                        <div key={idx} className='column is-narrow is-2'>
                                                <img src={path + li.fname} style={{transform:li.rotate?"rotate(" + li.rotate + "deg)":undefined}} alt={path + li.fname} />
                                                <p/>
                                                <small>{path + li.fname}</small>   
                                                {li.delete?
                                                        <DeleteForeverIcon style={{color:'orange', fontSize:18}} onClick={()=>handleDelete(idx)} />     
                                                :        
                                                        <DeleteIcon style={{fontSize:16, opacity:0.3}} onClick={()=>handleDelete(idx)} />     
                                                }        
                                        </div>        
                                ):null}
                        </div>
                </div>

        )
}

export default Func

