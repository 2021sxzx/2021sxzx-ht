import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import api from '../../../../api/comment'
import style from './Charts.module.scss'

export default function Charts() {
	const chartsRef = useRef()
	const [data, setData] = useState({})
	useEffect(() => {
		async function getComment() {
			let {
				data: { data }
			} = await api.getCommentParams()
			let scoreInfo = [0, 0, 0, 0, 0]
			data.scoreInfo?.forEach((item) => {
				scoreInfo[parseInt(item.score) - 1] = item.count
			})
			let scoreInfoRemain = scoreInfo.map((item) => {
				return data.totalNum - item
			})
			data.scoreInfo = scoreInfo
			data.scoreInfoRemain = scoreInfoRemain
			let pieInfo = [
				{ name: '差', value: 0 },
				{ name: '中', value: 0 },
				{ name: '好', value: 0 }
			]
			pieInfo[0].value = scoreInfo[0]
			pieInfo[1].value = scoreInfo[1]
			for (let i = 2; i <= 4; i++) {
				pieInfo[2].value += scoreInfo[i]
			}
			data.pieInfo = pieInfo
			data.goodRate = Math.round((pieInfo[2].value / data.totalNum) * 100)
			const option = {
				color: ['#bae7ff', '#69c0ff', '#40a9ff'],
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'none'
					},
					formatter: (params) => {
						return `${params[0].axisValue}<br />
            共计：${params[0].data}<br />
            占比：${
							Math.floor(
								(params[0].data / (params[1].data + params[0].data)) * 100 * 100
							) / 100
						}%`
					}
				},
				xAxis: {
					show: false,
					type: 'value',
					max: data.totalNum
				},
				yAxis: {
					axisTick: { show: false },
					axisLine: { show: false },
					type: 'category',
					data: [
						'1星 | 非常不满意  ',
						'2星 | 不满意\u3000\u3000  ',
						'3星 | 基本满意\u3000  ',
						'4星 | 满意\u3000\u3000\u3000  ',
						'5星 | 非常满意\u3000  '
					]
				},
				grid: [
					{
						show: false,
						containLabel: true,
						top: 50,
						width: '50%',
						right: '0'
					}
				],
				series: [
					{
						name: 'Access From',
						type: 'pie',
						center: [140, 120],
						radius: [0, '80%'],
						width: '40%',

						top: 10,
						data: data.pieInfo,
						colorBy: 'color',
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						},
						labelLine: {
							// 统一设置指示线长度
							normal: {
								length: 15
							}
						}
					},
					{
						data: data.scoreInfo,
						stack: 'bar1',
						type: 'bar',
						barMaxWidth: 15,
						itemStyle: {
							color: '#1890ff'
						}
					},
					{
						data: data.scoreInfoRemain,
						stack: 'bar1',
						type: 'bar',
						itemStyle: {
							color: '#e6f7ff'
						}
					}
				]
			}
			setData(data)
			let myChart = echarts.init(chartsRef.current)
			option && myChart.setOption(option)
		}
		getComment()
	}, [])

	return (
		<div className={style.container}>
			<div className={style.textContainer}>
				<div className={style.textLeft}>好评率:</div>
				<div className={style.textRight}>
					<div className={style.top}>{data.goodRate}%</div>
					<div className={style.bottom}>{data.totalNum}个评分</div>
				</div>
			</div>
			<div ref={chartsRef} style={{ height: 300, width: 600 }}></div>
		</div>
	)
}
