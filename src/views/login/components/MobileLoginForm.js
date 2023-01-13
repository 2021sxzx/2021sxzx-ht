import {Button, Col, Form, Input, message, Row} from "antd";
import {MobileOutlined, UserOutlined} from "@ant-design/icons";
import React, {useContext, useState} from "react";
import CountDownButton from "./CountDownButton";
import {loginStateContext} from "../../../router/IndexRouter";
import api from "../../../api/login";
import UrlJump from "../../../utils/UrlJump";
import DownloadUserManual from "./DownloadUserManual";

/**
 * 手机验证码登录
 * @returns {JSX.Element}
 * @constructor
 */
export default function MobileLoginForm() {
    const historyAccount = localStorage.getItem('account') ? localStorage.getItem('account') : '';
    const [account, setAccount] = useState(historyAccount)
    const {setLoginState} = useContext(loginStateContext)

    const onFinish = (value) => {
        api.Login({
            account: value.account,
            verificationCode: value.verificationCode,
            state: 1
        }).then(async (response) => {
            // 保存用户信息：账号密码用户id
            saveUserInfo(response, value)
            setLoginState('login')
            // 展现 0.1s 的登录成功操作提示并自动跳转到首页
            message.success('登录成功', 0.1, () => {
                UrlJump.goto('#/home')
            })
        }).catch((error) => {
            if (error.response.data !== undefined){
                message.error(typeof error.response.data.msg === 'string' ? error.response.data.msg : '登录发生错误，请稍后重试')
            }
            else
                message.error("登录错误")
        })
    };
    const saveUserInfo = (response, values) => {
        // 保存账号
        localStorage.setItem('account', values.account);
        localStorage.setItem('_id', response.data.data._id);
        localStorage.setItem('roleID', response.data.data.role_id);
        setAccount(values.account);
    }

    const onFinishFailed = () => {
    }

    const handlePhoneNumber = (e) => {
        // console.log(e.target.value)
        setAccount(e.target.value)
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
                account: account,
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            {/*手机号码*/}
            <Form.Item
                // label="手机号码"
                name="account"
                rules={[
                    {
                        required: true,
                        message: '请输入手机号码!',
                    },
                    {
                        // TODO：暂时保留了开发人员账号
                        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                        message: '请输入正确的手机号码'
                    },
                ]}
            >
                <Input placeholder={'手机号码'}
                       maxLength={32}
                       prefix={<UserOutlined className="site-form-item-icon"/>}
                       allowClear={true}
                       onChange={handlePhoneNumber}
                />
            </Form.Item>
            {/*验证码*/}
            <Form.Item
                // label="验证码"
                name="verificationCode"
                rules={[
                    {
                        required: true,
                        message: '请输入验证码!',
                    },
                    {
                        len: 8,
                        message: '请输入 8 位验证码'
                    }
                ]}
            >
                <Row>
                    <Col span={16}>
                        <Input placeholder={"验证码"}
                               maxLength={32}
                               prefix={<MobileOutlined/>}
                               allowClear={true}/>
                    </Col>
                    <Col span={7} offset={1}>
                        <CountDownButton account={ account } />
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item>
                <DownloadUserManual/>
            </Form.Item>

            {/*登录按钮*/}
            <Form.Item>
                <Row type="flex" justify="center" align="middle">
                    <Col span={24}>
                        <Button type="primary" htmlType="submit" block={true}>
                            登录
                        </Button>
                    </Col>
                </Row>
            </Form.Item>
        </Form>
    )
}
