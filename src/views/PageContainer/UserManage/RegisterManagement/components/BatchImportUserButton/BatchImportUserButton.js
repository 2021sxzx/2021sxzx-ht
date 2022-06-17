import React, {useState, useEffect} from 'react';
import * as XLSX from 'xlsx';
import './BatchImportUserButton.css';
import api from '../../../../../../api/user'
import {message} from "antd";

const BatchImportUserButton = (props) => {

    const [xlsxData, setXlsxData] = useState([]);
    const initialPassword = props.initialPassword ? props.initialPassword : '11AAaa@@';

    // 用于批量导入的触发
    useEffect(() => {
        console.log('xlsxData', xlsxData);
        if(xlsxData instanceof Array && xlsxData.length>0) {
            api.BatchImportUser(xlsxData).then(() => {
                message.success('批量导入用户成功')
            }).catch(() => {
                message.error('批量导入用户发生错误')
            })
        }
    }, [xlsxData]);

    // 用于清除file文件导致的onChange的不触发问题
    const clearFile = (e) => {
        e.target.value = ''
    }

    const getXlsxData = (e) => {
        // 读取excel文件并写入到数组中
        const files = e.target.files

        if (files.length <= 0) {
            return false;
        } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
            alert('文件传格式不正确')
            return false
        }

        const fileReader = new FileReader();
        // 监听
        fileReader.onload = (ev) => {
            const data = ev.target.result;
            const workbook = XLSX.read(data, {
                type: 'binary'
            });
            const wsname = workbook.SheetNames[0]//取第一张表
            const res = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]).map(item => {
                return {
                    user_name: item['用户名'],
                    role_name: "业务员",
                    account: String(item["系统账号"]),
                    password: initialPassword,
                    activation_status: 1,
                    unit_name: item["单位"]
                }
            });
            setXlsxData(res);
        }
        fileReader.readAsBinaryString(files[0]);
    }

    return (
        <a href="" className="file" style={{
            color: '#FFFFFF',
            fontSize: '',
            margin: '0px',
            width: '90px',
        }}>
            导入用户
            <input type="file" name="" id="" onChange={getXlsxData} onClick={clearFile}/>
        </a>
    );
}

export default BatchImportUserButton;
