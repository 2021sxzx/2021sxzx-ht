import React from 'react'
import { Input, Select } from 'antd';
const { Option } = Select;
const { Search } = Input;

export default function SearchBar() {
  const selectBefore = (
    <Select defaultValue="全部" className="select-before" style={{width:100}}>
      <Option value="事项名称">事项名称</Option>
      <Option value="事项编码">事项编码</Option>
    </Select>
  );
  const onSearch = ()=>{

  }

  return (
    <div>
      <Search addonBefore={selectBefore}placeholder="input search text" onSearch={onSearch} enterButton 
      style={{width:600,height:100,marginLeft:20,marginTop:20}}/>
    </div>
  )
}
