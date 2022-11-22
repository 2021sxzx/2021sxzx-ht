import React, {useEffect, useState} from 'react'

import {Button, DatePicker, Descriptions, Form, Input, message, Modal, Select, Space, Table} from 'antd'
import {getTimeStamp, getYMD} from '../../../utils/TimeStamp'
import api from '../../../api/comment'

const {RangePicker} = DatePicker
const {Option} = Select
// 设置下拉列表的内容
const starList = ['全部', '1', '2', '3', '4', ' 5']
const idList = ['全部', '证件号', '事项指南名称', '事项指南编码']
// 下拉列表组件
const DropSelect = (props) => {
    const {dataList, setData} = props
    const handleChange = (value) => {
        setData(value)
    }
    return (
        <Select
            defaultValue={dataList[0]}
            style={{width: 120}}
            onChange={handleChange}>
            {dataList.map((item, index) => {
                return (
                    <Option value={index} key={index}>
                        {item}
                    </Option>
                )
            })}
        </Select>
    )
}
// 表格的属性/列名
const tableColumns = [
    {
        title: '事项指南编码',
        dataIndex: ['task_code'],
        key: 'task_code'
    },
    {
        title: '事项指南名称',
        dataIndex: ['task_name'],
        key: 'task_name'
    },
    {
        title: '星级',
        dataIndex: 'score',
        key: 'score'
    },
    {
        title: '评价日期',
        key: 'create_time',
        render: (
            text,
            record // 根据MongoDB的_id生成对应的时间戳
        ) => <Space size='middle'>{getYMD(record.create_time)}</Space>
    },
    {
        title: '查看详情',
        key: 'detail',
        render: (
            text,
            record //查看详情按钮和详情弹窗
        ) => (
            <Space size='middle'>
                <DetailModal comment_id={record._id}/>
            </Space>
        )
    }
]
// 页面上方使用条件搜索的表单
const SelectForm = (props) => {
    const [form] = Form.useForm()
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [score, setScore] = useState('')
    const [type, setType] = useState('')
    const [typeData, setTypeData] = useState('')
    const formLayout = 'inline'
    const handleInputChange = (e) => {
        setTypeData(e.target.value)
    }

    const Search = () => {
        const data = {
            startTime,
            endTime,
            score,
            type,
            typeData,

        }
        props.getParam(data)
        data.pageNum = 1
        props.getSearch(data)
        props.setCur({
            current: 1
        })
    }
    const handleDateChange = (value, dateString) => {
        if (value) {
            setStartTime(getTimeStamp(dateString[0]))
            setEndTime(getTimeStamp(dateString[1]))
        } else {
            setEndTime('')
            setStartTime('')
        }
    }
    return (
        <>
            <Form
                layout={formLayout}
                form={form}
                initialValues={{
                    layout: formLayout
                }}
                onKeyDown={(e) => {
                    // 当按下enter时，触发搜索功能
                    if (e.key === 'Enter') {
                        Search()
                    }
                }}
            >
                <Form.Item label='起止日期'>
                    <RangePicker onChange={handleDateChange}/>
                </Form.Item>
                <Form.Item label='星级排查' name='score'>
                    <DropSelect dataList={starList} setData={setScore}/>
                </Form.Item>
                <Form.Item label='编号排查'>
                    <DropSelect dataList={idList} setData={setType}/>
                </Form.Item>
                <Form.Item>
                    <Input
                        placeholder='请输入编号'
                        size='middle'
                        onChange={handleInputChange}
                        maxLength={64}
                        showCount
                    />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' onClick={Search}>
                        搜索
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}
// 查看详情按钮及其对应的详情弹窗
const DetailModal = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [detailData, setDetailData] = useState({})
    const key2name = {
        item_guide_name: '事项指南名称',
        item_guide_id: '事项指南编码',
        score: '星级',
        content: '评价内容',
        idc_type: '证件类型',
        idc: '证件号',
        rule_name: '事项规则',
        create_time: '创建时间'
    }


    const showModal = async () => {
        let detail = await api.getCommentDetail({
            _id: props.comment_id
        })
        detail = detail.data.data
        setDetailData({
            item_guide_name: detail.task_name,
            item_guide_id: detail.task_code,
            score: detail.score,
            content: detail.content,
            create_time: getYMD(detail.create_time),
            rule_name: detail.rule.rule_name,
            idc_type: detail.idc_type,
            idc: detail.idc
        })
        setIsModalVisible(true)
    }

    const handleOk = () => {
        setIsModalVisible(false)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    return (
        <>
            <Button onClick={showModal}>查看详情</Button>

            <Modal
                title='事项详情'
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}>
                <Descriptions>
                    {Object.keys(detailData).map((item) => {
                        return (
                            <Descriptions.Item label={key2name[item]} key={item} span={3}>
                                {detailData[item]}
                            </Descriptions.Item>
                        )
                    })}
                </Descriptions>
            </Modal>
        </>
    )
}

export default function CommentManageList() {
    // 用 [] 初始化 useState，第一项（tableData）用于保存状态值（表格数据），第二项（setTableData）用于保存更新状态的函数，
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState({
        current: 1,
        pageSize: 10,
        total: 100,
        showSizeChanger: false
    })
    // 从服务器获取评论表格的数据，保存到 tableData 中
    const [searchParam, setSearchParam] = useState({})

    // 从服务器中获取搜索结果，保存到 tableData 中
    const getSearchComment = (data) => {
        setLoading(true)

        api
            .SearchComment(data)
            .then((response) => {
                // console.log('searchData=', response.data)
                setTableData(response.data.data.data)
                if (response.data.data.total) {
                    setPage({
                        total: response.data.data.total,
                        current: data.pageNum,
                        showSizeChanger: false
                    })
                } else {
                    setPage({
                        total: 0,
                        current: 1,
                        showSizeChanger: false
                    })
                }
                setLoading(false)
            })
            .catch((error) => {
                message.error('获取表格数据出错：' + error.message)
                setLoading(false)
            })
    }
    const handlePageChange = (pagination) => {
        setPage(pagination)
        searchParam.pageNum = pagination.current
        getSearchComment(searchParam)
    }
    // 获取所有评论表格的数据，组件每渲染一次，该函数就自动执行一次。
    useEffect(() => {
        getSearchComment({
            pageNum: 1
        })
    }, [])
    return (
        <div>
            <Space direction='vertical' size={12}>
                {/* 搜索 */}
                <SelectForm getSearch={getSearchComment} getParam={setSearchParam} setCur={setPage}/>
                {/* 用户评价的表格 */}
                <Table columns={tableColumns}
                       dataSource={tableData}
                       pagination={page}
                       loading={loading}
                       onChange={handlePageChange}/>
            </Space>
            ,
        </div>
    )
}
