import React, {useEffect, useState} from "react";
import {Button, Form, Input, Modal} from "antd";
import PermissionMultipleSelect from "./PermissionMultipleSelect";

/**
 * 角色管理相关的弹窗
 * @param props = {
 *     buttonText:String, // 按钮文字
 *     buttonType:String, // 按钮类型，如"primary"
 *     title:String, // 标题
 *     detailData:{ // 默认表单内容
 *         role_name: roleName,
 *         role_describe: roleDescribe,
 *         permission_identifier_array: permissionIdentifierArray
 *     },
 *     // 回调函数，一般是和服务端通信的 API. data 为弹窗中表单的内容的数组，结构同 detailData
 *     callback(data):function({
 *         role_name: roleName,
 *         role_describe: roleDescribe,
 *         permission_identifier_array: permissionIdentifierArray
 *     }),
 * }
 * @returns {JSX.Element}
 */
export default function RoleModal(props) {
    // 初始化新增用户弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 储存角色信息
    const [roleName, setRoleName] = useState(props.detailData.role_name)
    const [roleDescribe, setRoleDescribe] = useState(props.detailData.role_describe)
    const [permissionIdentifierArray, setPermissionIdentifierArray] = useState(props.detailData.permission_identifier_array)
    // const permissions = props.detailData.permission

    // 每次打开弹窗重置表单内容
    useEffect(() => {
        if (isModalVisible) {
            const formDom = document.getElementById(props.detailData.role_name)
            if (formDom) {
                formDom.reset()
            }
        }
    }, [isModalVisible])

    //表单提交的成功、失败反馈
    const onFinish = (values) => {
        console.log('Role Form Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Role Form Failed:', errorInfo);
    };

    // 查看详情按钮的触发函数，展示详情弹窗
    const showModal = () => {
        setIsModalVisible(true);
    };

    // 保存按钮的触发函数，关闭详情弹窗并保存信息的修改
    const handleOk = () => {//  保存信息的修改
        setIsModalVisible(false);
        props.callback({
            // role_name_old:props.detailData.role_name,
            role_id: props.detailData.role_id,
            role_name: roleName,
            role_describe: roleDescribe,
            permission_identifier_array: permissionIdentifierArray
        })
    };

    // Cancel按钮的触发函数，关闭详情弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 根据输入框更新角色的信息
    const handleInputChangeRoleName = (event) => {
        setRoleName(event.target.value);
    }

    const handleInputChangeRoleDescribe = (event) => {
        setRoleDescribe(event.target.value);
    }

    const handleMultipleSelectChange = (value) => {
        console.log('multiSelect = ', value)
        setPermissionIdentifierArray(value);
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
                    id={props.detailData.role_name}
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
                        label="角色名"
                        name="roleName"
                        rules={[
                            {
                                required: true,
                                message: '请输入角色名!',
                            },
                        ]}
                    >
                        <Input defaultValue={props.detailData.role_name}
                               placeholder={'请输入角色名'}
                               onChange={handleInputChangeRoleName}/>
                    </Form.Item>
                    <Form.Item
                        label="角色描述"
                        name="roleDescribe"
                        rules={[
                            {
                                required: true,
                                message: '请输入角色描述!',
                            },
                        ]}
                    >
                        <Input defaultValue={props.detailData.role_describe}
                               placeholder={'请输入角色描述'}
                               onChange={handleInputChangeRoleDescribe}/>
                    </Form.Item>
                    <Form.Item
                        label="角色权限"
                        name="permission"
                        rules={[
                            {
                                required: true,
                                message: '请选择角色权限!',
                            },
                        ]}
                    >
                        <PermissionMultipleSelect
                            defaultValue={props.detailData.permission_identifier_array}
                            placeholder={'请选择角色权限'}
                            onChange={handleMultipleSelectChange}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
