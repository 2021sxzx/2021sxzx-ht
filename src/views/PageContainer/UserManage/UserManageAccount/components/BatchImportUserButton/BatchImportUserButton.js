import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './BatchImportUserButton.css';

const BatchImportUserButton = () => {

  const [xlsxData, setXlsxData] = useState([]);

  useEffect(() => {
    console.log('xlsxData', xlsxData);
  }, [xlsxData]);

  const getXlsxData = (e) => {
    // 读取excel文件并写入到数组中
    const files = e.target.files
    if(files.length <= 0){
      return false;
    } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())){
      alert('文件传格式不正确')
      return false
    }
    const fileReader = new FileReader();
    // 监听
    fileReader.onload = (ev) => {
      try {
        const data = ev.target.result;
        const workbook = XLSX.read(data, {
          type: 'binary'
        })
        const wsname = workbook.SheetNames[0]//取第一张表
        const res = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]).map(item => {
          return {
            user_name: item['用户名'],
            role_name: item["业务员"],
            account: item["账户"],
            password: item["密码"],
            activation_status: 1,
            department_name: item["处室名称"]
          }
        })
        setXlsxData(res);
      } catch (e) {
        console.log(e);
        return false
      }
    }
    fileReader.readAsBinaryString(files[0]);
  }

  return (
    <a href="" className="file">
        批量导入用户
        <input type="file" name="" id="" onChange={getXlsxData}/>
    </a>
  );
}

export default BatchImportUserButton;