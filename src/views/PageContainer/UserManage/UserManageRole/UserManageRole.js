/**
 * 用户管理/角色管理页面
 */

import React, { useEffect, useState } from 'react'

import { DatePicker, Space, Form, Input, Button, Select, Table, Modal, Descriptions, Badge } from 'antd';
import { getYMD, getTimeStamp } from "../../../../utils/TimeStamp";
import api from "../../../../api/comment";

const { RangePicker } = DatePicker;
const { Option } = Select;

// 设置角色下拉列表的内容   
const roleList = [];// TODO(zzj)：从服务端获取角色数据
// 下拉列表组件
const DropSelect = (props) => {
    const { dataList, setData } = props
    const handleChange = (value) => {
        setData(value)
    }
    return (
        <Select defaultValue={dataList[0]} style={{ width: 120 }} onChange={handleChange}>
            {
                dataList.map((item, index) => {
                    return <Option value={index} key={index}>{item}</Option>
                })
            }
        </Select>
    )
};
// 表格的属性/列名
const tableColumns = [// TODO(zzj): 修改dataIndex和key，以便和服务器进行数据对接
    {
        title: '角色名称',
        dataIndex: ['task', 'task_code'],
        key: 'task.task_code',
    },
    {
        title: '角色描述',
        dataIndex: ['task', 'task_name'],
        key: 'task.task_name',
    },
    {
        title: '角色权限',
        dataIndex: 'score',
        key: 'score',
    },
    {
        title: '修改角色信息',
        key: 'detail',
        render: (text, record) => (//查看详情按钮和详情弹窗
            <Space size="middle">
                <DetailModal itemDetail={record}></DetailModal>
            </Space>
        ),
    },
]
// 页面上方使用条件搜索的表单
const SelectForm = (props) => {
    // 使用并设置表单组件
    const [form] = Form.useForm();
    const formLayout = 'inline';

    // roleName 为状态值，setRoleName 为更新 roleName 的方法
    const [roleName, setRoleName] = useState('');

    // 保存输入框的角色名称
    const handleInputChange = (e) => {
        setRoleName(e.target.value)
    }

    // 搜索对应的角色
    const Search = () => {
        const data = {
            roleName
        }
        props.getSearch(data)
    }

    return (
        <>
            <Form
                layout={formLayout}
                form={form}
                initialValues={{
                    layout: formLayout,
                }}
            >
                <Form.Item >
                    <Input placeholder="请输入角色名称" size="middle" onChange={handleInputChange} />
                </Form.Item>
                <Form.Item >
                    <Button type="primary" onClick={Search}>搜索</Button>
                </Form.Item>
            </Form>
        </>
    )
}
// 查看详情按钮及其对应的详情弹窗
// TODO(zzj): 优化详情弹窗的 UI
const DetailModal = (props) => {
    // 初始化详情弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);
    // 获取详情内容的数据
    const detail = props.itemDetail
    // 详情弹窗中展示的属性名
    const key2name = {
        role_name: '角色名称',
        role_describe: '角色描述',
        role_permissions: '角色权限'
    }
    // 详情弹窗中展示的详情内容
    const detailData = {// TODO(zzj): 和服务端进行数据对接
        role_name: detail.task.task_name,
        role_describe:detail.task.task_name,
        role_permissions: detail.task.task_name
        // role_name: detail.role_name,
        // role_describe: detail.role_describe,
        // role_permissions: detail.role_permissions
    }
    // 查看详情按钮的触发函数，展示详情弹窗
    const showModal = () => {
        setIsModalVisible(true);
    };
    // OK按钮的触发函数，关闭详情弹窗并保存信息的修改
    const handleOk = () => {// TODO(zzj): 保存信息的修改
        setIsModalVisible(false);
    };
    // Cancel按钮的触发函数，关闭详情弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Button onClick={showModal}>
                查看详情
            </Button>

            <Modal title="事项详情" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Descriptions>
                    {Object.keys(detailData).map((item, index) => {
                        return <Descriptions.Item label={key2name[item]} key={item} span={3}>{detailData[item]}</Descriptions.Item>
                    })}
                </Descriptions>
            </Modal>
        </>
    );
};

// TODO(zzj): 修改和服务器的数据接口
// TODO(zzj): 修改页面 UI 样式
export default function CommentManageList() {
    // 用 [] 初始化 useState，第一项（tableData）用于保存状态值（表格数据），第二项（setTableData）用于保存更新状态的函数，
    const [tableData, setTableData] = useState([])
    // 从服务器获取评论表格的数据，保存到 tableData 中
    const getComment = (data) => {
        api.GetComment(data).then(response => {
            setTableData(response.data.data)
            console.log('response.data.data=', response.data.data)
        }).catch(error => {
        })
    }
    // 从服务器中获取搜索结果，保存到 tableData 中
    const getSearchComment = (data) => {
        console.log(data)
        api.SearchComment(data).then(response => {
            console.log('searchData=', response.data.data)
            setTableData(response.data.data)
        }).catch(error => {
        })
    }
    // 获取所有评论表格的数据，组件每渲染一次，该函数就自动执行一次。
    useEffect(() => {
        getComment({})
    }, [])
    return (
        <div>
            <Space direction="vertical" size={12}>
                {/* 搜索 */}
                <SelectForm getSearch={getSearchComment}></SelectForm>
                {/* 用户评价的表格 */}
                <Table columns={tableColumns} dataSource={tableData} />
            </Space>,
        </div>
    )
}
