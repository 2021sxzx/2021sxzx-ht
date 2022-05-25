import * as echarts from 'echarts';
import React, { useEffect, useState } from "react";
import {Divider} from "antd";
// var chartDom = document.getElementById('zyk');
// var myChart = echarts.init(chartDom);
const UsersChart = (props) => {
    React.useEffect(()=>{
    })
    return (
        <div style={{
          width: "250px",
          height: "170px",
          display: "inline-block",
        }}>
          <div style={{width:"100%",height:"100%"}}>
              <div style={{fontSize:'12px', fontWeight:'normal'}}>今日用户活跃数</div>
              <div style={{fontSize:'40px', fontWeight:'bolder',color:'#6e7079'}}>126</div>
              <div style={{marginTop:'22px'}}>
                  <div style={{display:"inline-block",marginRight:"12px"}}>&nbsp;&nbsp;&nbsp;周同比&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+12%</div>
                  <div style={{display:"inline-block"}}>日环比&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-10%</div>
              </div>
          </div>
          <Divider style={{marginTop:"-42px",marginBottom:"0px"}}/>
          <div>
            <p3 style={{marginLeft:"12px",marginRight:"20px"}}>日均用户活跃数</p3>140
          </div>
        </div>
    );
}
// option && myChart.setOption(option);
export default UsersChart