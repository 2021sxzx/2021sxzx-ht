import React, {useEffect, useState} from "react";

import {
    // DatePicker,
    // Space,
    // Form,
    // Input,
    // Button,
    // Select,
    // Table,
    // Modal,
    // Descriptions,
    // Badge,
    // Checkbox,
    // Tooltip,
    // Progress,
    // Slider, Card,
    Row, Col, PageHeader,  Divider
} from "antd";
// import {getYMD, getTimeStamp} from "../../../../utils/TimeStamp";
import api from "../../../../api/systemResource";

// import {CaretDownOutlined} from "@ant-design/icons";
import * as echarts from "echarts";

// var osu = require("node-os-utils")
//
// const Memory = (props) => {
//     React.useEffect(() => {
//         // 基于准备好的dom，初始化echarts实例
//         var myChart = echarts.init(document.getElementById("forms"));
//         // 绘制图表
//         myChart.setOption({
//             title: {
//                 //标题组件
//                 text: "内存使用",
//                 left: "32%", //标题的位置 默认是left，其余还有center、right属性
//                 top: "47%",
//                 textStyle: {
//                     color: "#436EEE",
//                     fontSize: 17,
//                 },
//             },
//             tooltip: {
//                 //提示框组件
//                 trigger: "item", //触发类型(饼状图片就是用这个)
//                 formatter: "{a} <br/>{b} : {c} ({d}%)", //提示框浮层内容格式器
//             },
//             color: ["#48cda6", "#fd87fb", "#11abff", "#ffdf6f"], //手动设置每个图例的颜色
//             legend: {
//                 //图例组件
//                 right: 200, //图例组件离右边的距离
//                 // left:420,
//                 orient: "horizontal", //布局  纵向布局 图例标记居文字的左边 vertical则反之
//                 width: 40, //图行例组件的宽度,默认自适应
//                 x: "right", //图例显示在右边
//                 y: "center", //图例在垂直方向上面显示居中
//                 itemWidth: 10, //图例标记的图形宽度
//                 itemHeight: 10, //图例标记的图形高度
//                 data: ["用户评价信息", "指南数据", "系统日志", "未使用内存"],
//                 textStyle: {
//                     //图例文字的样式
//                     color: "#333", //文字颜色
//                     fontSize: 12, //文字大小
//                 },
//             },
//             series: [
//                 //系列列表
//                 {
//                     name: "内存占用", //系列名称
//                     type: "pie", //类型 pie表示饼图
//                     center: ["40%", "50%"], //设置饼的原心坐标 不设置就会默认在中心的位置
//                     radius: ["50%", "70%"], //饼图的半径,第一项是内半径,第二项是外半径,内半径为0就是真的饼,不是环形
//                     itemStyle: {
//                         //图形样式
//                         normal: {
//                             //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
//                             label: {
//                                 //饼图图形上的文本标签
//                                 show: false, //平常不显示
//                             },
//                             labelLine: {
//                                 //标签的视觉引导线样式
//                                 show: false, //平常不显示
//                             },
//                         },
//                         emphasis: {
//                             //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
//                             label: {
//                                 //饼图图形上的文本标签
//                                 show: true,
//                                 position: "center",
//                                 textStyle: {
//                                     fontSize: "10",
//                                     fontWeight: "bold",
//                                 },
//                             },
//                         },
//                     },
//                     data: [
//                         {value: 40, name: "用户评价信息"},
//                         {value: 17, name: "指南数据"},
//                         {value: 21, name: "系统日志"},
//                         {value: 20, name: "未使用内存"},
//                     ],
//                 },
//             ],
//         });
//     });
//     return <div id="forms" style={{width: "450px", height: "250px"}}></div>;
// };
//
// const StorageSpace = (props) => {
//     var used = 0.9;
//     var unused = 1 - used;
//     var labelTop0 = {
//         //blue
//         normal: {
//             color: "blue",
//             label: {
//                 show: true, //标签是否显示
//                 position: "center", //饼图可选为：'outer'（外部） | 'inner'（内部）/饼图可选为：'outer'（外部） | 'inner'（内部）
//                 formatter: "{b}", //饼图、雷达图、仪表盘、漏斗图: a（系列名称），b（数据项名称），c（数值）, d（饼图：百分比 | 雷达图：指标名称）
//                 textStyle: {
//                     baseline: "bottom",
//                     color: "blue",
//                 },
//             },
//             labelLine: {
//                 show: false,
//             },
//         },
//     };
//     var labelTop1 = {
//         normal: {
//             color: "yellow",
//             label: {
//                 show: true,
//                 position: "center",
//                 formatter: "{b}",
//                 textStyle: {
//                     baseline: "bottom",
//                     color: "yellow",
//                 },
//             },
//             labelLine: {
//                 show: false,
//             },
//         },
//     };
//     var labelTop2 = {
//         normal: {
//             color: "red",
//             label: {
//                 show: false, //标签是否显示
//                 position: "center",
//                 formatter: "{b}",
//                 textStyle: {
//                     baseline: "bottom",
//                     color: "Red",
//                 },
//             },
//             labelLine: {
//                 show: false,
//             },
//         },
//     };
//     //---------------------------------------------------
//     var labelFromatter0 = {
//         normal: {
//             label: {
//                 //函数中会读取 option中 data中数据进行计算
//                 formatter: function (params) {
//                     return (
//                         (used * 100).toFixed(0) + "%"
//                     );
//                 },
//                 textStyle: {
//                     baseline: "top",
//                     color: "blue",
//                 },
//             },
//         },
//     };
//     var labelFromatter1 = {
//         normal: {
//             label: {
//                 formatter: function (params) {
//                     return (
//                         (used * 100).toFixed(0) + "%"
//                     );
//                 },
//                 textStyle: {
//                     baseline: "top",
//                     color: "yellow",
//                 },
//             },
//         },
//     };
//     var labelFromatter2 = {
//         normal: {
//             label: {
//                 formatter: function (params) {
//                     return (
//                         (used * 100).toFixed(0) + "%"
//                     );
//                 },
//                 textStyle: {
//                     baseline: "top",
//                     color: "red",
//                 },
//             },
//         },
//     };
//     var labelBottom = {
//         normal: {
//             color: "#ccc",
//             label: {
//                 formatter: function (params) {
//                     return (
//                         ((1 - used) * 100).toFixed(0) + "%"
//                     );
//                 },
//                 show: true,
//                 position: "center",
//             },
//             labelLine: {
//                 show: false,
//             },
//         },
//         emphasis: {
//             color: "rgba(0,0,0,0)",
//         },
//     };
//     React.useEffect(() => {
//         // 基于准备好的dom，初始化echarts实例
//         var myChart = echarts.init(document.getElementById("forms"));
//         var labelTop = labelTop0;
//         var labelFromatter = labelFromatter0;
//         if (used <= 0.1) {
//             labelTop = labelTop0;
//             labelFromatter = labelFromatter0;
//         } else if (0.8 > used > 0.1) {
//             labelTop = labelTop1;
//             labelFromatter = labelFromatter1;
//         } else {
//             labelFromatter = labelFromatter2;
//             labelTop = labelTop2;
//         }
//         var option = {
//             tooltip: {
//                 show: true,
//             },
//             series: [
//                 {
//                     center: ["50%", "50%"],
//                     type: "pie",
//                     radius: [40, 50],
//                     itemStyle: labelFromatter,//提示标签的颜色
//                     clockWise: true, //是否顺时针
//                     selectedMode: null, //选中模式，默认关闭，可选single，multiple
//                     data: [
//                         {
//                             name: "已使用",
//                             value: used,
//                             itemStyle: labelTop,//已使用进度条的颜色
//                         },
//                         {
//                             name: "未使用",
//                             value: 1 - used,
//                             itemStyle: labelBottom,//未使用进度条的颜色
//                         }
//                     ],
//                 },
//             ],
//         };
//         // 为echarts对象加载数据
//         myChart.setOption(option);
//     });
//     return <div id="forms" style={{width: "450px", height: "250px"}}></div>;
// };
//
// const Bing = (props) => {
//     React.useEffect(() => {
//         var myChart = echarts.init(document.getElementById("forms"));
//         var option = {
//             // 标题组件，包含主标题和副标题
//             title: {
//                 show: true,
//                 text: "执行任务",
//                 x: "center",
//                 textStyle: {
//                     fontSize: "15",
//                     color: "green",
//                     fontWeight: "bold",
//                 },
//             },
//             //  提示框组件
//             tooltip: {
//                 //是否显示提示框组件，包括提示框浮层和 axisPointe
//                 show: false,
//                 // 触发类型: item:数据项触发，axis：坐标轴触发
//                 trigger: "item",
//                 formatter: "{a} <br/>{b}: {c} ({d}%)",
//             },
//             // // 图例
//             // legend: {
//             //     orient: 'vertical',
//             //     x: 'left',
//             //     data:['完成率']
//             // },
//
//             // 系列列表。每个系列通过 type 决定自己的图表类型
//             series: [
//                 {
//                     // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
//                     name: "任务进度",
//                     type: "pie",
//                     // 饼图的半径，数组的第一项是内半径，第二项是外半径
//                     radius: ["50%", "70%"],
//                     // 是否启用防止标签重叠策略，默认开启
//                     avoidLabelOverlap: false,
//                     hoverAnimation: false,
//                     // 标签的视觉引导线样式，在 label 位置 设置为'outside'的时候会显示视觉引导线
//                     labelLine: {
//                         normal: {
//                             show: false,
//                         },
//                     },
//                     data: [
//                         {
//                             // 数据值
//                             value: 20,
//                             // 数据项名称
//                             name: "完成率",
//                             //该数据项是否被选中
//                             selected: false,
//                             // 单个扇区的标签配置
//                             label: {
//                                 normal: {
//                                     // 是显示标签
//                                     show: true,
//                                     position: "center",
//                                     fontSize: 20,
//                                     // 标签内容格式器，支持字符串模板和回调函数两种形式，字符串模板与回调函数返回的字符串均支持用 \n 换行
//                                     formatter: "{b}\n{d}%",
//                                 },
//                             },
//                         },
//                         {
//                             value: 100,
//                             label: {
//                                 normal: {
//                                     show: false,
//                                 },
//                             },
//                         },
//                     ],
//                 },
//             ],
//         };
//         myChart.setOption(option);
//     });
//     return <div id="forms" style={{width: "450px", height: "250px"}}></div>;
// };

