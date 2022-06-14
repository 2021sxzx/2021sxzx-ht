import {Button, Col, Form, Row, Input, message} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";
// import QuickLogin from "./QuickLogin";
import api from "../../../api/login";
import UrlJump from "../../../utils/UrlJump";

/**
 * 账号密码登录
 * @returns {JSX.Element}
 * @constructor
 */
export default function PasswordLoginForm() {
    // const rememberPassword = !!localStorage.getItem('rememberPassword') // 是否选择记住密码（Boolean）
    const historyAccount = localStorage.getItem('account')
    // const historyPassword = localStorage.getItem('password')

    // const [account, setAccount] = useState(historyAccount)
    // const [password, setPassword] = useState(historyPassword)

    // const handleInputChangeAccount = (e) => {
    //     setAccount(e.target.value)
    // }

    // const handleInputChangePassword = (e) => {
    //     setPassword(e.target.value)
    // }

    const onFinish = (values) => {
        api.Login({
            account: values.account,
            password: values.password
        }).then(async response => {
            // 保存用户信息：账号密码用户id
            await saveUserInfo(response, values)

            // 展现 0.1s 的登录成功操作提示并自动跳转到首页
            message.success('登录成功', 0.1, () => {
                UrlJump.goto('#/home')
            })
        }).catch((error) => {
            console.log('login error', error.response.data)
            message.error(typeof error.response.data === 'string' ? error.response.data : '登录发生错误，请稍后重试')
        })
    }

    const onFinishFailed = () => {
        message.warn('请正确填写账号密码')
    }

    /**
     * 在 localstorage
     * @param response 响应报文
     * @param values 表单中的数据
     */
    const saveUserInfo = (response, values) => {
        // 保存账号
        localStorage.setItem('account', values.account)
        localStorage.setItem('_id', response.data.data._id);
        localStorage.setItem('roleID', response.data.data.role_id)
    }

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
                        // TODO：暂时保留了开发人员账号
                        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}|account$/,
                        message: '请输入正确的手机号码或者开发人员账号'
                    },
                ]}
            >
                <Input placeholder={'手机号码'}
                       defaultValue={historyAccount}
                       maxLength={32}
                       prefix={<UserOutlined className="site-form-item-icon"/>}
                       allowClear={true}
                    // onChange={handleInputChangeAccount}
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
                        // TODO：暂时保留开发人员密码
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*_\-+=])[\w\d@#$%&*_\-+=]*|password$/,
                        message: '要求同时使用大小写字母，数字和部分特殊字符(@#$%&*_+-=)，不支持空格'
                    }
                ]}
            >
                <Input.Password placeholder={"密码"}
                    // defaultValue={historyPassword}
                                type={"password"}
                                maxLength={32}
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                allowClear={true}
                    // onChange={handleInputChangePassword}
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
                {/*<Row>*/}
                {/*    <Col span={8}>*/}
                {/*        <Checkbox defaultChecked={rememberPassword} onChange={handleCheckboxChange}>记住密码</Checkbox>*/}
                {/*    </Col>*/}
                {/*    <Col span={3} offset={13}>*/}
                {/*        <a className="login-form-forgot" href="">*/}
                {/*            忘记密码*/}
                {/*        </a>*/}
                {/*    </Col>*/}
                {/*</Row>*/}

                {/*TODO：忘记密码待完成*/}
                <a
                    className="login-form-forgot"
                    href=""
                    style={{float: "right"}}
                >
                    忘记密码（开发中）
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
            {/*<Form.Item>*/}
            {/*    /!*第三方快捷登录*!/*/}
            {/*    <QuickLogin/>*/}
            {/*</Form.Item>*/}
        </Form>
    )
}
