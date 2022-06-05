import React, {useState} from 'react'
import api from '../../../../api/comment'
import { Input, Select } from 'antd'
const { Option } = Select
const { Search } = Input


export default function SearchBar(props) {
	const [type,setType]=useState(0)
	const typeList=['全部', '事项指南名称', '事项指南编码']
	const handleChangeType=(value)=>{
		console.log('changeType=',value)
		setType(value)
	}
	const selectBefore = (
		<Select
			defaultValue='全部'
			className='select-before'
			style={{ width: 150 }}
			onChange={handleChangeType}
		>
			{typeList.map((item, index) => {
				return (
					<Option value={index} key={index}>
						{item}
					</Option>
				)
			})}
		</Select>
	)
	const onSearch = async (value) => {
		let res=await api.getCommentParams({
			type,
			typeData:value
		})
		props.setChartData(res)
	}

	return (
		<div>
			<Search
				addonBefore={selectBefore}
				placeholder='input search text'
				onSearch={onSearch}
				enterButton
				style={{ width: 600, height: 100, marginLeft: 20, marginTop: 20 }}
			/>
		</div>
	)
}
