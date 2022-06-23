import React, {useEffect, useState} from "react";
import {message, Table,} from "antd";
import api from "../../../../api/log";
import FunctionalZone from "./components/FunctionalZone";

const tableColumns = [
    {
        title: "编号",
        dataIndex: "log_id",
        key: "log_id",
        width: 100
    },
    {
        title: "时间",
        dataIndex: "create_time",
        key: "create_time",
        width: 180
    },
    {
        title: "操作描述",
        dataIndex: "content",
        key: "content",
    },
    {
        title: "操作人",
        key: "user_name",
        dataIndex: "user_name",
        width: 100
    },
    {
        title: "账号",
        key: "idc",
        dataIndex: "idc",
    },
];

export const journalContext = React.createContext(undefined)

function SystemManageJournal() {
    const [tableData, setTableData] = useState([]);
    const [tableLoading,setTableLoading] = useState(false)

    useEffect(() => {
        getLog({});
    }, []);

    // 获取全部日志
    const getLog = (data) => {
        api.GetLog(data).then((response) => {
            setTableData(response.data.data);
        }).catch(() => {
            message.error('获取系统日志失败，请稍后尝试')
        });
    }

    return (
        <>
            <journalContext.Provider value={{
                setTableData,
                setTableLoading,
            }}>
                <FunctionalZone/>
            </journalContext.Provider>
            <Table rowKey="log_id" columns={tableColumns} dataSource={tableData} loading={tableLoading}/>
        </>
    );
}

export default SystemManageJournal
