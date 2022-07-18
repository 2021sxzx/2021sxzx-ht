import {Button, DatePicker, Form, Input, message, Select} from 'antd'
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import api from '../../../../../api/log'
import {journalContext} from "../SystemManageJournal";
import React, {useContext} from "react";
import moment from 'moment';

const {RangePicker} = DatePicker
const {Option} = Select

function AdvancedSearch() {
    const {setTableData, setTableLoading} = useContext(journalContext)
    const [form] = Form.useForm()

    // 定义日期格式
    const dateFormat = 'YYYY-MM-DD';

    // 表单初始值
    const initialValues = {
        typeSearch: {
            searchValue: "", //搜索值
            searchType: "账号", //搜索类型，值分别为：账号、操作人、操作描述
        },
        timeRange: [
            moment(),//开始时间，今天
            moment(),//结束时间，今天
        ],
    }

    // 提交表单
    const onFinish = (value) => {
        // 设置表格为 loading 状态
        setTableLoading(true)

        api.AdvancedSearchLog({
            searchValue: value.typeSearch.searchValue, //搜索值，也支持搜索证件号和操作人姓名
            searchType: value.typeSearch.searchType, //搜索类型，值分别为：证件号、操作人、操作描述
            startTime: value.timeRange[0].format(dateFormat), //开始时间
            endTime: value.timeRange[1].format(dateFormat), //结束时间
        }).then((res) => {
            setTableData(res.data.data)
            message.success('搜索成功')
        }).catch(() => {
            message.error('搜索失败，请稍后尝试')
        }).finally(() => {
            // 设置表格为 loading 状态
            setTableLoading(false)
        })
    }

    const handleDownloadCSV = (data) =>{
        const tHeader = "编号,时间,操作描述,操作人,账号";
        const filterVal = [
          "log_id",
          "create_time",
          "content",
          "user_name",
          "idc"
        ];
        // this.list.unshift(Headers)
        const list = data;
        let csvString = tHeader;
        csvString += '\r\n'
        list.map(item => {
          filterVal.map(key => {
            let value = item[key];
            csvString += value + ",";
          });
          csvString += "\r\n";
        });
        console.log(csvString)
        //解决中文乱码
        csvString = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(csvString);
        let link = document.createElement('a');
        link.href = csvString;
        //对下载的文件命名
        link.download = "高级查询导出数据.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const Output = ()=>{
        // console.log(form.getFieldValue('typeSearch'))
        // 设置表格为 loading 状态
        setTableLoading(true)
        //请求如今的数据
        api.AdvancedSearchLog({
            searchValue: form.getFieldValue('typeSearch').searchValue, //搜索值，也支持搜索证件号和操作人姓名
            searchType: form.getFieldValue('typeSearch').searchType, //搜索类型，值分别为：证件号、操作人、操作描述
            startTime: form.getFieldValue('timeRange')[0].format(dateFormat), //开始时间
            endTime: form.getFieldValue('timeRange')[1].format(dateFormat), //结束时间
        }).then((res) => {
            handleDownloadCSV(res.data.data)
            message.success('导出成功')
        }).catch(() => {
            message.error('导出失败，请稍后尝试')
        }).finally(() => {
            // 设置表格为 loading 状态
            setTableLoading(false)
        })
    }

    return (
        <div style={{
            display: 'flex',
            gap: '25px',
        }}>
            <Form
                form={form}
                id={'advancedSearchForm'}
                initialValues={initialValues}
                layout={'inline'}
                onFinish={onFinish}
            >
                <Form.Item
                    // label="日期范围"
                    name={'timeRange'}
                    rules={[
                        {
                            required: true,
                            message: '请选择日期范围',
                        },
                    ]}
                >
                    <RangePicker
                        locale={locale} // 国际化语言
                        format={dateFormat} // 日期格式
                        ranges={{ // 预设日期范围
                            '今天': [moment(), moment()],
                            '最近一周': [moment().startOf('day').subtract(1, 'week'), moment()],
                            '最近两周': [moment().startOf('day').subtract(2, 'weeks'), moment()],
                            '最近一个月': [moment().startOf('day').subtract(1, 'month'), moment()],
                            '最近三个月': [moment().startOf('day').subtract(3, 'month'), moment()],
                            '最近半年': [moment().startOf('day').subtract(6, 'month'), moment()],
                            '最近一年': [moment().startOf('day').subtract(1, 'year'), moment()],
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name={'typeSearch'}
                >
                    <Input.Group compact>
                        <Form.Item
                            name={['typeSearch', 'searchType']}
                            rules={[{required: true, message: '请选择搜索字段'}]}
                        >
                            <Select
                                style={{
                                    width: '100px',
                                }}
                            >
                                <Option value="账号">账号</Option>
                                <Option value="操作人">操作人</Option>
                                <Option value="操作描述">操作描述</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name={['typeSearch', 'searchValue']}
                            rules={[
                                // {required: true, message: '请输入搜索内容'},
                                {max: 64, message: '搜索栏最多不能超过 64 个字'}
                            ]}
                        >
                            <Input
                                style={{
                                    width: '250px',
                                }}
                                placeholder="在所选字段上进行搜索"
                                allowClear
                            />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
                <Form.Item>
                    <Button type={'primary'} htmlType="submit">
                        高级搜索
                    </Button>

                </Form.Item>
                    {/* 新增导出  style={{marginLeft:"816px"}}*/}
                    <Button type="primary" htmlType="submit" style={{marginLeft:"10px"}} onClick = {Output}>
                        导出
                    </Button> 
            </Form>
            
            {/* <button class="btn_output" onClick={console.log("I'm clicked")}></button> */}
        </div>
    )
}

export default AdvancedSearch