const Chart = (props) => {
    const used = props.used;
    // used=Math.floor(used * 100) / 100;
    let total = props.total;
    // total=Math.floor(used * 100) / 100;
    let company;
    let proportion = (used / total);
    let showProportion = Math.floor(proportion * 10000) / 100;
    if (props.id === 'CPU') {
        // console.log("proportion:"+proportion)
        showProportion = props.used;
        total = 100;
        proportion = (used / total);
    }
    // console.log("proportion:"+proportion)
    let color;
    if (proportion <= 0.2) {
        color = 'blue';
    } else {
        if (0.2 < proportion && proportion <= 0.8) {
            color = 'yellow';
        } else {
            color = 'red';
        }
    }
    switch (props.id) {
        case "CPU":
            company = "%";
            break;
        case "Users":
            company = "人";
            break;
        case "ServerMemory":
            company = "MB";
            break;
        default:
            company = "GB";
            break;
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
                    name: props.id + "占用", //系列名称
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
                        {value: used, name: "已使用"},
                        {value: total - used, name: "未使用"}
                    ],
                },
            ],
        });
    });
    return (
        <div style={{border: "1px solid blue", borderRadius: "8px", width: "300px", height: "170px"}}>
            <div style={{display: "inline-block", width: "80px", height: "170px", float: "left"}}>
                <div style={{
                    height: "50px",
                    textAlign: "center",
                    lineHeight: "50px",
                    fontSize: "15px",
                    fontWeight: "bold"
                }}>{props.name}</div>
                <div style={{height: "30px", textAlign: "center", lineHeight: "30px", color: "#92b6d9"}}>占用率</div>
                <div style={{
                    height: "50px",
                    textAlign: "center",
                    lineHeight: "50px",
                    fontSize: "35px",
                    fontWeight: "bold",
                    color: "#1890ff"
                }}>{showProportion}%
                </div>
                <div>{Math.floor(used * 100) / 100}{company}/{Math.floor(total * 100) / 100}{company}</div>
            </div>
            <div id={props.id} style={{
                width: "215px",
                height: "170px",
                paddingLeft: "10px",
                display: "inline-block",
                float: "left"
            }}/>
        </div>);
};

