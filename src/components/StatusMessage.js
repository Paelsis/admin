import React, { useState, useEffect } from 'react';
import { STATUS_STYLE } from '../services/constant';

const STATIC_STYLE = {
  position:'fixed', 
  bottom:0, 
  left:0, 
  height:30, 
  width:'100vw', 
  padding:5, 
  textAlign:'center', 
  color:'white', 
  backgroundColor:'green'
} 

export default ({timeout, status}) => {
    const [msg, setMsg]=useState(undefined)    
    useEffect(() => {
        setMsg(status.message)
        const timer = setTimeout(() => {
          setMsg(undefined);
        }, timeout?timeout:2000);
        return () => clearTimeout(timer);
    }, [status.message]); 
    const myStyle = status.style?status.style:STATUS_STYLE.DEFAULT
    return (
      msg?<div style={{...STATIC_STYLE, ...myStyle}}>{msg}</div>:null
    );
};

