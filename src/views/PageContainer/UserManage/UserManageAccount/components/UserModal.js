import React, {useState} from "react";
import {Button, Form, Input, message, Modal, Tooltip} from "antd";
import RoleMultiSelect from "./RoleMultiSelect";
import UnitTreeSelect from "./UnitManagement/UnitTreeSelect";

/**
 * 用户管理相关的弹窗
 * @param props = {
 *     buttonText:String, // 按钮文字
 *     buttonType:String, // 按钮类型，如"primary"
 *     disable:Boolean, // 设置弹窗触发的按钮能否被使用，默认 false
 *     tooltipTitle:string, // 设置按钮 disable 时的文字提醒
 *     title:String, // 标题
 *     detailData:{ // 默认表单内容
 *         user_name: userName,
 *         password: password,
 *         role_name: roleName,
 *         account: account,
 *         department: department
 *         unit_name:unit_name
 *     },
 *     saveInfoFunction(data):function([]), // 回调函数，一般是和服务端通信的 API. data 为弹窗中表单的内容的数组。
 *     accountReadOnly:Boolean, // 是否允许修改账号
 * }
 * @returns {JSX.Element}
 */
function UserModal(props) {
    // 初始化新增用户弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 储存用户信息
    // const [userName, setUserName] = useState(props.detailData.user_name);
    // const [account, setAccount] = useState(props.detailData.account);
    // const [password, setPassword] = useState(props.detailData.password);
    // const [roleID, setRoleID] = useState(props.detailData.role_id);
    // const [unitID, setUnitID] = useState(props.detailData.unit_id);


    // 创建表单实例
    const [form] = Form.useForm();

    // // 开关弹窗的时候自动刷新表单内容
    // useEffect(() => {
    //     if (isModalVisible) {
    //         const formDom = document.getElementById('user-model-' + props.detailData.account)
    //         if (formDom) {
    //             formDom.reset()
    //         }
    //     }
    // }, [isModalVisible])

    // 表单初始化数据
    const initialValues = {
        account: props.detailData.account,
        user_name: props.detailData.user_name,
        password: props.detailData.password,
        role: props.detailData.role_id,
        unit: props.detailData.unit_id,
    }

    // 查看详情按钮的触发函数，展示详情弹窗
    const showModal = () => {
        // 打开对话框
        setIsModalVisible(true)
        // 直接重置表单内容会有数据加载延迟
        // form.resetFields()
        // 手动重置数据
        form.setFieldsValue(initialValues)
        // setUserName(props.detailData.user_name)
        // setAccount(props.detailData.account)
        // setPassword(props.detailData.password)
        // setRoleID(props.detailData.role_id)
        // setUnitID(props.detailData.unit_id)
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
        // if (userName !== '' && account !== '' && password !== '' && !!(roleID) && !!(unitID)) {
        //     setIsModalVisible(false);
        //
        //     props.saveInfoFunction({
        //         user_name: userName,
        //         account: props.detailData.account ? props.detailData.account : account,// 如果初始值为 ‘’ 说明是创建用户，否则为修改用户
        //         new_account: account,
        //         password: password,
        //         // role_name: roleName,
        //         role_id: roleID,
        //         unit_id: unitID,
        //     })
        // } else {
        //     message.warn('请先完成表单填写再提交！')
        // }
    };

    // Cancel按钮的触发函数，关闭详情弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // // 根据输入框更新用户的信息
    // const handleInputChangeUserName = (e) => {
    //     setUserName(e.target.value)
    // }
    // const handleInputChangeAccount = (e) => {
    //     setAccount(e.target.value)
    // }
    // const handleInputChangePassword = (e) => {
    //     setPassword(e.target.value)
    // }

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
            {
                props.disable === true
                    ?
                    <Tooltip title={props.tooltipTitle?props.tooltipTitle:"禁止修改同级别角色的其他账号信息"} mouseEnterDelay={0.5}>
                        <Button
                            type={props.buttonType}
                            onClick={showModal}
                            disabled={props.disable}
                        >
                            {props.buttonText}
                        </Button>
                    </Tooltip>
                    :
                    <Button
                        type={props.buttonType}
                        onClick={showModal}
                        disabled={props.disable}
                    >
                        {props.buttonText}
                    </Button>
            }
            <Modal title={props.title} visible={isModalVisible} onSave={handleOk} onCancel={handleCancel}
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
                           保存
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
                        label="账号（手机号码）"
                        name="account"
                        rules={[
                            {
                                required: true,
                                message: '请输入账号（手机号码）',
                            },
                            {
                                pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                                message: '请输入正确的手机号码'
                            },
                        ]}
                    >
                        {
                            props.accountReadOnly
                                ?
                                <div>{props.detailData.account}</div>
                                :
                                <Input
                                    // defaultValue={props.detailData.account}
                                    placeholder={'请输入用户账号（手机号码）'}
                                    maxLength={32}
                                    // onChange={handleInputChangeAccount}
                                    allowClear={true}
                                />
                        }

                    </Form.Item>

                    <Form.Item
                        label="用户名"
                        name="user_name"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                            {
                                max: 32,
                                message: '用户名长度要求不大于 32 位'
                            },
                        ]}
                    >
                        <Input
                            // defaultValue={props.detailData.user_name}
                            placeholder={'请输入用户名'}
                            maxLength={32}
                            // onChange={handleInputChangeUserName}
                            allowClear={true}
                        />
                    </Form.Item>

                    <Form.Item
                        label="用户密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户密码！',
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
                            // defaultValue={props.detailData.password}
                            placeholder={'请输入用户密码'}
                            maxLength={32}
                            // onChange={handleInputChangePassword}
                            allowClear={true}
                        />
                    </Form.Item>

                    <Form.Item
                        label="角色"
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: '请选择角色!',
                                // warningOnly:true,
                            },
                        ]}
                    >
                        <RoleMultiSelect
                            defaultValue={props.detailData.role_id}
                            placeholder={'请选择角色'}
                            onChange={handleInputChangeRoleID}
                        />
                    </Form.Item>

                    <Form.Item
                        label="机构"
                        name="unit"
                        rules={[
                            {
                                required: true,
                                message: '请选择机构!',
                                // warningOnly:true,
                            },
                        ]}
                    >
                        <UnitTreeSelect
                            defaultValue={props.detailData.unit_id}
                            placeholder={'请选择机构'}
                            onChange={handleInputChangeUnit}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UserModal
