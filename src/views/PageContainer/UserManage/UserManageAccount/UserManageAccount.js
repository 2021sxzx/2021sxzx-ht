/**
 * 用户管理/后台账号管理页面
 */

import React, { useEffect, useState } from 'react'

import { message, Space } from 'antd';

import api from "../../../../api/user";
import UserTableFunctionalZone from "./components/UserTableFunctionalZone";
import UserTable from "./components/UserTable";

//  修改页面 UI 样式
export default function UserManageAccount() {
    // 用 [] 初始化 useState，第一项（tableData）用于保存状态值（表格数据），第二项（setTableData）用于保存更新状态的函数，
    const [tableData, setTableData] = useState([])

    // 从服务器获取用户表格的数据，保存到 tableData 中
    const getUser = (data) => {
        api.GetUser(data).then(response => {
            setTableData(response.data.data)
            console.log('getUser response.data.data=', response.data.data)
        }).catch(error => {
            console.log("error = ", error)
        })

        console.log('1111111111111')
    }

    // 从服务器中获取搜索结果，保存到 tableData 中
    const getSearchUser = (data) => {
        console.log('SearchValue = ', data)
        api.SearchUser(data).then(response => {
            console.log('SearchValue =', response.data)
            setTableData(response.data.data)
            message.success('搜索用户信息成功')
        }).catch(error => {
            console.log("error = ", error)
            message.error('搜索用户信息发生错误')
        })
    }

    // 获取所有评论表格的数据，仅在第一次渲染时执行。
    useEffect(() => {
        getUser({})
    }, [])

    return (
        <div>
            <Space direction="vertical" size={12}>
                {/* 功能区 */}
                <UserTableFunctionalZone getSearch={getSearchUser} refreshTableData={getUser} />
                {/* 用户评价的表格 */}
                <UserTable tableData={tableData} refreshTableData={getUser} />
            </Space>,
        </div>
    )
}
