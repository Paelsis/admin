import React, { useState, useEffect } from 'react';

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

export default ({timeout, style, message}) => {
    const [msg, setMsg]=useState(undefined)    
    useEffect(() => {
        setMsg(message)
        const timer = setTimeout(() => {
          setMsg(undefined);
        }, timeout?timeout:2000);
        return () => clearTimeout(timer);
    }, [message]); 
    const myStyle = style?style:{}
    return (
      msg?<div style={{...STATIC_STYLE, ...myStyle}}>{msg}</div>:null
    );
};

