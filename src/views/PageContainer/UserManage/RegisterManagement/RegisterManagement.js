import React, {useState} from "react";
import {Button, Card, Col, message, Row, Modal, Input} from "antd";
import './RegisterManagement.scss'
import UserModal from "../UserManageAccount/components/UserModal";
import api from "../../../../api/user";
import BatchImportUserButton from "./components/BatchImportUserButton/BatchImportUserButton";

function RegisterManagement() {

    const initialPasswordInLocalStorage = localStorage.getItem("initialPassword") ? localStorage.getItem("initialPassword") : '11AAaa@@';
    const [initialPassword, setInitialPassword] = useState(initialPasswordInLocalStorage);
    const [passwordInInput, setPasswordInInput] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleOk = () => {
      message.success('修改初始密码成功');
      setIsModalVisible(false);
      setInitialPassword(passwordInInput);  
      localStorage.setItem("initialPassword", passwordInInput);
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const changePassword = (e) => {
      setPasswordInInput(e.target.value)
    }

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
                                    <Button onClick={downloadTemplate}>
                                        下载模板
                                    </Button>,
                                    // 导入用户
                                    <BatchImportUserButton initialPassword={initialPassword}/>
                                ]}
                            >
                                <div style={{height:'75px'}}>
                                    通过上传指定格式文件即可完成用户的批量导入。用户的默认密码为：<strong>{initialPassword}</strong> <a onClick={showModal}>修改</a>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>

        <Modal title="更换默认密码" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Input placeholder="更换初始注册密码" onChange={changePassword} defaultValue={initialPassword}/>
        </Modal>
      </>
    )
}

export default RegisterManagement
