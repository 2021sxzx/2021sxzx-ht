import * as echarts from 'echarts';
import React, { useEffect, useState } from "react";
const ChartsT = (props) => {
    var used=props.used;
    // used=Math.floor(used * 100) / 100;
    var total=props.total;
    // total=Math.floor(used * 100) / 100;
    var company='';
    var proportion=(used/total);
    var showProportion=Math.floor(proportion * 10000) / 100;
    if(props.id==='CPU'){
      // console.log("proportion:"+proportion)
      showProportion=props.used;
      total=100;
      proportion=(used/total);
    }
    // console.log("proportion:"+proportion)
    var color='';
    if(proportion<=0.2){
      color='blue';
    }else{
      if (0.2<proportion&&proportion<=0.8){
        color='yellow';
      }else{
        color='red';
      }
    }
    switch(props.id){
      case "CPU":company="%";break;
      case "Users":company="人";break;
      case "ServerMemory":company="MB";break;
      default:company="GB";break;
    }
    React.useEffect(() => {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(props.id));
      // 绘制图表
      myChart.setOption({
        // title: {
        //   //标题组件
        //   text: props.name,
        //   left: "52%", //标题的位置 默认是left，其余还有center、right属性
        //   top: "43%",
        //   // position:"center",
        //   textStyle: {
        //     color: "#436EEE",
        //     fontSize: 17,
        //   },
        // },
        tooltip: {
          //提示框组件
          trigger: "item", //触发类型(饼状图片就是用这个)
          formatter: "{a} <br/>{b} : {c} ({d}%)", //提示框浮层内容格式器
        },
        color: [color, "lightgray"], //手动设置每个图例的颜色
        series: [
          //系列列表
          {
            name: props.id+"占用", //系列名称
            type: "pie", //类型 pie表示饼图
            center: ["70%", "50%"], //设置饼的原心坐标 不设置就会默认在中心的位置
            radius: ["50%", "70%"], //饼图的半径,第一项是内半径,第二项是外半径,内半径为0就是真的饼,不是环形
            itemStyle: {
              //图形样式
              normal: {
                //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                label: {
                  //饼图图形上的文本标签
                  show: false, //平常不显示
                },
                labelLine: {
                  //标签的视觉引导线样式
                  show: false, //平常不显示
                },
              },
              emphasis: {
                //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                label: {
                  //饼图图形上的文本标签
                  show: true,
                  position: "center",
                  textStyle: {
                    fontSize: "10",
                    fontWeight: "bold",
                  },
                },
              },
            },
            data: [
              { value: used, name: "已使用" },
              { value: total-used, name: "未使用" }
            ],
          },
        ],
      });
    });
    return (
    <div style={{ border:"1px solid blue",borderRadius:"8px",width: "300px", height: "170px"}}>
    <div id={props.id} style={{ width: "215px", height: "170px",paddingLeft:"10px",display:"inline-block",float:"left" }}></div>
    </div>);
  };

  export default ChartsT
