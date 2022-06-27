import React, {useState} from "react";
import {Button, Form, Input, message, Modal} from "antd";

/**
 * 部门管理相关的弹窗
 * @param props = {
 *     buttonText:String, // 按钮文字
 *     buttonType:String, // 按钮类型，如 "primary"
 *     buttonProps:object, // 根据 antd 文档自定义 Button 的属性
 *     title:String, // 标题
 *     detailData:{ // 默认表单内容/对应的 unit 信息
 *         // 用于添加 unit
 *         unit_name: string,
 *         parent_unit:number,
 *         parent_name:string
 *         // 用于修改 unit
 *         unit_name: string,
 *         unit_id:string,
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
export default function UnitModal(props) {
    // 初始化部门弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm()

    const initialValues = {
        unitName: props.detailData.unit_name,
    }

    // 查看详情按钮的触发函数，展示详情弹窗
    const showModal = () => {
        setIsModalVisible(true);
        form.setFieldsValue(initialValues)
    };

    // 保存按钮的触发函数，关闭详情弹窗并保存信息的修改
    const handleOk = () => {//  保存信息的修改
        form.validateFields().then(() => {
            setIsModalVisible(false);
            props.callback({
                // 用于添加 unit
                unit_name: form.getFieldValue('unitName'),
                parent_unit: props.detailData.parent_unit,
                // 用于修改 unit
                new_unit_name: form.getFieldValue('unitName'),
                unit_id: props.detailData.unit_id,
            })
        }).catch(() => {
            message.warn('请正确完成表单填写')
        })
    }

    // Cancel按钮的触发函数，关闭详情弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    }

    return (
        <>
            <Button
                onClick={showModal}
                {...props.buttonProps}
            >
                {props.buttonText}
            </Button>

            <Modal
                title={props.title}
                visible={isModalVisible}
                onSave={handleOk}
                onCancel={handleCancel}
                zIndex={1000} // z index
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
                    form={form}
                    id={props.detailData.department_name}
                    name="basic"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={initialValues}
                    autoComplete="off"
                >
                    <Form.Item
                        label="机构名称"
                        name="unitName"
                        rules={[
                            {
                                required: true,
                                message: '请输入机构门名称!',
                            },
                            {
                                max: 64,
                                message: '机构名称要求小于 64 个字'
                            },
                        ]}
                    >
                        <Input placeholder={'请输入机构名称'}/>
                    </Form.Item>
                    {
                        props.detailData.parent_name
                            ?
                            <Form.Item
                                label="父级机构"
                                // name="parentUnit"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择父级机构',
                                    },
                                    {
                                        max: 64,
                                        message: '机构名称要求小于 64 个字'
                                    }
                                ]}
                            >
                                {props.detailData.parent_name}
                            </Form.Item>
                            :
                            <></>
                    }
                </Form>
            </Modal>
        </>
    )
}
