import React, {useState} from "react";
import {Button, Card, Col, message, Row, Input, Form} from "antd";
import './RegisterManagement.scss'
import UserModal from "../UserManageAccount/components/UserModal";
import api from "../../../../api/user";
import BatchImportUserButton from "./components/BatchImportUserButton/BatchImportUserButton";
import SimpleModalButton from "../../../../components/SimpleModalButton";
import {EditOutlined, SettingOutlined} from "@ant-design/icons";

function RegisterManagement() {
    const [initialPassword, setInitialPassword] = useState(localStorage.getItem("initialPassword") ? localStorage.getItem("initialPassword") : '11AAaa@@')
    const [form] = Form.useForm()

    const addUser = (data) => {
        api.AddUser(data).then(response => {
            if (response.data.code === 404) {
                message.warn(response.data.msg);
            } else {
                message.success('用户创建成功');
            }
        }).catch(() => {
            message.error('用户创建发生错误');
        });
    }

    const downloadTemplate = () => {
        api.DownloadTemplate()
    }

    const EditInitialPasswordButton = () => {
        return (
            <SimpleModalButton
                buttonProps={{
                    type: 'text',
                    icon: <EditOutlined/>,
                }}
                tooltipSuccessTitle={'修改密码'}
                title={'修改初始注册密码'}
                icon={<SettingOutlined/>}
                okText={'确认'}
                okCallback={() => {
                    // 表单验证
                    form.validateFields()
                        .then(() => {
                            setInitialPassword(form.getFieldValue('initialPassword'))
                            localStorage.setItem('initialPassword', form.getFieldValue('initialPassword'))
                            message.success('修改初始注册密码成功')
                        })
                        .catch(() => {
                            // 重置表单数据
                            form.setFieldsValue({
                                initialPassword: initialPassword,
                            })
                            message.error('修改密码发生错误，请正确填写密码')
                        })
                }}
                cancelCallback={() => {
                    // 重置表单数据
                    form.setFieldsValue({
                        initialPassword: initialPassword,
                    })
                }}
                content={(
                    <Form
                        form={form}
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        initialValues={{
                            initialPassword: initialPassword,
                        }}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="初始注册密码"
                            name={'initialPassword'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入初始注册密码！',
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
                            <Input
                                placeholder="设置初始注册密码"
                                maxLength={32}
                                allowClear={true}
                            />
                        </Form.Item>
                    </Form>
                )}
            />
        )
    }

    return (
        <>
            <div className={'login-management'}>
                <div className={'cards-container'}>
                    <Row
                        align={'top'}
                        gutter={50}
                        justify={'center'}
                    >
                        <Col span={8}>
                            <div className={'card-box'}>
                                <Card
                                    title="创建单个用户"
                                    bordered={true}
                                    hoverable
                                    headStyle={{
                                        fontSize: 20,
                                    }}
                                    actions={[
                                        <UserModal
                                            buttonText={"开始账号创建"}
                                            buttonProps={{
                                                type: "primary",
                                                disabled: false,
                                            }}
                                            title={"账号创建"}
                                            detailData={{
                                                user_name: '',
                                                password: '',
                                                role_name: '',
                                                account: '',
                                                role_id: null,
                                                unit_id: null,
                                                unit_name: '',
                                            }}
                                            saveInfoFunction={addUser}
                                        />,
                                    ]}
                                >
                                    <div style={{height: '150px'}}>
                                        通过在线填写表单即可完成同级部门或下级部门的单个用户创建。
                                    </div>
                                </Card>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className={'card-box'}>
                                <Card
                                    title="批量导入用户"
                                    bordered={true}
                                    hoverable
                                    headStyle={{
                                        fontSize: 20,
                                    }}
                                    actions={[
                                        <Button onClick={downloadTemplate}>
                                            下载模板
                                        </Button>,
                                        // 导入用户
                                        <BatchImportUserButton initialPassword={initialPassword}/>
                                    ]}
                                >
                                    <div style={{height: '150px'}}>
                                        <p>通过上传指定格式文件即可完成用户的批量导入。如果出现重复账号会被忽略。</p>
                                        <p>
                                            初始注册密码为：<strong>{initialPassword} </strong>
                                            <EditInitialPasswordButton/>
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default RegisterManagement
