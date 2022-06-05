import ActivationStatusSwitch from "./ActivationStatusSwitch";
import UserModal from "./UserModal";
import api from "../../../../../api/user";
import React from "react";
import {Button, message, Space, Table, Tooltip} from "antd";

/**
 * 后台账号管理的表格
 * @param props = {
 *     tableData:[],// 表格内的数据
 *     refreshTableData:function(),// 用于刷新表格数据
 *     loading:boolean, //是否处于加载状态
 * }
 * @returns {JSX.Element}
 * @constructor
 */
export default function UserTable(props) {
    // 修改用户信息
    const updateUserAndRefresh = (data) => {
        api.UpdateUser(data).then(response => {
            // log 服务端返回的搜索结果
            console.log('updateUserAndRefresh =', response.data)
            message.success('修改用户信息成功');
            // 刷新表格内容
            props.refreshTableData()
        }).catch(error => {
            console.log("error = ", error)
            message.error('修改用户信息发生错误');
            // 刷新表格内容
            props.refreshTableData()
        });
    }

    const deleteUser = (data) => {
        api.DeleteUser(data).then((() => {
            message.success('删除用户成功')
            // 刷新表格内容
            props.refreshTableData()
        }))
    }

    // 设置用户不能修改其他同名角色的非自己的账号信息
    const disableModal = (record) => {
        return record._id !== localStorage.getItem('_id') && record.role_name === localStorage.getItem('roleName')
    }

    // 设置删除按钮 disable 逻辑: 已激活的或者没有修改权限的不能删除
    const disableDeleteButton = (record) => {
        return record.activation_status !== 0 || disableModal(record)
    }

    // 表格的属性/列名
    const tableColumns = [//  修改dataIndex和key，以便和服务器进行数据对接
        {
            title: '用户姓名',
            dataIndex: ['user_name'],
            key: 'user_name',
            fixed: 'left',
            width: 120,
            // textWrap: 'word-break',
        },
        {
            title: '用户账号',
            dataIndex: ['account'],
            key: 'account',
            width: 120,
            // textWrap: 'word-break',
        },
        {
            title: '角色',
            dataIndex: 'role_name',
            key: 'role_name',
            width: 120,
            // textWrap: 'word-break',
        },
        // {
        //     title: '部门',
        //     dataIndex: 'department',
        //     key: 'department',
        // },
        {
            title: '单位',
            dataIndex: 'unit_name',
            key: 'unit_name',
            width: 120,
            // textWrap: 'word-break',
        },

        {
            title: '激活状态',
            dataIndex: 'activation_status',
            key: 'activation_status',
            width: 100,
            // textWrap: 'word-break',
            render: (text, record) => (
                <ActivationStatusSwitch record={record} refreshTableData={props.refreshTableData}/>
            )
        },

        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 210,
            render: (text, record) => (//修改用户信息按钮
                <Space>
                    <UserModal buttonText={'修改用户信息'}
                               title={'修改用户信息'}
                               disable={disableModal(record)}
                               detailData={record}
                               saveInfoFunction={updateUserAndRefresh}
                               accountReadOnly={false}
                    />
                    {
                        disableDeleteButton(record) === false
                            ?
                            <Button
                                disabled={disableDeleteButton(record)}
                                onClick={() => {
                                    deleteUser({account: record.account})
                                }}
                            >删除</Button>
                            :
                            <Tooltip title="如果要删除账号请先将账号设置为未激活" mouseEnterDelay={0.5}>
                                <Button
                                    disabled={disableDeleteButton(record)}
                                    onClick={() => {
                                        deleteUser({account: record.account})
                                    }}
                                >删除</Button>
                            </Tooltip>
                    }
                </Space>
            ),
        },
    ]

    return (
        <div>
            <Table columns={tableColumns}
                   dataSource={props.tableData !== {} ? props.tableData : {}}
                   rowKey={record => record._id}
                   sticky={true} //设置粘性头部和滚动条
                   scroll={{ //表格是否可滚动，也可以指定滚动区域的宽、高
                       scrollToFirstRowOnChange: true, // 当分页、排序、筛选变化后是否滚动到表格顶部
                       x: '100%', // 设置横向滚动，也可用于指定滚动区域的宽
                       y: 400, //设置纵向滚动，也可用于指定滚动区域的高
                   }}
                   pagination={{//分页器
                       // defaultPageSize: 7,// 默认每页的数量
                       pageSizeOptions: [5, 10, 15, 20, 25], // 允许的每页数量
                       showSizeChanger: true, // 是否展示 pageSize 切换器
                       responsive: true, // 当 size 未指定时，根据屏幕宽度自动调整尺寸
                       showQuickJumper:true, // 是否可以快速跳转至某页
                   }}
                   loading={props.loading}
            />
        </div>
    )
}
