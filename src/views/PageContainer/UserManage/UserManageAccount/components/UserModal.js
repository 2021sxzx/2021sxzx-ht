import React, {useState} from "react";
import {Button, Form, Input, Modal} from "antd";

/**
 * 用户管理相关的弹窗
 * @param props = {
 *     buttonText:String, // 按钮文字
 *     buttonType:String, // 按钮类型，如"primary"
 *     title:String, // 标题
 *     detailData:{ // 默认表单内容
 *         user_name: userName,
 *         password: password,
 *         role_name: roleName,
 *         account: account,
 *         department: department
 *     },
 *     callback(data):function([]), // 回调函数，一般是和服务端通信的 API. data 为弹窗中表单的内容的数组。
 * }
 * @returns {JSX.Element}
 */
export default function UserModal(props) {
    // 初始化新增用户弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 储存用户信息
    const [userName, setUserName] = useState(props.detailData.user_name);
    const [account, setAccount] = useState(props.detailData.account);
    const [roleName, setRoleName] = useState(props.detailData.role_name);
    const [department, setDepartment] = useState(props.detailData.department);
    const [password, setPassword] = useState(props.detailData.password);


    //表单提交的成功、失败反馈
    const onFinish = (values) => {
        console.log('User Form Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('User Form Failed:', errorInfo);
    };

    // 查看详情按钮的触发函数，展示详情弹窗
    const showModal = () => {
        setIsModalVisible(true);
    };
    // 保存按钮的触发函数，关闭详情弹窗并保存信息的修改
    const handleOk = () => {//  保存信息的修改
        setIsModalVisible(false);
        // TODO（钟卓江）：更新用户的 API 修改完成之后要也更新一下这里
        props.callback({
            user_name: userName,
            password: password,
            role_name: roleName,
            account: account,
            department: department, //TODO：等后台的部门 API 做好之后再来修改
        })
    };

    // Cancel按钮的触发函数，关闭详情弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 根据输入框更新用户的信息
    const handleInputChangeUserName = (e) => {
        setUserName(e.target.value)
    }
    const handleInputChangeAccount = (e) => {
        setAccount(e.target.value)
    }
    const handleInputChangeRoleName = (e) => {
        setRoleName(e.target.value)
    }
    const handleInputChangeDepartment = (e) => {
        setDepartment(e.target.value)
    }
    const handleInputChangePassword = (e) => {
        setPassword(e.target.value)
    }

    return (
        <>
            <Button type={props.buttonType} onClick={showModal}>
                {props.buttonText}
            </Button>

            <Modal title={props.title} visible={isModalVisible} onSave={handleOk} onCancel={handleCancel}
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
                        name="user_name"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    >
                        <Input defaultValue={userName} placeholder={'请输入用户名'}
                               onChange={handleInputChangeUserName} allowClear={true}/>
                    </Form.Item>

                    <Form.Item
                        label="账号/手机号码"
                        name="account"
                        rules={[
                            {
                                required: true,
                                message: '请输入账号/手机号码!',
                            },
                        ]}
                    >
                        <Input defaultValue={account} placeholder={'请输入用户账号/手机号码'}
                               onChange={handleInputChangeAccount} allowClear={true}/>
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
                        <Input defaultValue={password} placeholder={'请输入用户密码'}
                               onChange={handleInputChangePassword} allowClear={true}/>
                    </Form.Item>

                    <Form.Item
                        label="角色"
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: '请选择角色!',
                            },
                        ]}
                    >
                        {/* TODO（钟卓江）：等获取角色种类的 API 完成之后完善这里,还需要换成多选*/}
                        <Input defaultValue={roleName} placeholder={'请选择角色' + '，这里应该是下拉列表'} onChange={handleInputChangeRoleName} allowClear={true}/>
                    </Form.Item>

                    <Form.Item
                        label="部门"
                        name="department"
                        rules={[
                            {
                                required: true,
                                message: '请选择部门!',
                            },
                        ]}
                    >
                        {/* TODO（钟卓江）：等获取部门种类的 API 完成之后完善这里,还需要换成多选*/}
                        <Input defaultValue={department} placeholder={'请选择部门' + '，这里应该是下拉列表'} onChange={handleInputChangeDepartment} allowClear={true}/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};