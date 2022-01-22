/**
 * 用户管理/后台账号管理页面
 */

import React, { useEffect, useState } from 'react'

import { DatePicker, Space, Form, Input, Button, Select, Table, Modal, Descriptions, Badge } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
//import { getYMD, getTimeStamp } from "../../../../utils/TimeStamp";
import api from "../../../../api/comment";

//const { RangePicker } = DatePicker;
const { Option } = Select;

// 表格的属性/列名
const tableColumns = [//  修改dataIndex和key，以便和服务器进行数据对接
    {
        title: '用户账号',
        dataIndex: ['task', 'task_code'],
        key: 'task.task_code',
    },
    {
        title: '用户姓名',
        dataIndex: ['task', 'task_name'],
        key: 'task.task_name',
    },
    {
        title: '用户密码',
        dataIndex: 'score',
        key: 'score',
    },
    {
        title: '角色',
        dataIndex: 'score',
        key: 'score',
    },

    {
        title: '操作',
        key: 'detail',
        render: (text, record) => (//修改用户信息按钮和、详情弹窗和删除按钮
            <Space size="middle">
                <Opration itemDetail={record}></Opration>
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
                    <CreateModal></CreateModal>
                </Form.Item>
                <Form.Item >
                    <Button type="primary" onClick={Search}>批量导入用户</Button>
                </Form.Item>
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

// 新增用户按钮及其对应的弹窗
//  优化详情弹窗的 UI
const CreateModal = (props) => {
    // 初始化新增用户弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);
    // 获取详情内容的数据
    const detail = props.itemDetail
    // 详情弹窗中展示的属性名
    /*const key2name = {
        user_id: '用户账号',
        user_name: '用户姓名',
        user_passport: '用户密码',
        user_role: '角色'
    }
    // 详情弹窗中展示的详情内容
    const detailData = {//  和服务端进行数据对接
        user_id: detail.task.task_name,
        user_name: detail.task.task_name,
        user_passport: detail.task.task_name,
        user_role: detail.task.task_name
        // role_name: detail.role_name,
        // role_describe: detail.role_describe,
        // role_permissions: detail.role_permissions

    }*/

    //表单提交的成功、失败反馈
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };




    // 查看详情按钮的触发函数，展示详情弹窗
    const showModal = () => {
        setIsModalVisible(true);
    };
    // 保存按钮的触发函数，关闭详情弹窗并保存信息的修改
    const handleOk = () => {//  保存信息的修改
        setIsModalVisible(false);
    };
    // Cancel按钮的触发函数，关闭详情弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    };



    return (
        <>

            <Button type="primary" onClick={showModal}>
                新增用户
            </Button>

            <Modal title="新增用户" visible={isModalVisible} onSave={handleOk} onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" htmlType="submit" onClick={handleOk}>
                        保存
                    </Button>,
                ]}
            >
                {//引用antd的form组件实现数据录入与提交
                }
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="用户名账号"
                        name="useraccount"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户账号!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="用户密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户密码!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="角色"
                        name="role"
                        rules={[
                            {
                                required: true,
                            },
                        ]}

                    >
                        <Input />
                    </Form.Item>


                </Form>
            </Modal>


        </>
    );
};


// 操作组件，包括修改用户信息按钮和删除按钮
const Opration = (props) => {
    // 使用并设置表单组件
    const [form] = Form.useForm();
    const formLayout = 'inline';


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
                    <ModifyModal></ModifyModal>
                </Form.Item>
                <Form.Item >
                    <DeleteModal></DeleteModal>
                </Form.Item>
            </Form>



        </>
    );
};

//修改用户信息的按钮以及弹窗
const ModifyModal = (props) => {
    // 初始化新增用户弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);

    /*
    // 获取详情内容的数据
    const detail = props.itemDetail
    // 详情弹窗中展示的属性名
    const key2name = {
        user_id: '用户账号',
        user_name: '用户姓名',
        user_passport: '用户密码',
        user_role: '角色'
    }
    // 详情弹窗中展示的详情内容
    const detailData = {//  和服务端进行数据对接
        user_id: detail.task.task_name,
        user_name: detail.task.task_name,
        user_passport: detail.task.task_name,
        user_role: detail.task.task_name
        // role_name: detail.role_name,
        // role_describe: detail.role_describe,
        // role_permissions: detail.role_permissions

    }*/

    //表单提交的成功、失败反馈
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };




    // 查看详情按钮的触发函数，展示详情弹窗
    const showModal = () => {
        setIsModalVisible(true);
    };
    // 保存按钮的触发函数，关闭详情弹窗并保存信息的修改
    const handleOk = () => {//  保存信息的修改
        setIsModalVisible(false);
    };
    // Cancel按钮的触发函数，关闭详情弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    };



    return (
        <>

            <Button onClick={showModal}>
                修改用户信息
            </Button>

            <Modal title="修改用户信息" visible={isModalVisible} onSave={handleOk} onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" htmlType="submit" onClick={handleOk}>
                        保存
                    </Button>,
                ]}
            >
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    >
                        <Input defaultValue="张思成" />
                    </Form.Item>
                    <Form.Item
                        label="用户名账号"
                        name="useraccount"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户账号!',
                            },
                        ]}
                    >
                        <Input defaultValue="asdfgh" />
                    </Form.Item>

                    <Form.Item
                        label="用户密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户密码!',
                            },
                        ]}
                    >
                        <Input defaultValue="jkl123" />
                    </Form.Item>
                    <Form.Item
                        label="角色"
                        name="role"
                        rules={[
                            {
                                required: true,
                            },
                        ]}

                    >
                        <Input defaultValue="审核员" />
                    </Form.Item>


                </Form>
            </Modal>


        </>
    );
};


//删除按钮以及点击弹窗
//引用antd的确认对话框组件confirm（）
const DeleteModal = (props) => {
    const { confirm } = Modal;

    const showPromiseConfirm = () => {
        confirm({
            title: '你确定要删除这个用户吗？',
            icon: <ExclamationCircleOutlined />,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    return (
        <>
            <Space wrap>
                <Button onClick={showPromiseConfirm}>删除</Button>
            </Space>
        </>
    );
}

//  修改和服务器的数据接口
//  修改页面 UI 样式
export default function CommentManageList() {
    // 用 [] 初始化 useState，第一项（tableData）用于保存状态值（表格数据），第二项（setTableData）用于保存更新状态的函数，
    const [tableData, setTableData] = useState([])
    // 从服务器获取用户表格的数据，保存到 tableData 中
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
