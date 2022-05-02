/**
 * 用户管理/角色管理页面
 */
import React, {useEffect, useState} from 'react'

import {Space, message} from 'antd';

import api from "../../../../api/role";
import SelectForm from "./components/SelectForm";
import RoleTable from "./components/RoleTable";

export default function UserManageList() {
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(true)

    // 第一次渲染组件的的时候加载表格数据
    useEffect(() => {
        getRole()
    }, [])

    // 从服务器获取角色表格的数据，保存到 tableData 中
    const getRole = () => {
        setLoading(true)
        api.GetRole().then(response => {
            setLoading(false)
            console.log('角色表格的数据 GetRole =', response.data.data)
            setTableData(response.data.data)
        }).catch(error => {
            console.log('GetRole error:', error)
        })
    }

    // 从服务器中获取搜索结果，保存到 tableData 中
    const getSearchRole = (data) => {
        setLoading(true)
        api.SearchRole(data).then(response => {
            setLoading(false)
            setTableData(response.data.data)
            message.success("搜索角色成功")
        }).catch(error => {
            message.error("搜索角色出现错误")
            console.log("SearchRole error:", error)
        })
    }

    return (
        <div>
            <Space direction="vertical" size={12} style={{width: 100 + '%'}}>
                {/* 搜索 */}
                <SelectForm getSearch={getSearchRole} refreshTableData={getRole}/>
                {/* 用户评价的表格 */}
                <RoleTable tableData={tableData} refreshTableData={getRole} loading={loading}/>
            </Space>
        </div>
    )
}
