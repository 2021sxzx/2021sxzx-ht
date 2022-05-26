import * as echarts from 'echarts';
import React, { useEffect, useState } from "react";
import {Divider} from "antd";
import api from "../../../../api/log";
// var chartDom = document.getElementById('zyk');
// var myChart = echarts.init(chartDom);
var option;
const getDay=(day)=> {
    var today = new Date()
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
    today.setTime(targetday_milliseconds) // 注意，这行是关键代码
    var tYear = today.getFullYear()
    var tMonth = today.getMonth()
    var tDate = today.getDate()
    tMonth = doHandleMonth(tMonth + 1)
    tDate = doHandleMonth(tDate)
    // console.log(`${tYear}/${tMonth}/${tDate}`);
    return `${tYear}/${tMonth}/${tDate}`
}
// 获取近15天日期方法
const chart2=() =>{
    var xdata = []
    for (var i = 0; i < 15; i++) {
        xdata[i] = getDay(-i)
    }
    console.log('this.dateList',xdata)
    return xdata.reverse();
}
function doHandleMonth(month) {
    var m = month
    if (month.toString().length === 1) {
        m = `0${month}`
    }
    return m
}
let base = +new Date();
let oneDay = 24 * 3600 * 1000;
// let data = [[base, Math.random() * 300]];
/*for (let i = 1; i < 20; i++) {
    let now = new Date((base -= oneDay));
    data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
}*/
let data = [];
let dateList = chart2();
for (let i = 0; i < 15; i++) {
    let now = dateList[i]
    data.push([now, Math.round((Math.random() - 0.5) * 20)]);
    // data.push([now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
}
console.log("data:",data)
// console.log(data)
/* option = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'left',
        text:"今日事项浏览次数",
        subtext:"8486",
        textStyle:{
            fontSize:'12px',
            fontWeight:'normal'
        },
        subtextStyle: {
            fontSize: '20px',
            fontWeight: 'bolder'
        }
    },
    xAxis: {
        type: 'time',
        boundaryGap: false
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        show:false
    },
    series: [
        {
            name: '今日事项浏览次数',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {},
            data: 
        }
    ]
}; */

const LineChart = (props) => {
    const [dat,setDat]=useState(false)
    const getItemBrowseCount = (data,setData)=>{
        api
            .ItemBrowseCount(data)
            .then((response) => {
                setDat(response.data);
                console.log("ItemBrowseCount.data=", response.data);
            })
            .catch((error) => {});
        // return dat;
    }
    React.useEffect(()=>{
        var chartDom = document.getElementById(props.id);
        var myChart = echarts.init(chartDom);
        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                left: 'left',
                text:"今日事项浏览次数",
                subtext:"8486",
                textStyle:{
                    fontSize:'12px',
                    fontWeight:'normal'
                },
                subtextStyle: {
                    fontSize: '20px',
                    fontWeight: 'bolder'
                }
            },
            xAxis: {
                type: 'time',
                boundaryGap: false
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                show:false
            },
            series: [
                {
                    name: '今日事项浏览次数',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    areaStyle: {},
                    data: props.data
                }
            ]
        });
        // getItemBrowseCount();
    },[])
    return (
/*        <div id={props.id} style={{
            width: "250px",
            height: "170px",
            paddingLeft: "10px",
            display: "inline-block",
            float: "left"
        }}/>*/
    <div style={{
        width: "250px",
        height: "170px",
        display: "inline-block",
    }}>
        <div id={props.id} style={{width:"100%",height:"100%"}}/>
        <Divider style={{marginTop:"-42px",marginBottom:"0px"}}/>
        <div>
            <p3 style={{marginLeft:"12px",marginRight:"20px"}}>日访问量</p3>14512
        </div>
    </div>
    );
}
export default LineChart