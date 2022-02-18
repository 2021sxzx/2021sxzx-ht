/**
 * 用户管理/角色管理页面
 */

import React, {useEffect, useState} from 'react'

import {
    Space,
    Form,
    Input,
    Button,
    Select,
    Table,
    Modal,
    Tag,
} from 'antd';

import api from "../../../../api/role";
import {ExclamationCircleOutlined} from "@ant-design/icons";

const {Option} = Select;

// 设置角色下拉列表的内容   
const roleList = [];
// // 下拉列表组件
// const DropSelect = (props) => {
//     const {dataList, setData} = props
//     const handleChange = (value) => {
//         setData(value)
//     }
//     return (
//         <Select defaultValue={dataList[0]} style={{width: 120}} onChange={handleChange}>
//             {
//                 dataList.map((item, index) => {
//                     return <Option value={index} key={index}>{item}</Option>
//                 })
//             }
//         </Select>
//     )
// };

// 权限多选选择器
const PermissionMultipleSelect = (props) => {
    const {Option} = Select

    // 初始化可选权限
    const children = props.children

    return (
        <>
            <Select
                mode="multiple"
                allowClear
                style={{width: '100%'}}
                placeholder="Please select"
                defaultValue={['default permission 1', 'default permission 2']}
                onChange={props.onChange}
            >
                {children}
            </Select>
        </>
    )
}

// 展示权限 tag
const ShowPermissionTag = (props) => {
    // 初始化可选权限
    /*
    key 为 id，option.children 为 权限名称，如：
    children.push(<Tag key={props.itemDetail.permission_identifier[i]}>{props.itemDetail.permission[1]}</Tag>);
    */
    // test 初始化可选权限
    const children = [];
    for (let i = 0; i < 11; i++) {
        children.push(<Tag key={'permission_identifier' + i.toString()}>{'permission' + i.toString()}</Tag>);
    }

    // props.permissionIdentifierArray props.permission
    return (
        <div>
            {children}
        </div>
    )
}

