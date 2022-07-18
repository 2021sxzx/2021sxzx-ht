import React, {useState} from "react";
import {Button, Form, Input, message, Modal, Tooltip} from "antd";
import RoleMultiSelect from "../../UserManage/UserManageAccount/components/RoleMultiSelect";
import UnitTreeSelect from "../../UserManage/UserManageAccount/components/UnitManagement/UnitTreeSelect";

/**
 * 用户管理相关的弹窗
 * @param props = {
 *     modalType:'addUnitUser'|'addUser'|'editUser', // 弹窗类型
 *     buttonText:String, // 按钮文字
 *     buttonProps:Object = { // antd Button 组件的 props，比如：
 *         type:String, // 按钮类型，如 "primary"
 *         disabled:Boolean, // 设置弹窗触发的按钮能否被使用，默认 false
 *         shape: "circle", // 按钮形状
 *         icon: <PlusOutlined/>, // 按钮图标
 *     },
 *     tooltipSuccessTitle:string, // 设置按钮正常使用时的文字提醒
 *     tooltipErrorTitle:string, // 设置按钮 disable = true 时的文字提醒
 *     title:String, // 对话框标题
 *     detailData:{ // 默认表单内容
 *         user_name: string,
 *         password: string,
 *         role_id: number,
 *         account: string,
 *         unit_id:number,
 *     },
 *     saveInfoFunction(data):function([]), // 回调函数，一般是和服务端通信的 API. data 为弹窗中表单的内容的数组。
 *     accountReadOnly:Boolean, // 是否允许修改账号
 *     userNameReadOnly:Boolean, // 是否允许修改用户名
 *     passwordReadOnly:Boolean, // 是否允许修改密码
 *     roleReadOnly:Boolean, // 是否允许修改角色
 *     unitReadOnly:Boolean, // 是否允许修改机构
 * }
 * @returns {JSX.Element}
 */
function ModifyPWDForm(props) {
    // 初始化新增用户弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 创建表单实例
    const [form] = Form.useForm();

    // 表单初始化数据
    const initialValues = {
        account: props.detailData.account,
        user_name: props.detailData.user_name,
        password: props.detailData.password,
        role: props.detailData.role_id,
        unit: props.detailData.unit_id,
    }

    // 查看详情按钮的触发函数，展示详情弹窗
    const showModal = () => {
        // 打开对话框
        setIsModalVisible(true)
        // 直接重置表单内容会有数据加载延迟（延迟一次渲染）
        // form.resetFields()
        // 手动重置数据
        form.setFieldsValue(initialValues)
    }

    // 保存按钮的触发函数，关闭详情弹窗并保存信息的修改
    const handleOk = () => {
        // 对表单进行校验
        form.validateFields()
            // 通过校验
            .then(value => {
                // 关闭对话框
                setIsModalVisible(false);
                // 调用回填函数处理表单信息
                props.saveInfoFunction({
                    user_name: value.user_name,
                    account: !!(props.detailData.account) ? props.detailData.account : value.account,// 如果初始值为 ‘’ 说明是创建用户，否则为修改用户
                    new_account: value.account,
                    password: value.password,
                    role_id: value.role,
                    unit_id: value.unit,
                })
            })
            // 没通过校验
            .catch(() => {
                message.warn('请正确完成表单填写')
            })
    };

    // Cancel按钮的触发函数，关闭详情弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleInputChangeRoleID = (value) => {
        // setRoleID(value)
        form.setFieldsValue({role: value})
    }
    const handleInputChangeUnit = (value) => {
        // setUnitID(value)
        form.setFieldsValue({unit: value})
    }

    return (
        <>
            <Tooltip
                title={props.buttonProps.disabled === true ? props.tooltipErrorTitle : props.tooltipSuccessTitle}
                mouseEnterDelay={0.1}
                zIndex={100}
            >
                <Button
                    {...props.buttonProps}
                    onClick={showModal}
                >
                    {props.buttonText}
                </Button>
            </Tooltip>

            <Modal
                title={props.title}
                visible={isModalVisible}
                onSave={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button
                        key="back"
                        onClick={handleCancel}
                    >
                        取消
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        htmlType="submit"
                        onClick={handleOk}
                    >
                        保存
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    id={'user-model-' + props.detailData.account}
                    name="basic"
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
                        label="用户名"
                        name="user_name"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                            {
                                max: 32,
                                message: '用户名长度要求不大于 32 位'
                            },
                        ]}
                    >
                        {
                            props.userNameReadOnly === true
                                ?
                                <div>{props.detailData.user_name}</div>
                                :
                                <Input
                                    placeholder={'请输入用户名'}
                                    allowClear={true}
                                />
                        }

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
                        {
                            props.roleReadOnly === true
                                ?
                                <div>{props.detailData.role_name}</div>
                                :
                                <RoleMultiSelect
                                    defaultValue={props.detailData.role_id}
                                    placeholder={'请选择角色'}
                                    onChange={handleInputChangeRoleID}
                                />
                        }
                    </Form.Item>

                    <Form.Item
                        label="机构"
                        name="unit"
                        rules={[
                            {
                                required: true,
                                message: '请选择机构!',
                            },
                        ]}
                    >
                        {
                            props.unitReadOnly === true
                                ?
                                <div>{props.detailData.unit_name}</div>
                                :
                                <UnitTreeSelect
                                    defaultValue={props.detailData.unit_id}
                                    placeholder={'请选择机构'}
                                    onChange={handleInputChangeUnit}
                                />
                        }
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default ModifyPWDForm
