import React, {useEffect, useState} from 'react'
import SearchBar from './components/SearchBar.js'
import Charts from './components/Charts.js'
import api from "../../../api/comment";
export default function CommentManageReport() {
	const [chartData,setChartData]=useState({})
	useEffect(async ()=>{
		let res=await api.getCommentParams(
			{
				type:0
			}
		)
		setChartData(res)
	},[])
	return (
		<div>
			<SearchBar setChartData={setChartData}/>
			<Charts chartData={chartData}/>
		</div>
	)
}
