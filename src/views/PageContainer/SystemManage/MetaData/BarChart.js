import * as echarts from 'echarts';
import React, { useEffect, useState } from "react";
import {Divider} from "antd";
import apiLog from "../../../../api/log";
import api from "../../../../api/log";
// var chartDom = document.getElementById('zyk');
// var myChart = echarts.init(chartDom);
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
    // console.log('this.dateList',xdata)
    return xdata.reverse();
}
function doHandleMonth(month) {
    var m = month
    if (month.toString().length === 1) {
        m = `0${month}`
    }
    return m
}

const getLog = (data,setData)=>{
    let dat=[120,50,47];
    // return dat;
    apiLog
        .MetaDataLog(data)
        .then((response) => {
            setData(response.data);
            dat=response.data;
            return dat;
            // console.log("response.data.data=", response.data);
        })
        .catch((error) => {});
    // return dat;
}
var option = {
    title: {
        text:"日志记录",
        subtext:"5000",
        textStyle:{
            fontSize:'12px',
            fontWeight:'normal'
        },
        subtextStyle: {
            fontSize: '20px',
            fontWeight: 'bolder'
        }
    },
    tooltip: {
        trigger: 'item',
        position: function (pt) {
            // return [pt[0], '10%','top'];
            return 'top'
        }
    },
    xAxis: {
        type: 'category',
        // data: chart2()
    },
    yAxis: {
        type: 'value',
        show: false
    },
    series: [
        {
            // data: api.MetaDataLog(),
            data: getLog(),
            // data: [120, 200, 150, 80, 70, 110, 130,120, 200, 150, 80, 70, 110, 130,140],
            type: 'bar'
        }
    ]
};

/*var dat='';
apiLog
    .MetaDataLog(dat)
    .then((response) => {
        dat = response.data;
        console.log('dat', dat);
    })
    .catch((error) => {});*/
const BarChart = (props) => {
    const [data, setData] = useState([]);
    // getLog(data, setData);
    option = {
        title: {
            text:"日志记录",
            subtext:"5000",
            textStyle:{
                fontSize:'12px',
                fontWeight:'normal'
            },
            subtextStyle: {
                fontSize: '20px',
                fontWeight: 'bolder'
            }
        },
        tooltip: {
            trigger: 'item',
            position: function (pt) {
                // return [pt[0], '10%','top'];
                return 'top'
            }
        },
        xAxis: {
            type: 'category',
            // data: chart2()
        },
        yAxis: {
            type: 'value',
            show: false
        },
        series: [
            {
                // data: api.MetaDataLog(),
                data: getLog(),
                // data: [120, 200, 150, 80, 70, 110, 130,120, 200, 150, 80, 70, 110, 130,140],
                type: 'bar'
            }
        ]
    };

    React.useEffect(()=>{
        var chartDom = document.getElementById(props.id);
        var myChart = echarts.init(chartDom);
        myChart.setOption({
            title: {
                text:"日志记录",
                subtext:"5000",
                textStyle:{
                    fontSize:'12px',
                    fontWeight:'normal'
                },
                subtextStyle: {
                    fontSize: '20px',
                    fontWeight: 'bolder'
                }
            },
            tooltip: {
                trigger: 'item',
                position: function (pt) {
                    // return [pt[0], '10%','top'];
                    return 'top'
                }
            },
            xAxis: {
                type: 'category',
                // data: chart2()
            },
            yAxis: {
                type: 'value',
                show: false
            },
            series: [
                {
                    // data: api.MetaDataLog(),
                    // data: getLog(),
                    // data: [120, 200, 150, 80, 70, 110, 130,120, 200, 150, 80, 70, 110, 130,140],
                    type: 'bar'
                }
            ]
        });
        // getLog(data,setData);
    },[])
    return (
        <div style={{
            width: "250px",
            height: "170px",
            // paddingLeft: "10px",
            display: "inline-block",

            // float: "left"
        }}>
            <div id={props.id} style={{width:"100%",height:"100%"}}/>
            <Divider style={{marginTop:"-42px",marginBottom:"0px"}}/>
            <div>
                <p3 style={{marginLeft:"12px",marginRight:"20px"}}>更改条数</p3>+14
            </div>
        </div>

    );
}
export default BarChart;
