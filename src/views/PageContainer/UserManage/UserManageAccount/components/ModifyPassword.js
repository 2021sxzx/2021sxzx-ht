import React, {useState,useEffect} from "react";
import {Button, Form, Input, message, Modal, Tooltip} from "antd";
import RoleMultiSelect from "./RoleMultiSelect";
import UnitTreeSelect from "./UnitManagement/UnitTreeSelect";
import api from "../../../../../api/personal";
import axios from 'axios'
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

let timer
function ModifyPassword(props) {
    // 初始化新增用户弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [btnContent, setBtnContent] = useState('获取验证码')
    const [btnDisabled, setBtnDisabled] = useState(false) 
    const [time, setTime] = useState(60)
    // 创建表单实例
    const [form] = Form.useForm();
    //初始化调用一次之后不再执行，相当于componentDidMount
    // useEffect(() => {
    //     clearInterval(timer)
    //     return () => clearInterval(timer)
    //   }, [])
    
      useEffect(() => {
        if (time > 0 && time < 60) {
          setBtnContent(`${time}s后重发`)
        } else {
          clearInterval(timer)
          setBtnDisabled(false)
          setTime(60)
        }
      }, [time])

    // 表单初始化数据
    const initialValues = {
        account: props.detailData.account,
        user_name: props.detailData.user_name,
        password: props.detailData.password,
        role: props.detailData.role_id,
        unit: props.detailData.unit_id,
    }
    //用于保存你验证码，以至于可以全局访问
    const ver_code = []

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
    //生成SMS
    const genSMS = ()=>{
        
        var rand = (min,max)=>{
            return Math.floor(Math.random()*(max-min))+min
        }
        while(ver_code.length)
            ver_code.shift()
        ver_code.push(rand(100000,999999))
    };

    const sendSMS = () =>{
        console.log("sendSMS...")
        
        genSMS()
        timer = setInterval(() => setTime(pre =>pre-1), 1000)
        setBtnDisabled(true)
        // axios.get('http://10.196.133.5:80/sms/v2/std/send_single',
        // {
        //     userid:'J97114',
        //     pwd:'190330',
        //     mobile:initialValues.account,
        //     content:ver_code[0]   
        // }).then(res=>{
        //     console.log("发短信返回结果",res)
        // })
        // .catch(err=>{
        //     message.error("发信息出错")
        // })
        // api.modifyPassword({
        //     userid:'J97114',
        //     pwd:'190330',
        //     mobile:initialValues.account,
        //     content:ver_code[0]
        // })
        // .then(res=>{
        //     console.log("发短信返回结果",res)
        // })
        // .catch(err=>{
        //     message.error("发信息出错")
        // })
    }

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
                            
                                <Input
                                    placeholder={'请输入新密码'}
                                    allowClear={true}
                                />
                        }
                    </Form.Item>

                    <Form.Item
                        label="确认新密码"
                        name="confirm_password"
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
                            
                                <Input
                                    placeholder={'请确认新密码'}
                                    allowClear={true}
                                />
                        }
                    </Form.Item>

                    {/* <Form.Item
                        label="短信验证码"
                        name="verification"
                        rules={[
                            {
                                required: true,
                                message: '请输入短信验证码！',
                            },
                            {
                                pattern: /[0-9](6)$/,
                                message: '请输入6位验证码'
                            }
                        ]}
                    >
                        {
                            <div>
                                <Input
                                    placeholder={'请输入短信验证码'}
                                    allowClear={true}
                                    style={{width:'160px'}}
                                />
                                <Button style={{marginLeft:'20px'}} onClick={sendSMS} disabled={btnDisabled}>
                                {!btnDisabled ? '获取验证码': `${time}s后重发`}
                                </Button>
                            </div>
                        }
                    </Form.Item> */}

                    

                </Form>
            </Modal>
        </>
    )
}

export default ModifyPassword
