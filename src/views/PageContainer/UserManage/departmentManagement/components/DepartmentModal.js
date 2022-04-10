import React, {useState} from "react";
import {Button, Form, Input, Modal} from "antd";

/**
 * 部门管理相关的弹窗
 * @param props = {
 *     buttonText:String, // 按钮文字
 *     buttonType:String, // 按钮类型，如"primary"
 *     title:String, // 标题
 *     detailData:{ // 默认表单内容
 *         department_name: string,
 *         department_describe: string,
 *     },
 *     // 回调函数，一般是和服务端通信的 API. data 为弹窗中表单的内容的数组，结构同 detailData
 *     callback(data):function({
 *         department_name: string,
 *         new_department_name: string,
 *         department_describe: string,
 *     }),
 * }
 * @returns {JSX.Element}
 */
export default function DepartmentModal(props) {
    // 初始化部门弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 储存部门信息
    const [departmentName, setDepartmentName] = useState(props.detailData.department_name)
    const [departmentDescribe, setDepartmentDescribe] = useState(props.detailData.department_describe)


    //表单提交的成功、失败反馈
    const onFinish = (values) => {
        console.log('Department Form Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Department Form Failed:', errorInfo);
    };

    // 查看详情按钮的触发函数，展示详情弹窗
    const showModal = () => {
        setIsModalVisible(true);
    };

    // 保存按钮的触发函数，关闭详情弹窗并保存信息的修改
    const handleOk = () => {//  保存信息的修改
        setIsModalVisible(false);
        props.callback({
            department_name:props.detailData.department_name,
            new_department_name: departmentName,
            department_describe: departmentDescribe,
        })
    };

    // Cancel按钮的触发函数，关闭详情弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 根据输入框更新角色的信息
    const handleInputChangeRoleName = (event) => {
        setDepartmentName(event.target.value);
    }

    const handleInputChangeRoleDescribe = (event) => {
        setDepartmentDescribe(event.target.value);
    }


    return (
        <>
            <Button type={props.buttonType} onClick={showModal}>
                {props.buttonText}
            </Button>

            <Modal title={props.title} visible={isModalVisible} onSave={handleOk} onCancel={handleCancel}
                   footer={[
                       <Button key="back" onClick={handleCancel}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" htmlType="submit" onClick={handleOk}>
                           保存
                       </Button>,
                   ]}
            >
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="部门名称"
                        name="departmentName"
                        rules={[
                            {
                                required: true,
                                message: '请输入部门名称!',
                            },
                        ]}
                    >
                        <Input defaultValue={departmentName} placeholder={'请输入部门名称'} onChange={handleInputChangeRoleName}/>
                    </Form.Item>
                    <Form.Item
                        label="部门描述"
                        name="departmentDescribe"
                        rules={[
                            {
                                required: true,
                                message: '请输入部门描述!',
                            },
                        ]}
                    >
                        <Input defaultValue={departmentDescribe} placeholder={'请输入部门描述'} onChange={handleInputChangeRoleDescribe}/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