// const Resource = () => {
//     var cpu = osu.cpu;
//     var count = cpu.count() // 8
//
//     cpu.usage().then((cpuPercentage) => {
//         // console.log(cpuPercentage); // 10.38
//     });
//
//     return (<div>
//         <h1>hhh</h1>
//     </div>);
// }

// function getPromise(a, b) {
//     a = b;
//     // console.log("a:" + a + "||b:" + b);
//     return a;
// }

export default function SystemManageResource() {
    const [cpuPercentage, setCpuPercentage] = useState(false);
    const [memory, setMemory] = useState(false);
    const [disk, setDisk] = useState({});
    const [userNum, setUserNum] = useState(0);

    useEffect(() => {
        getCpuPercentage();
        getMemory();
        getDisk();
        getPeopleStatus();
    }, []);

    const getCpuPercentage = () => {
        api.GetCpuPercentage().then(info => {
            setCpuPercentage(info.data.data);
        }).catch();
    };

    const getMemory = () => {
        api.GetMemory().then(info => {
            setMemory(info.data.data);
        }).catch();
    };

    const getPeopleStatus = () => {
        api.GetPeopleStatus().then(res => {
            setUserNum(res.data.data)
        }).catch(() => {
        //    TODO
        });
    };

    const getDisk = () => {
        api.GetDisk().then(info => {
            const calc = {
                used: 0,
                sum: 0,
            };

            function myFunction(item) {
                this.used += Math.floor(item.used / 1024 / 1024 / 1024 * 100) / 100;
                this.sum += Math.floor(item.size / 1024 / 1024 / 1024 * 100) / 100;
                // this.sum+=item.size/1024/1024/1024;
                // console.log(item.used)
            }

            info.data.data.forEach(myFunction, calc)
            setDisk(calc);
        }).catch();
    };



    return (
        <>
            {/* <Memory></Memory> */}
            {/* <StorageSpace></StorageSpace> */}
            {/* <Bing></Bing> */}
            {/* <div>
        <PageHeader title="虚拟机"></PageHeader>
        <Space size={50}>
          {" "}
          <Chart id="CPU" name="CPU" used={1} total={2}></Chart>
          <Chart id="Memory" name="内存" used={0.4} total={16}></Chart>
          <Chart id="StorageSpace" name="存储空间" used={60} total={100}></Chart>
        </Space>
      </div> */}
            <PageHeader title="服务器"/>
            <Row style={{width: '1200px'}}>
                <Col span={8} offset={3}>
                    <Chart id="CPU" name="CPU" used={cpuPercentage} total={2}/>
                </Col>
                <Col span={8} offset={2}>
                    <Chart id="Users" name="用户并发数" used={userNum} total={100}/>
                </Col>
            </Row>
            <Divider/>
            <Row style={{width: '1200px'}}>
                <Col span={8} offset={3}>
                    <Chart id="ServerMemory" name="内存" used={memory.usedMemMb} total={memory.totalMemMb}/>
                </Col>
                <Col span={8} offset={2}>
                    <Chart id="ServerStorageSpace" name="存储空间" used={disk.used} total={disk.sum}/>{" "}
                </Col>
            </Row>
            {/* <Chart id="ServerStorageSpace" name="存储空间" used={30} total={100}></Chart> */}
            {/* <div>
        <PageHeader title="报警阈值"></PageHeader>
        <Slider defaultValue={30} style={{width:"600px",strokeWidth:"40px"}}/>
      </div> */}

            {/* <div>
        <Resource></Resource>
      </div> */}
            {/* <div style={{background:'#ececec',padding:"30px"}}>
    <Card title="Card title" bordered={false} style={{ width: 300 }}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  </div> */}
        </>
    );
}
