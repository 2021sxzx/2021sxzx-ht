import React, {useState} from "react";
import {Button, Form, Input, message, Modal, Tooltip} from "antd";
import api from "../../../../api/personal";

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
function ChangePassword(props) {
    // 初始化新增用户弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 创建表单实例
    const [form] = Form.useForm();

    // 表单初始化数据
    const initialValues = {
        prePassword: "",
        password: "",
        confirmPassword: ""
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
                if (form.getFieldValue('password') !== form.getFieldValue('confirmPassword'))
                    message.warn('新密码跟旧密码不一致,请重新填写')
                else {
                    api.modifyPassword({
                        account: !!(props.detailData.account) ? props.detailData.account : value.account,
                        pwd: form.getFieldValue('password'),
                        prePwd: form.getFieldValue('prePassword'),
                    })
                        .then(res => {
                            console.log("修改密码成功", res)
                        })
                        .catch(err => {
                            if(err.response && err.response.data && err.response.data.msg){
                                message.error(err.response.data.msg)
                            } else {
                                message.error('修改密码时发生错误，请稍后尝试')
                            }
                        })

                    // 关闭对话框
                    setIsModalVisible(false);
                }
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
                        确定
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
                        label="旧密码"
                        name="prePassword"
                        rules={[
                            {
                                required: true,
                                message: '请输入旧密码验证身份！',
                            },
                            {
                                min: 8,
                                message: '密码长度要求不小于 8 位'
                            },
                            {
                                max: 32,
                                message: '密码长度要求不大于 32 位'
                            },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*_\-+=])[\w\d@#$%&*_\-+=]*$/,
                                message: '要求同时使用大小写字母，数字和部分特殊字符(@#$%&*_+-=)，不支持空格'
                            }
                        ]}
                    >
                        {

                            <Input.Password
                                placeholder={'请输入旧密码验证身份'}
                                allowClear={true}
                            />
                        }
                    </Form.Item>

                    <Form.Item
                        label="新密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入新密码！',
                            },
                            {
                                min: 8,
                                message: '密码长度要求不小于 8 位'
                            },
                            {
                                max: 32,
                                message: '密码长度要求不大于 32 位'
                            },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*_\-+=])[\w\d@#$%&*_\-+=]*$/,
                                message: '要求同时使用大小写字母，数字和部分特殊字符(@#$%&*_+-=)，不支持空格'
                            }
                        ]}
                    >
                        {

                            <Input.Password
                                placeholder={'请输入新密码'}
                                allowClear={true}
                            />
                        }
                    </Form.Item>

                    <Form.Item
                        label="确认新密码"
                        name="confirmPassword"
                        rules={[
                            {
                                required: true,
                                message: '请输入新密码！',
                            },
                            {
                                min: 8,
                                message: '密码长度要求不小于 8 位'
                            },
                            {
                                max: 32,
                                message: '密码长度要求不大于 32 位'
                            },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*_\-+=])[\w\d@#$%&*_\-+=]*$/,
                                message: '要求同时使用大小写字母，数字和部分特殊字符(@#$%&*_+-=)，不支持空格'
                            }
                        ]}
                    >
                        {
                            <Input.Password
                                placeholder={'请确认新密码'}
                                allowClear={true}
                            />
                        }
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default ChangePassword
