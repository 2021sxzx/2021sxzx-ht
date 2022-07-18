import React, {useState} from "react";
import {Button, Form, Input, Modal, message} from "antd";
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
 *         permission_identifier: permissionIdentifierArray
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
function RoleModal(props) {
    // 初始化新增用户弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 表单实例
    const [form] = Form.useForm()

    // 表单初始化数据
    const initialValues = {
        roleName: props.detailData.role_name,
        roleDescribe: props.detailData.role_describe,
        permission: props.detailData.permission_identifier_array,
    }

    // 查看详情按钮的触发函数，展示详情弹窗
    const showModal = () => {
        setIsModalVisible(true);
        form.setFieldsValue(initialValues)
    };

    // 保存按钮的触发函数，关闭详情弹窗并保存信息的修改
    const handleOk = () => {
        // 表单校验
        form.validateFields()
            // 校验通过，发送请求
            .then((value) => {
                setIsModalVisible(false);
                props.callback({
                    role_id: props.detailData.role_id,
                    role_name: value.roleName,
                    role_describe: value.roleDescribe,
                    permission_identifier_array: value.permission,
                })
                console.log(value.permission)
            })
            // 校验不通过
            .catch(() => {
                message.warn('请正确完成表单填写')
            })
    }

    // Cancel按钮的触发函数，关闭详情弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleMultipleSelectChange = (value) => {
        form.setFieldsValue({permission: value})
    }

    return (
        <>
            <Button type={props.buttonType} onClick={showModal}>
                {props.buttonText}
            </Button>

            <Modal
                title={props.title}
                visible={isModalVisible}
                onSave={handleOk}
                onCancel={handleCancel}
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
                    form={form}
                    id={'role-model-' + props.detailData.role_name}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={initialValues}
                    autoComplete="off"
                >
                    <Form.Item
                        label="角色名"
                        name="roleName"
                        maxLength={32}
                        rules={[
                            {
                                required: true,
                                message: '请输入角色名!',
                            },
                            {
                                max: 32,
                                message: '角色名长度要求不大于 32 位'
                            },
                        ]}
                    >
                        <Input
                            placeholder={'请输入角色名'}
                        />
                    </Form.Item>
                    <Form.Item
                        label="角色描述"
                        name="roleDescribe"
                        maxLength={350}
                        rules={[
                            {
                                max: 300,
                                message: '角色描述不能超过300个字'
                            }
                        ]}
                    >
                        <Input
                            placeholder={'请输入角色描述'}
                        />
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
                            defaultValue={initialValues.permission}
                            placeholder={'请选择角色权限'}
                            onChange={handleMultipleSelectChange}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default React.memo(RoleModal)
