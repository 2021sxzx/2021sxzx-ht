/**
 * 用户管理/后台账号管理页面
 */

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import style from './UserManageAccount.module.scss'
import {message} from 'antd';

import api from "../../../../api/user";
import UserTableFunctionalZone from "./components/UserTableFunctionalZone";
import UserTable from "./components/UserTable";
import SideDrawer from "./components/UnitManagement/SideDrawer";
import UnitList from "./components/UnitManagement/UnitList";

//  修改页面 UI 样式
export default function UserManageAccount() {
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(true)
    const unitIDRef = useRef(null)
    const unitNameRef = useRef(null)

    // 从服务器获取所有用户的数据，保存到 tableData 中
    const getUser = useCallback(() => {
        setLoading(true)

        api.GetUser().then(response => {
            setTableData(response.data.data)
        }).catch(() => {
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    // 更新选中的 unit_id，useCallback 用于减少组件 UnitList 的渲染
    const selectUnit = useCallback((unitID, unitName) => {
        unitIDRef.current = unitID
        unitNameRef.current = unitName
        getUserByID()
    }, [])

    // 从服务器获取用户表格的数据，保存到 tableData 中
    const getUserByID = useCallback(() => {
        setLoading(true)
        if (unitIDRef.current) {
            api.GetUserByID({
                // unit_id: unitIDSelected
                unit_id: unitIDRef.current
            }).then(response => {
                setTableData(response.data.data)
            }).catch(() => {
            }).finally(() => {
                setLoading(false)
            })
        } else {
            api.GetUser().then(response => {
                setTableData(response.data.data)
            }).catch(() => {
            }).finally(() => {
                setLoading(false)
            })
        }
    }, [])

    // 从服务器中获取搜索结果，保存到 tableData 中
    // useCallback 用于减少 UserTableFunctionalZone 组件的渲染
    const getSearchUser = useCallback((data) => {
        setLoading(true)

        api.SearchUser(data).then(response => {
            setTableData(response.data.data)
            message.success('搜索用户信息成功')
        }).catch(() => {
            message.error('搜索用户信息发生错误')
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    // 获取所有评论表格的数据，仅在第一次渲染时执行。
    useEffect(() => {
        getUser()
    }, [])

    // 用于减少 SideDrawer 组件的渲染
    const SideDrawerProps = useMemo(() => {
        return {
            buttonTitle: '机构列表',
            title: '机构列表',
            visible: true,
            getContainer: false,
            style: {
                position: 'static',
                height: '100%'
            },
            drawerContainerOpenStyle: {
                height: '100%',
                width:'25vw',
                minWidth:'200px',
            },
        }
    }, [])

    const unitListComponent = useRef(<UnitList selectUnitID={selectUnit}/>)

    return (
        <div className={style.userManageContainer}>
            <div className={style.drawerContainer}>
                <SideDrawer
                    {...SideDrawerProps}
                >
                    {unitListComponent.current}
                </SideDrawer>
            </div>
            <div className={style.userAccountContainer}>
                {/*<Space direction="vertical" size={12} style={{width: '100%',height:'100%'}}>*/}
                {/* 功能区 */}
                <UserTableFunctionalZone
                    getSearch={getSearchUser}
                    refreshTableData={getUserByID}
                    unitName={unitNameRef.current}
                    unitID={unitIDRef.current}
                />
                {/* 用户评价的表格 */}
                <UserTable
                    tableData={tableData}
                    refreshTableData={getUserByID}
                    loading={loading}
                />
                {/*</Space>*/}
            </div>
        </div>
    )
}
