import {Button, Col, Form, Row, Input, message, Modal} from "antd";
import {ExclamationCircleOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";
import React, {useContext, useState} from "react";
import api from "../../../api/login";
import UrlJump from "../../../utils/UrlJump";
import {loginStateContext} from "../../../router/IndexRouter";

const {confirm} = Modal;

/**
 * 账号密码登录
 * @returns {JSX.Element}
 * @constructor
 */
export default function PasswordLoginForm() {
    const historyAccount = localStorage.getItem('account') ? localStorage.getItem('account') : '';
    const [account, setAccount] = useState(historyAccount)
    const {setLoginState} = useContext(loginStateContext)


    const onFinish = (values) => {
        api.Login({
            account: values.account,
            password: values.password,
            state: 0
        }).then(async response => {
            // 保存用户信息：账号密码用户id
            saveUserInfo(response, values)
            setLoginState('login')
            // 展现 0.1s 的登录成功操作提示并自动跳转到首页
            message.success('登录成功', 0.1, () => {
                UrlJump.goto('#/home')
            })
        }).catch((error) => {
            message.error(error.response.data && typeof error.response.data.msg === 'string' ? error.response.data.msg : '登录发生错误，请稍后重试')
        })
    }

    const onFinishFailed = (err) => {
        console.log(err)
        message.warn('请正确填写账号密码')
    }

    /**
     * 在 localstorage
     * @param response 响应报文
     * @param values 表单中的数据
     */
    const saveUserInfo = (response, values) => {
        // 保存账号
        localStorage.setItem('account', values.account);
        localStorage.setItem('_id', response.data.data._id);
        localStorage.setItem('roleID', response.data.data.role_id);
        setAccount(values.account);
    }

    // 忘记密码的对话框
    const forgetPasswordModal = () => {
        confirm({
            title: '如果忘记密码了怎么办？',
            icon: <ExclamationCircleOutlined/>,
            content: '如果忘记密码，请先使用手机短信验证码完成登录，然后后进入个人中心修改密码。',
            okText: '确认',
            autoFocusButton: 'ok',
            closable: true,
            mask: true,
            maskClosable: true,
            centered: true,
            cancelButtonProps: {
                style: {
                    display: 'none',
                }
            }
        });
    };

    return (
        <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                offset: 8,
                span: 8,
            }}
            initialValues={{
                account: account,
                remember: true,
            }}
            autoComplete="off"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            {/*账号/手机号码*/}
            <Form.Item
                // label="账号"
                name="account"
                rules={[
                    {
                        required: true,
                        message: '请输入手机号码!',
                    },
                    {
                        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                        message: '请输入正确的手机号码或者开发人员账号'
                    },
                ]}
            >
                <Input placeholder={'手机号码'}
                       defaultValue={account}
                       maxLength={32}
                       prefix={<UserOutlined className="site-form-item-icon"/>}
                       allowClear={true}
                />
            </Form.Item>
            {/*密码*/}
            <Form.Item
                // label="密码"
                name="password"
                rules={[
                    {
                        required: true,
                        message: '请输入密码!',
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
                <Input.Password
                    placeholder={"密码"}
                    type={"password"}
                    maxLength={32}
                    prefix={<LockOutlined className="site-form-item-icon"/>}
                    allowClear={true}

                />
            </Form.Item>
            {/*是否记住登录状态 & 忘记密码 */}
            <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                    offset: 8,
                    span: 8,
                }}
            >
                <a
                    className="login-form-forgot"
                    style={{float: "right"}}
                    onClick={forgetPasswordModal}
                >
                    忘记密码
                </a>
            </Form.Item>
            {/*登录按钮*/}
            <Form.Item>
                <Row type="flex" justify="center" align="middle">
                    <Col span={24}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block={true}
                            // onClick={login}
                        >
                            登录
                        </Button>
                    </Col>
                </Row>
            </Form.Item>
        </Form>
    )
}
