import React, {useEffect, useState} from 'react'
import {message, Table,} from 'antd'
import api from '../../../../api/log'
import FunctionalZone from './components/FunctionalZone'

const tableColumns = [
  {
    title: '编号',
    dataIndex: 'log_id',
    key: 'log_id',
    width: 100
  },
  {
    title: '时间',
    dataIndex: 'create_time',
    key: 'create_time',
    width: 180
  },
  {
    title: '操作描述',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '操作人',
    key: 'user_name',
    dataIndex: 'user_name',
    width: 100
  },
  {
    title: '账号',
    key: 'idc',
    dataIndex: 'idc',
  },
  {title: 'IP', key: 'ip', dataIndex: 'ip'}
]
//React.CreateContext是跨组件传递的内容组件，该组件导出两个对象，Provider提供数据，Consumer消费数据
export const journalContext = React.createContext(undefined)

function SystemManageJournal() {
  // 定义状态
  // useState 的参数为状态初始值，setTableData为变更状态值的方法(初始化两个参数)
  const [tableData, setTableData] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  // console.log(tableData)
  useEffect(() => {
    getLog({})
  }, [])

  // 获取全部日志
  const getLog = (data) => {
    api.GetLog(data).then((response) => {
      setTableData(response.data.data)
      // console.log(response.data.data)
    }).catch(() => {
      message.error('获取系统日志失败，请稍后尝试')
    })
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
  )
}

export default SystemManageJournal
