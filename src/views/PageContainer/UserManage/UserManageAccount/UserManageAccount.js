/**
 * 用户管理/后台账号管理页面
 */

import React, {useEffect, useState} from 'react'

import {Space, Form, Input, Button, Select, Table, Modal, Switch} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';

import api from "../../../../api/user";

const {Option} = Select;

const SwitchActivationStatus = (props) => {
    const record = props.record
    const [activationStatus, setActivationStatus] = useState(record.activation_status)

    const handleSwitchChangeActivationState = (e) => {
        const data = {
            user_name: record.user_name,
            // ...
            activation_status: activationStatus,
        }

        // TODO（钟卓江）：等 API 写好之后测试一下
        // api.UpdateActivationState(data).then(response => {
        //     // log 服务端返回的搜索结果
        //     console.log('updateUserResult=', response.data)
        // }).catch(error => {
        // }
    }

    if (activationStatus === 0) {
        return <Switch
            checkedChildren={"已激活"}
            unCheckedChildren={"未激活"}
            defaultChecked={true}
            onChange={handleSwitchChangeActivationState}
        />
    } else if (activationStatus === 1) {
        return <Switch
            checkedChildren={"已激活"}
            unCheckedChildren={"未激活"}
            defaultChecked={false}
            onChange={handleSwitchChangeActivationState}
        />
    } else {
        return "error status"
    }
}


// 表格的属性/列名
const tableColumns = [//  修改dataIndex和key，以便和服务器进行数据对接
    {
        title: '用户姓名',
        dataIndex: ['user_name'],
        key: 'user_name',
    },
    {
        title: '用户账号',
        dataIndex: ['account'],
        key: 'account',
    },
    {
        title: '角色',
        dataIndex: 'role_name',
        key: 'role_name',
    },
    // TODO（钟卓江）：部门表的信息还没完善，API也欠缺
    {
        title: '部门',
        // dataIndex: 'department',
        key: 'department',
        render: () => (
            <div>缺</div>
        )
    },

    {
        title: '激活状态',
        dataIndex: 'activation_status',
        key: 'activation_status',
        render: (text, record) => (
            <SwitchActivationStatus record={record}></SwitchActivationStatus>
        )
    },

    {
        title: '操作',
        key: 'detail',
        render: (text, record) => (//修改用户信息按钮和、详情弹窗和删除按钮
            <Space size="middle">
                <Operation itemDetail={record}></Operation>
            </Space>
        ),
    },
]

// 页面上方使用条件搜索的表单
const SelectForm = (props) => {
    // 使用并设置表单组件
    const [form] = Form.useForm();
    const formLayout = 'inline';

    const [userName, setUserName] = useState('');
    const [account, setAccount] = useState('');
    const [roleName, setRoleName] = useState('');
    const [department, setDepartment] = useState('');

    // 保存搜索输入框的搜索关键字
    const handleInputChangeUserName = (e) => {
        setUserName(e.target.value)
    }
    const handleInputChangeAccount = (e) => {
        setAccount(e.target.value)
    }
    const handleInputChangeRoleName = (e) => {
        setRoleName(e.target.value)
    }
    const handleInputChangeDepartment = (e) => {
        setDepartment(e.target.value)
    }

    // 搜索对应的角色
    // TODO(zzj)：目前搜索的 API 还不支持用户名之外的查询
    const searchUser = () => {
        const data = {
            searchValue: userName
            // user_name:userName,
            // account:account,
            // role_name:roleName,
            // department:department
        }
        props.getSearch(data)
    }

    // TODO（钟卓江）：等待批量导入用户的 API 完成后完善
    const multiCreate = () => {
        console.log('批量导入')
    }

    return (
        <>
            <Space direction="vertical">
                <Form
                    layout={formLayout}
                    form={form}
                    initialValues={{
                        layout: formLayout,
                    }}
                >
                    <Form.Item>
                        {/*账号按创建钮*/}
                        <CreateModal></CreateModal>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={multiCreate}>批量导入用户</Button>
                    </Form.Item>
                </Form>
                <Form
                    layout={formLayout}
                    form={form}
                    initialValues={{
                        layout: formLayout,
                    }}
                >
                    <Form.Item>
                        <Input placeholder="根据用户姓名搜索" size="middle" onChange={handleInputChangeUserName}/>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="根据用户账号搜索" size="middle" onChange={handleInputChangeAccount}/>
                    </Form.Item>
                    <Form.Item>
                        {/*TODO（钟卓江）：需要换成下拉列表的多选框吗？*/}
                        <Input placeholder="根据角色搜索" size="middle" onChange={handleInputChangeRoleName}/>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="根据部门搜索" size="middle" onChange={handleInputChangeDepartment}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={searchUser}>搜索</Button>
                    </Form.Item>
                </Form>
            </Space>
        </>
    )
}

