import React from "react";
import {Button, Card, Col, message, Row} from "antd";
import './RegisterManagement.scss'
import UserModal from "../UserManageAccount/components/UserModal";
import api from "../../../../api/user";
import BatchImportUserButton from "./components/BatchImportUserButton/BatchImportUserButton";

function RegisterManagement() {
    const addUser = function (data) {
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
                                    <UserModal
                                        buttonText={"开始账号创建"}
                                        buttonProps={{
                                            type:"primary",
                                            disabled:false,
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
                                <div style={{height:'80px'}}>
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
                                    <Button>
                                        下载模板
                                    </Button>,
                                    // 导入用户
                                    <BatchImportUserButton/>,
                                ]}
                            >
                                <div style={{height:'75px'}}>
                                    通过上传指定格式文件即可完成用户的批量导入。
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default RegisterManagement
