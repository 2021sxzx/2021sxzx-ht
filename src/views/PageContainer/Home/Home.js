import React from 'react'
import {Button} from 'antd'
import UploadButton from "./uploadButton/UploadButton";

export default function Home() {
    const showFileInfo=(file,fileList)=>{
        console.log('showFileInfo',file,'fileList',fileList)
    }
    return (
        <div>
            <Button>button</Button>
            <UploadButton accept={'.csv, .xlsx'} handleFileInfo={showFileInfo} maxFileNum={1}>上传按钮</UploadButton>
        </div>
    )
}
