import {Upload, Button, message} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import React, {useState} from 'react'
import instance from '../../../../api/http'

// 文件列表格式参考 antd 文档
// const test = [{
//         uid: '-1',
//         name: 'xxx.csv',
//         status: 'done',
//         url: 'http://www.baidu.com/xxx.png',
//     },]
/**
 * 上传文件按钮
 * 1. @property {*[]} defaultValue 文件列表默认值（TODO）
 * 2. @property {function(file [,fileList [,info]])} handleFileInfo 获取上传的文件信息，并自定义处理
 * 3. @property {string} accept = ".xls, .xlsx" 限制上传文件的类型
 * 4. @property {number} maxFileNum = 1 最大的文件列表长度，默认只能同时上传一个文件
 *
 * @return {JSX.Element}
 * @constructor
 */
export default function UploadButton(props) {
    const [fileList, setFileList] = useState([])

    const handleUploadChange = (info) => {
        if (info.fileList) {
            // 限制文件列表长度
            setFileList([...info.fileList].slice(-props.maxFileNum));
        }

        if (info.file.status !== 'uploading') {
            console.log('uploading',info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            // 将文件信息传给父组件使用
            if(props.handleFileInfo){
                props.handleFileInfo(info.file, info.fileList, info)
            }
            // 成功提示
            message.success(`${info.file.name} file uploaded successfully`);
            console.log('done',info.file, info.fileList);
        } else if (info.file.status === 'error') {
            // 失败提示
            message.error(`${info.file.name} file upload failed.`);
            console.log('error',info.file, info.fileList);
        }
    }

    const option = {
        // name: 'file',
        // TODO(zzj): 将接口放到 api 文件夹统一管理
        accept:props.accept?props.accept:".csv, .xlsx",
        action: instance.defaults.baseURL + '/upload',
        method: "post",
        headers: {
            authorization: 'authorization-text',
        },
        // defaultFileList:defaultFileList,
        fileList: fileList,
        onChange: handleUploadChange,
    };

    return (
        <Upload {...option}>
            <Button icon={<UploadOutlined/>}>Upload</Button>
        </Upload>
    )
}