// 新增用户按钮及其对应的弹窗
const CreateModal = (props) => {
    // 初始化新增用户弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 储存用户输入的信息
    const [userName, setUserName] = useState('');
    const [account, setAccount] = useState('');
    const [roleName, setRoleName] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const [idc, setIDC] = useState('');

    //表单提交的成功、失败反馈
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // 查看详情按钮的触发函数，展示详情弹窗
    const showModal = () => {
        setIsModalVisible(true);
    };
    // 保存按钮的触发函数，关闭详情弹窗并保存信息的修改
    const handleOk = () => {//  保存信息的修改
        const data = {
            user_name: userName,
            password: password,
            role_name: roleName,
            account: account,
            idc:idc,
            department:department
        }

        setIsModalVisible(false);
        api.AddUser(data).then(response=>{
            console.log('add user result =',response.data)
        }).catch(error=>{

        })
    };
    // Cancel按钮的触发函数，关闭详情弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 根据输入框获取新用户的信息
    const handleInputChangeUserName = (e) => {
        setUserName(e.target.value)
    }
    const handleInputChangeAccount = (e) => {
        setAccount(e.target.value)
    }
    const handleInputChangeRoleName = (e) => {
        setRoleName(e.target.value)
    }
    const handleInputChangeDepartment = (e) => {
        setDepartment(e.target.value)
    }
    const handleInputChangePassword = (e) => {
        setPassword(e.target.value)
    }
    const handleInputChangeIDC = (e) => {
        setIDC(e.target.value)
    }

    return (
        <>
            <Button type="primary" onClick={showModal}>
                账号创建
            </Button>

            <Modal title="新增用户" visible={isModalVisible} onSave={handleOk} onCancel={handleCancel}
                   footer={[
                       <Button key="back" onClick={handleCancel}>
                           取消
                       </Button>,
                       <Button key="submit" type="primary" htmlType="submit" onClick={handleOk}>
                           保存
                       </Button>,
                   ]}
            >
                {//引用antd的form组件实现数据录入与提交
                }
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
                        label="用户名"
                        name="userName"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    >
                        <Input placeholder={"请输入用户名"} onChange={handleInputChangeUserName}/>
                    </Form.Item>

                    <Form.Item
                        label="用户名账号"
                        name="account"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户账号!',
                            },
                        ]}
                    >
                        <Input placeholder={'请输入用户账号'} onChange={handleInputChangeAccount}/>
                    </Form.Item>

                    <Form.Item
                        label="用户密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户密码!',
                            },
                        ]}
                    >
                        <Input placeholder={'请输入用户密码'} onChange={handleInputChangePassword}/>
                    </Form.Item>

                    <Form.Item
                        label="角色"
                        name="role"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        {/* TODO（钟卓江）：这里要改成多选，缺 API*/}
                        <Input placeholder={'请输入用户角色(这里要改成多选)'} onChange={handleInputChangeRoleName}/>
                    </Form.Item>

                    <Form.Item
                        label="证件号码"
                        name="idc"
                        rules={[
                            {
                                required: true,
                                message: '请输入证件号码!',
                            },
                        ]}
                    >
                        {/* TODO（钟卓江）：这个和账号要统一吗*/}
                        <Input placeholder={'请输入证件号码（？）'} onChange={handleInputChangeIDC}/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

// TODO（钟卓江）：如果除了修改用户信息之外没有其他按钮的话就把这个组件合并到用户信息的表单里面，没必要拆分出来
// 操作组件，包括修改用户信息按钮和切换激活状态的按钮
const Operation = (props) => {
    // 使用并设置表单组件
    const [form] = Form.useForm();
    const formLayout = 'inline';

    return (
        <>
            <Form
                layout={formLayout}
                form={form}
                initialValues={{
                    layout: formLayout,
                }}
            >
                <Form.Item>
                    <ModifyModal itemDetail={props.itemDetail}></ModifyModal>
                </Form.Item>
            </Form>
        </>
    );
};

