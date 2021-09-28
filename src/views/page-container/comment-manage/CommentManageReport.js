import React from 'react'
import { Input, Space } from 'antd';
import style from './CommentManageReport.module.css'
import SearchBar from './components/SearchBar.js'
import Charts from './components/Charts.js'
const { Search } = Input;
export default function CommentManageReport() {

  return (
    <div>
      <SearchBar></SearchBar>
      <Charts></Charts>
    </div>
  )
}
