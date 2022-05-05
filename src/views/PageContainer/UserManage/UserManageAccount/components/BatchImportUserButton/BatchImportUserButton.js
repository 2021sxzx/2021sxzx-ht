import {
  Button
} from 'antd';
import React, { useState, useEffect } from 'react';
import xlsx from 'xlsx';
import './BatchImportUserButton.css';

const BatchImportUserButton = () => {

  const [xlsxData, setXlsxData] = useState([]);

  useEffect(() => {}, []);

  const getXlsxData = (e) => {
    // 读取excel文件并写入到数组中
    // const files = e.target.files
    // if(files.length <= 0){
    //   return false;
    // } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())){
    //   alert('文件传格式不正确')
    //   return false
    // }
    // const fileReader = new FileReader();
    // fileReader.readAsBinaryString(files[0]);
    // // 监听
    // fileReader.onload = (ev) => {
    //   try {
    //     const data = ev.target.result;
    //     const workbook = xlsx.read(data, {
    //       type: 'binary'
    //     })
    //     const wsname = workbook.SheetNames[0]//取第一张表
    //     setXlsxData(xlsx.utils.sheet_to_json(workbook.Sheets[wsname]))//生成json表格内容
    //     console.log('Json转化结果：', xlsxData)
    //   } catch (e) {
    //     return false
    //   }
    // }
  }

  return (
    <a href="javascript:;" class="file">
        批量导入用户
        <input type="file" name="" id="" onChange={getXlsxData}/>
    </a>
  );
}

export default BatchImportUserButton;