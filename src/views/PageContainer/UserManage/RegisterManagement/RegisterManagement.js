import React from "react";
import {Button, Card, Col, message, Row} from "antd";
import './LoginManagement.scss'
import UserModal from "../UserManageAccount/components/UserModal";
import api from "../../../../api/user";
import BatchImportUserButton from "../UserManageAccount/components/BatchImportUserButton/BatchImportUserButton";

function RegisterManagement() {
    const addUser = function (data) {
        api.AddUser(data).then(response => {
            // log 服务端返回的搜索结果
            console.log('addUser =', response.data)
            message.success('用户创建成功');
        }).catch(error => {
            console.log('error = ', error)
            message.error('用户创建发生错误');
        });
    }

    return (
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
                                    <UserModal buttonText={"开始账号创建"}
                                               buttonType={"primary"}
                                               title={"账号创建"}
                                               detailData={{
                                                   user_name: '',
                                                   password: '',
                                                   role_name: '',
                                                   account: '',
                                                   department: '',
                                               }}
                                               saveInfoFunction={addUser}
                                    />,
                                ]}
                            >
                                <p>通过在线填写表单即可完成单个用户的创建。</p>
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
                                    <Button>
                                        下载模板
                                    </Button>,
                                    // 导入用户
                                    <BatchImportUserButton />,
                                ]}
                            >
                                <p>通过上传指定格式文件即可完成用户的批量导入。</p>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default RegisterManagement
