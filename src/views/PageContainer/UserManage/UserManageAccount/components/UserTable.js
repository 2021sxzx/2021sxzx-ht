import ActivationStatusSwitch from "./ActivationStatusSwitch";
import UserModal from "./UserModal";
import api from "../../../../../api/user";
import React from "react";
import { message,  Table, Tooltip} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import SimpleModalButton from "../../../../../components/SimpleModalButton";


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
function UserTable(props) {
    console.log('UserTable')
    // 修改用户信息
    const updateUserAndRefresh = (data) => {
        api.UpdateUser(data).then(() => {
            message.success('修改用户信息成功');
        }).catch(() => {
            message.error('修改用户信息发生错误');
        }).finally(() => {
            // 刷新表格内容
            props.refreshTableData()
        });
    }

    const deleteUser = (data) => {
        api.DeleteUser(data).then(() => {
            message.success('删除用户成功')
        }).catch(() => {
            message.error('删除用户构失败，请重试')
        }).finally(() => {
            // 刷新表格内容
            props.refreshTableData()
            console.log('刷新表格内容')
        })
    }

    // 设置用户不能修改其他同名角色的非自己的账号信息
    const disableModal = (record) => {
        return record._id !== localStorage.getItem('_id') && record.role_name === localStorage.getItem('roleName')
    }

    // 设置删除按钮 disable 逻辑: 已激活的或者没有修改权限的不能删除
    const disableDeleteButton = (record) => {
        return record.activation_status !== 0 || disableModal(record)
    }

    // const showDeleteConfirm = (record) => {
    //     confirm({
    //         title: `是否确认删除用户：${record.user_name}?`,
    //         icon: <ExclamationCircleOutlined/>,
    //         // content: 'Some descriptions',
    //         okText: '删除',
    //         okType: 'danger',
    //         cancelText: '取消',
    //
    //         onOk() {
    //             // api.DeletUnit({
    //             //     unit_id: nodeData.unit_id
    //             // }).then(() => {
    //             //     message.success('删除机构成功')
    //             // }).catch(() => {
    //             //     message.error('删除机构失败，请重试')
    //             // }).finally(() => {
    //             //     getUnitAndRefreshTree()
    //             // })
    //             api.DeleteUser({
    //                 account: record.account
    //             }).then((() => {
    //                 message.success('删除用户成功')
    //             }).catch(() => {
    //                 message.error('删除用户构失败，请重试')
    //             }).finally(() => {
    //                 // 刷新表格内容
    //                 props.refreshTableData()
    //             }))
    //         },
    //         onCancel() {
    //             // console.log('Cancel')
    //         },
    //     })
    // }

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
            title: '机构',
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
            width: 200,
            render: (text, record) => (//修改用户信息按钮
                <div style={{
                    display:'inline-flex',
                    // width:'100%',
                }}>
                    <Tooltip
                        title={disableModal(record) ? "不能修改同级别角色的用户信息" : undefined}//
                        mouseEnterDelay={0.5}
                        mouseLeaveDelay={0.1}
                    >
                        <div style={{padding: '5px',}}>
                            <UserModal buttonText={'修改用户信息'}
                                       title={'修改用户信息'}
                                       disable={disableModal(record)}
                                       detailData={record}
                                       saveInfoFunction={updateUserAndRefresh}
                                       accountReadOnly={false}
                            />
                        </div>
                    </Tooltip>
                    {/*{*/}
                    {/*    disableDeleteButton(record) === false*/}
                    {/*        ?*/}
                    {/*        // <Button*/}
                    {/*        //     icon={<DeleteOutlined/>}*/}
                    {/*        //     disabled={disableDeleteButton(record)}*/}
                    {/*        //     onClick={() => {*/}
                    {/*        //         showDeleteConfirm(record)*/}
                    {/*        //         // deleteUser({account: record.account})*/}
                    {/*        //     }}*/}
                    {/*        // >删除</Button>*/}
                    {/*        <SimpleModalButton*/}
                    {/*            buttonProps={{*/}
                    {/*                disabled: disableDeleteButton(record),*/}
                    {/*                shape: "circle",*/}
                    {/*                icon: <DeleteOutlined/>,*/}
                    {/*            }}*/}
                    {/*            deleteCallback={() => {*/}
                    {/*                deleteUser({account: record.account})*/}
                    {/*            }}*/}
                    {/*        />*/}
                    {/*        :*/}
                    <Tooltip
                        title={disableDeleteButton(record) ? "如果要删除账号请先将账号设置为未激活" : undefined}//
                        mouseEnterDelay={0.5}
                        mouseLeaveDelay={0.1}
                    >
                        {/*这个 div 用于增加提示的激活区域面积，减少因鼠标快速移出导致 tooltip 不能自动关闭的情况*/}
                        <div style={{padding: '5px'}}>
                            <SimpleModalButton
                                buttonProps={{
                                    disabled: disableDeleteButton(record),
                                    shape: "circle",
                                    icon: <DeleteOutlined/>,
                                }}
                                deleteCallback={() => {
                                    deleteUser({account: record.account})
                                }}
                            />
                        </div>
                    </Tooltip>
                    {/*}*/}
                </div>
            ),
        },
    ]

    return (
        <div>
            <Table
                columns={tableColumns}
                dataSource={props.tableData !== {} ? props.tableData : {}}
                rowKey={record => record._id + record.account}
                sticky={true} //设置粘性头部和滚动条
                scroll={{ //表格是否可滚动，也可以指定滚动区域的宽、高
                    scrollToFirstRowOnChange: true, // 当分页、排序、筛选变化后是否滚动到表格顶部
                    x: 'max-content',//'100%', // 设置横向滚动，也可用于指定滚动区域的宽
                    y: 400, //设置纵向滚动，也可用于指定滚动区域的高
                }}
                pagination={{//分页器
                    // defaultPageSize: 5,// 默认每页的数量
                    pageSizeOptions: ['5', '10', '15', '20', '25'], // 允许的每页数量
                    showSizeChanger: true, // 是否展示 pageSize 切换器
                    responsive: true, // 当 size 未指定时，根据屏幕宽度自动调整尺寸
                    showQuickJumper: true, // 是否可以快速跳转至某页
                }}
                loading={props.loading}
            />
        </div>
    )
}

export default React.memo(UserTable)
