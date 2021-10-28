import React from 'react'
import { Input, Space } from 'antd';
import SearchBar from './components/SearchBar.js'
import Charts from './components/Charts.js'
export default function CommentManageReport() {

  return (
    <div>
      <SearchBar></SearchBar>
      <Charts></Charts>
    </div>
  )
}
