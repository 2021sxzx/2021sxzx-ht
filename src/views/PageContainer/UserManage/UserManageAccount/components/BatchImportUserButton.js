import {
  Button
} from 'antd';
import React, { useState, useEffect } from 'react';

let cssObject = {
  // display: 'none'
  CompreFileStyle: {
    display: 'inline-block',
    background: '#D0EEFF',
    border: '1px solid #99D3F5',
    borderRadius: '4px',
    padding: '4px 12px',
    overflow: 'hidden',
    color: '#1E88C7',
    textDecoration: 'none',
    textIndent: 0,
    lineHeight: '20px',
    // zIndex: 1
  },
  inputStyle: {
    // position: 'absolute',
    // right: 0,
    // top: 0,
    opacity: 0,
    zIndex: -1
  }
}

const BatchImportUserButton = () => {

  const myEvent = new Event("myCustomEvent");
  let myRoot = document.getElementById('myRoot');
  let files = document.getElementById('files');

  useEffect(() => {
    myRoot.addEventListener('myCustomEvent', e => {
      console.log(e);
    })
  }, []);

  return (
    <div style={cssObject.CompreFileStyle} id={'myRoot'}>
      点击上传文件
      <input type="file" id={"files"} style={cssObject.inputStyle} multiple={"multiple"} onClick={() => {
      }}/>
    </div>
  )
}

export default BatchImportUserButton;