// 新增角色按钮及其对应的弹窗
const CreateModal = (props) => {
    // 初始化新增角色弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [roleName, setRoleName] = useState('')
    const [roleDescribe, setRoleDescribe] = useState('')
    const [permissionIdentifierArray, setPermissionIdentifierArray] = useState([])

    // 获取详情内容的数据
    const detail = props.itemDetail

    // 初始化可选权限
    /*
    key 为 id，option.children 为 权限名称，如：
    children.push(<Option key={detail.permission_identifier[i]}>{detail.permission[1]}</Option>);
    */
    // test 初始化可选权限
    const children = [];
    for (let i = 0; i < 11; i++) {
        children.push(<Option key={'permission_identifier' + i.toString()}>{'permission' + i.toString()}</Option>);
    }

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
    const handleOk = () => {
        // 关闭新增角色弹窗
        setIsModalVisible(false);
        // 整理一下数据
        const data = {
            role_name: roleName,
            role_describe: roleDescribe,
            permission_identifier_array: permissionIdentifierArray
        }
        // test
        console.log('new role = ', data)
        // 向服务器请求新增角色
        api.AddRole(data).then(response => {
            // log 服务端返回的搜索结果
            console.log('addRoleResult=', response.data)
        }).catch(error => {
        })
    };
    // Cancel按钮的触发函数，关闭详情弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 保存弹窗内输入的信息
    /**
     * TODO(zzj):待优化,具体如下
     * 1. 下面三个 function 重复度高，可以合成一个
     * 2. 现在是输入框每次内容改变的时候都会 setState，但实际只需要点击保存按钮的时候能获取输入框的内容就行了
     */
    function handleInputChangeRoleName(event) {
        setRoleName(event.target.value);
    }

    function handleInputChangeRoleDescribe(event) {
        setRoleDescribe(event.target.value);
    }

    function handleInputChangePermission(event) {
        setPermissionIdentifierArray(event.target.value);
    }

    function handleMultipleSelectChange(value) {
        console.log('multiSelect = ', value)
        setPermissionIdentifierArray(value);
    }

    return (
        <>
            <Button type="primary" onClick={showModal}>
                新增角色
            </Button>

            <Modal title="新增角色" visible={isModalVisible} onSave={handleOk} onCancel={handleCancel}
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
                        label="角色名"
                        name="roleName"
                        rules={[
                            {
                                required: true,
                                message: '请输入角色名!',
                            },
                        ]}
                    >
                        <Input onChange={handleInputChangeRoleName}/>
                    </Form.Item>
                    <Form.Item
                        label="角色描述"
                        name="roleDescribe"
                        rules={[
                            {
                                required: true,
                                message: '请输入角色描述!',
                            },
                        ]}
                    >
                        <Input onChange={handleInputChangeRoleDescribe}/>
                    </Form.Item>
                    <Form.Item
                        label="角色权限"
                        name="permission"
                        rules={[
                            {
                                required: true,
                                message: '请选择角色权限!',
                            },
                        ]}
                    >
                        {/*<Input onChange={handleInputChangePermission}/>*/}
                        <PermissionMultipleSelect onChange={handleMultipleSelectChange}
                                                  children={children}></PermissionMultipleSelect>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

// 表格的属性/列名
const tableColumns = [
    {
        title: '角色名称',
        dataIndex: 'role_name',
        key: 'role_name',
    },
    {
        title: '角色描述',
        dataIndex: 'role_describe',
        key: 'role_describe',
    },
    {
        title: '角色权限',
        dataIndex: 'permission',
        key: 'permission',
        render: permission => (
            <>
                {permission.map(permission => {
                    return (
                        <Tag key={permission}>
                            {permission.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: '修改角色信息',
        key: 'detail',
        // 每一列的内容为查看详情和删除两个按钮
        render: (text, record) => (//查看详情按钮和详情弹窗
            <Space size="middle">
                <UpdateModal itemDetail={record}></UpdateModal>
                <DeleteModal itemDetail={record}></DeleteModal>
            </Space>
        ),
    },
]

// 页面上方使用条件搜索的表单
const SelectForm = (props) => {
    // 使用并设置表单组件
    const [form] = Form.useForm();
    const formLayout = 'inline';

    // roleName 为状态值，setRoleName 为更新 roleName 的方法
    const [roleNameOrDescribe, setRoleNameOrDescribe] = useState('');

    // 保存输入框的角色名称
    const handleInputChange = (e) => {
        setRoleNameOrDescribe(e.target.value)
    }

    // 搜索对应的角色
    const Search = () => {
        const data = {
            roleNameOrDescribe
        }
        props.getSearch(data)
    }

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
                    <CreateModal></CreateModal>
                </Form.Item>
                <Form.Item>
                    <Input placeholder="请输入角色名称或描述" size="middle" onChange={handleInputChange}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={Search}>搜索</Button>
                </Form.Item>
            </Form>
        </>
    )
}

// 修改角色信息按钮及其对应的详情弹窗
const UpdateModal = (props) => {
    // 初始化详情弹窗的展示状态
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 获取详情内容的数据
    const detail = props.itemDetail

    const [roleName, setRoleName] = useState(detail.role_name)
    const [roleDescribe, setRoleDescribe] = useState(detail.role_describe)
    const [permissionIdentifierArray, setPermissionIdentifierArray] = useState(detail.permission)


    // 初始化可选权限
    /*
    key 为 id，option.children 为 权限名称，如：
    children.push(<Option key={detail.permission_identifier[i]}>{detail.permission[1]}</Option>);
    */
    // test 初始化可选权限
    const children = [];
    for (let i = 0; i < 11; i++) {
        children.push(<Option key={'permission_identifier' + i.toString()}>{'permission' + i.toString()}</Option>);
    }

    // 获取详情内容的数据
    // const detail = props.itemDetail
    // // 详情弹窗中展示的属性名
    // const key2name = {
    //     role_name: '角色名称',
    //     role_describe: '角色描述',
    //     role_permissions: '角色权限'
    // }
    // // 详情弹窗中展示的详情内容
    // const detailData = {
    //     // role_name: detail.task.task_name,
    //     // role_describe:detail.task.task_name,
    //     // role_permissions: detail.task.task_name
    //     role_name: detail.role_name,
    //     role_describe: detail.role_describe,
    //     role_permissions: detail.permission
    // }

    // 修改角色信息按钮的触发函数，展示详情弹窗
    const showModal = () => {
        setIsModalVisible(true);
    };

    // TODO (zzj):更新相关的服务端 API 还没做好，做好后要调一下
    // OK按钮的触发函数，关闭详情弹窗并保存信息的修改
    const handleOk = () => {
        setIsModalVisible(false);
        // 更新非权限相关的信息
        api.UpdateRole({
            role_name: roleName,
            role_describe: roleDescribe
        }).then(response => {
            console.log('UpdateRole = ', response.data)
        }).catch(error => {
        })

        // 更新权限相关的信息
        api.UpdateRolePermission({
            permission: permissionIdentifierArray
        }).then(response => {
            console.log('UpdatePermission = ', response.data)
        }).catch(error => {
        })
    };

    // Cancel按钮的触发函数，关闭详情弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 保存弹窗内输入的信息
    /**
     * TODO(zzj):待优化,具体如下
     * 1. 下面三个 function 重复度高，可以合成一个
     * 2. 现在是输入框每次内容改变的时候都会 setState，但实际只需要点击保存按钮的时候能获取输入框的内容就行了
     */
    function handleInputChangeRoleName(event) {
        setRoleName(event.target.value);
    }

    function handleInputChangeRoleDescribe(event) {
        setRoleDescribe(event.target.value);
    }

    function handleMultipleSelectChange(value) {
        console.log('multiSelect = ', value)
        setPermissionIdentifierArray(value);
    }

    return (
        <>
            <Button onClick={showModal}>
                修改角色信息
            </Button>

            <Modal title="事项详情" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                {/*<Descriptions>*/}
                {/*    {Object.keys(detailData).map((item, index) => {*/}
                {/*        return <Descriptions.Item label={key2name[item]} key={item}*/}
                {/*                                  span={3}>{detailData[item]}</Descriptions.Item>*/}
                {/*    })}*/}
                {/*</Descriptions>*/}
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
                    autoComplete="off"
                >
                    <Form.Item
                        label="角色名称"
                        name="roleName"
                        rules={[
                            {
                                required: true,
                                message: '请输入角色名!',
                            },
                        ]}
                    >
                        <Input defaultValue={detail.role_name} onChange={handleInputChangeRoleName}/>
                    </Form.Item>
                    <Form.Item
                        label="角色描述"
                        name="roleDescribe"
                        rules={[
                            {
                                required: true,
                                message: '请输入角色描述!',
                            },
                        ]}
                    >
                        <Input defaultValue={detail.role_describe} onChange={handleInputChangeRoleDescribe}/>
                    </Form.Item>

                    <Form.Item
                        label="权限"
                        name="permissionIdentification"
                        rules={[
                            {
                                required: true,
                                message: '请选择权限!',
                            },
                        ]}
                    >
                        {/*<Input defaultValue={detail.permission}/>*/}
                        <PermissionMultipleSelect onChange={handleMultipleSelectChange}
                                                  children={children}></PermissionMultipleSelect>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

//删除按钮以及点击弹窗
// TODO（钟卓江）：服务端在删除前要判断该角色是否已经分配出去了，如果分配出去了就不能删了。前端还要处理这个不能删除的响应
const DeleteModal = (props) => {
    const {confirm} = Modal;

    const showPromiseConfirm = () => {
        confirm({
            title: '你确定要删除这个角色吗？（暂时不支持删除功能）',
            icon: <ExclamationCircleOutlined/>,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                // // 向服务发送删除请求
                // api.DeleteRole({data:props.itemDetail}).then(response => {
                //     console.log('delete response.data.data=', response.data.data)
                // }).catch(error => {
                //
                // })
                return new Promise((resolve, reject) => {
                    // // 向服务发送删除请求
                    // api.DeleteRole({data:props.itemDetail}).then(response => {
                    //
                    //     console.log('delete response.data.data=', response.data.data)
                    // }).catch(error => {
                    //     reject()
                    // })
                    // resolve()
                    // // 有 50% 概率显示提交成功或失败
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {
            },
        });
    };

    return (
        <>
            <Space wrap>
                <Button onClick={showPromiseConfirm}>删除</Button>
            </Space>
        </>
    );
}

// TODO(zzj): 修改和服务器的数据接口
// TODO(zzj): 修改页面 UI 样式
export default function CommentManageList() {
    // 用 [] 初始化 useState，第一项（tableData）用于保存状态值（表格数据），第二项（setTableData）用于保存更新状态的函数，
    const [tableData, setTableData] = useState([])
    // 从服务器获取评论表格的数据，保存到 tableData 中
    const getRole = (data) => {
        api.GetRole(data).then(response => {
            setTableData(response.data.data)
            console.log('response.data.data=', response.data.data)
        }).catch(error => {
        })
    }
    // 从服务器中获取搜索结果，保存到 tableData 中
    const getSearchRole = (data) => {
        // log 搜索值
        console.log('roleSearchValue=', data)
        api.SearchRole(data).then(response => {
            // log 服务端返回的搜索结果
            console.log('searchResult=', response.data.data)
            setTableData(response.data.data)
        }).catch(error => {
        })
    }
    // 副作用：获取所有评论表格的数据，组件每渲染一次，该函数就自动执行一次。
    useEffect(() => {
        getRole({})
    }, [])
    return (
        <div>
            <Space direction="vertical" size={12}>
                {/* 搜索 */}
                <SelectForm getSearch={getSearchRole}></SelectForm>
                {/* 用于设置垂直间隔 */}
                <div></div>
            </Space>
            {/* 用户评价的表格 */}
            <Table columns={tableColumns} dataSource={tableData}/>
        </div>
    )
}