//修改用户信息的按钮以及弹窗
const ModifyModal = (props) => {
    // 初始化新增用户弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 获取详情内容的数据
    const detail = props.itemDetail
    // 详情弹窗中展示的详情内容
    const detailData = {
        user_name: detail.user_name,
        role_name: detail.role_name,
        account: detail.account,
        password: detail.password,
        idc: detail.idc,
        department: detail.department
    }

    // 储存更新的用户信息
    // 储存用户输入的信息
    const [userName, setUserName] = useState(detailData.user_name);
    const [account, setAccount] = useState(detailData.account);
    const [roleName, setRoleName] = useState(detailData.role_name);
    const [department, setDepartment] = useState(detailData.department);
    const [password, setPassword] = useState(detailData.password);
    const [idc, setIDC] = useState(detailData.idc);


    //表单提交的成功、失败反馈
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // 查看详情按钮的触发函数，展示详情弹窗
    const showModal = () => {
        setIsModalVisible(true);
    };
    // 保存按钮的触发函数，关闭详情弹窗并保存信息的修改
    const handleOk = () => {//  保存信息的修改
        setIsModalVisible(false);
        // TODO（钟卓江）：更新用户的 API 修改完成之后要也更新一下这里
        const data = {
            user_name: userName,
            password: password,
            role_name: roleName,
            account: account,
            idc:idc,
            department:department
        }
        api.UpdateUser(data).then(response => {
            // log 服务端返回的搜索结果
            console.log('updateUserResult=', response.data)
        }).catch(error => {

        })
    };

    // Cancel按钮的触发函数，关闭详情弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 根据输入框更新用户的信息
    const handleInputChangeUserName = (e) => {
        setUserName(e.target.value)
    }
    const handleInputChangeAccount = (e) => {
        setAccount(e.target.value)
    }
    const handleInputChangeRoleName = (e) => {
        setRoleName(e.target.value)
    }
    const handleInputChangeDepartment = (e) => {
        setDepartment(e.target.value)
    }
    const handleInputChangePassword = (e) => {
        setPassword(e.target.value)
    }
    const handleInputChangeIDC = (e) => {
        setIDC(e.target.value)
    }

    return (
        <>
            <Button onClick={showModal}>
                修改用户信息
            </Button>

            <Modal title="修改用户信息" visible={isModalVisible} onSave={handleOk} onCancel={handleCancel}
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
                        label="用户名"
                        name="user_name"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    >
                        <Input defaultValue={userName} placeholder={'请输入用户名!'}
                               onChange={handleInputChangeUserName}/>
                    </Form.Item>

                    <Form.Item
                        label="用户名账号"
                        name="account"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户账号!',
                            },
                        ]}
                    >
                        <Input defaultValue={account} placeholder={'请输入用户账号!'}
                               onChange={handleInputChangeAccount}/>
                    </Form.Item>

                    <Form.Item
                        label="用户密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户密码!',
                            },
                        ]}
                    >
                        <Input defaultValue={password} placeholder={'请输入用户密码!'}
                               onChange={handleInputChangePassword}/>
                    </Form.Item>

                    <Form.Item
                        label="角色"
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: '请选择角色!',
                            },
                        ]}
                    >
                        {/* TODO（钟卓江）：等获取角色种类的 API 完成之后完善这里,还需要换成多选*/}
                        <Input defaultValue={roleName} placeholder={'请选择角色!'+'这里应该是下拉列表'}/>
                    </Form.Item>

                    <Form.Item
                        label="证件号码"
                        name="idc"
                        rules={[
                            {
                                required: true,
                                message: '请输入证件号码!',
                            },
                        ]}
                    >
                        <Input defaultValue={idc} placeholder={'请输入证件号码!'} onChange={handleInputChangeIDC}/>
                    </Form.Item>

                </Form>
            </Modal>


        </>
    );
};

//  修改页面 UI 样式
export default function UserManageAccount() {
    // 用 [] 初始化 useState，第一项（tableData）用于保存状态值（表格数据），第二项（setTableData）用于保存更新状态的函数，
    const [tableData, setTableData] = useState([])

    // 从服务器获取用户表格的数据，保存到 tableData 中
    const getUser = (data) => {
        api.GetUser(data).then(response => {
            setTableData(response.data.data)
            console.log('getComment response.data.data=', response.data.data)
        }).catch(error => {
        })
    }

    // 从服务器中获取搜索结果，保存到 tableData 中
    const getSearchUser = (data) => {
        console.log('SearchValue = ', data)
        api.SearchUser(data).then(response => {
            console.log('SearchValue =', response.data)
            setTableData(response.data.data)
        }).catch(error => {
        })
    }

    // 获取所有评论表格的数据，组件每渲染一次，该函数就自动执行一次。
    useEffect(() => {
        getUser({})
    }, [])
    return (
        <div>
            <Space direction="vertical" size={12}>
                {/* 搜索 */}

                <SelectForm getSearch={getSearchUser}></SelectForm>

                {/* 用户评价的表格 */}
                <Table columns={tableColumns} dataSource={tableData}/>
            </Space>,
        </div>
    )
}
