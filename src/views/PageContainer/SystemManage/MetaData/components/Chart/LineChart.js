import * as echarts from "echarts";
import {useEffect} from "react";
import api from "../../../../../../api/systemMetadata";

const LineChart = (props) => {
    const map = {
        daily_item_read: '今日事项浏览数',
        total_item_read: '累计事项浏览数',
        item_num: '已有事项数量',
        user_num: '已注册用户数量'
    }  //标题映射关系
    useEffect(() => {
        const chartDom = document.getElementById(props.type + '_chart')
        const myChart = echarts.init(chartDom)
        api.GetChartData(props.type).then((response) => {
            let data = response.data.data;
            myChart.setOption({
                title: {
                    left: "left",
                    text: map[props.type],
                    subtext: '' + data[data.length - 1][props.type], //转换为字符串否则数值为0时不显示
                    textStyle: {
                        fontSize: "12px",
                        fontWeight: "normal",
                    },
                    subtextStyle: {
                        fontSize: "20px",
                        fontWeight: "bolder",
                    },
                },
                dataset: {
                    dimensions: ["date", props.type],
                    source: data,
                },
                tooltip: {
                    trigger: "axis",
                    position(pt) {
                        return [pt[0], "10%"];
                    },
                },
                xAxis: {
                    type: "time",
                    boundaryGap: false,
                    axisPointer: {
                        label: {
                            // 只显示日期不显示具体时间
                            formatter: function (params) {
                                return new Date(params.value).toLocaleDateString()
                            }
                        }
                    }
                },
                yAxis: {
                    boundaryGap: [0, "100%"],
                    show: false,
                    min: (props.type === 'total_item_read') ? Math.min(data.map((val)=>val[props.type])) : 0
                },
                series: [
                    {
                        type: "line",
                        smooth: true,
                        areaStyle: {}
                    },
                ],
            });
        });
    }, []);

    return (
        <div
            style={{
                width: "250px",
                height: "170px",
                display: "inline-block",
            }}
        >
            <div id={props.type + '_chart'} style={{width: "100%", height: "100%"}}/>
        </div>
    );
};
export default LineChart;
