import React, {useEffect, useState} from 'react'
import {Alert, Button, Form, InputNumber, message, Space, Table, Tabs,} from 'antd'
import api from '../../../../api/systemBackup.js'

const {TabPane} = Tabs

// 变量
// 用于记录被选中行
let selectedRows = null

// 方法
// 删除操作
const deleteBackup = async aimedRowData => api.DeleteSystemBackup(aimedRowData).then()

// 组件声明
// SelectForm 备份周期表单
const SelectForm = () => {
  // 变量
  // 表单数据
  const [form] = Form.useForm()
  // 手动备份按钮禁用状态
  const [backupDisabled, setBackupDisabled] = useState(false)

  // 方法
  // 提交表单，修改备份周期
  const onFinish = values => api.ChangeBackupCycle(values).then(({data: {data, msg}}) => {
    if (data === 'success') message.success(msg).then()
    else message.error(msg).then()
  })
  // 手动备份按钮的动作，立即向服务器发送手动备份请求
  const backupNow = () => api.HandleBackup().then(({data}) => {
    if (typeof data === 'boolean')
      if (data) message.info('系统正在备份中，请勿重复备份').then()
      else message.success('备份成功，因备份时间较长，请稍后刷新页面查看备份').then()
    else message.error(`发生错误：${data}`).then()
  })

  // 组件初始化
  // 获取备份周期
  useEffect(() => {
    api.GetBackupCycle().then(({data: {data}}) => form.setFieldsValue({
      time: data
    }))
  }, [])

  return <>
    <Form name="setTime" form={form} layout={'inline'} onFinish={onFinish}>
      <Form.Item>
        <Button type="primary" onClick={() => {
          backupNow().then()
          setBackupDisabled(true)
        }} disabled={backupDisabled}>
          手动备份
        </Button>
      </Form.Item>
      <Form.Item>
        每
      </Form.Item>
      <Form.Item name="time">
        <InputNumber min={1}/>
      </Form.Item>
      <Form.Item>
        天系统自动备份一次
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          确认更改
        </Button>
      </Form.Item>
    </Form>
  </>
}

// 导出默认组件
export default function SystemManageBackup() {
  // 变量
  // 用于展示备份数据的表格
  const [tableData, setTableData] = useState()

  // 方法
  // 获取备份信息
  const getBackup = () => {
    api.GetBackup().then(response => setTableData(response.data.data))
  }

  // 组件初始化
  // 获取备份信息
  useEffect(getBackup, [])

  return <>
    <div id="backup">
      <div className="card-container">
        <Tabs
          type="card"
          tabBarExtraContent={<Space>
            <Button onClick={() => {
              if (selectedRows) Promise.all(selectedRows.map(row => deleteBackup(row))).then(() => {
                getBackup()
                message.success('批量删除备份成功').then()
              })
              else message.info('请选择要删除的备份').then()
            }}>批量删除</Button>
            <SelectForm/>
          </Space>}
        >
          <TabPane tab="数据库备份" key="1">
            <Table
              rowKey="_id" // by lhy 来自后人的一个 :) 明明数据返回的是 _id 硬生生写 log_id 成功让我在 rowSelection 卡了半天
              columns={[{
                title: '备份名称', dataIndex: 'backup_name', render(_, {backup_name, status}) {
                  return status === 'ok' ? backup_name : <Alert message="本次备份发生错误" type="error"/>
                }
              }, {title: '备份人', dataIndex: 'user_name'}, {
                title: '备份文件大小', dataIndex: 'file_size', render(_, {file_size}) {
                  // 服务器返回一个数字，表示备份文件的字节数，展示时使用合适单位
                  if (typeof file_size === 'number') {
                    if (file_size === 0) return ''
                    const power = Math.min(4, Math.floor(Math.log2(file_size) / 10))
                    return `${(file_size / Math.pow(1024, power)).toFixed(2)} ${['B', 'KB', 'MB', 'GB'][power]}`
                  }
                  return file_size // 一般是出错了才会执行到这里
                }
              }, {title: '备份时间', dataIndex: 'backup_date'}, {
                key: 'delete', dataIndex: 'delete', render: (_, record) => <Button
                  style={{border: '1px solid blue'}}
                  onClick={() => {
                    deleteBackup(record).then(message.success('删除备份成功.'))
                    getBackup()
                  }}
                >删除</Button>
              }]}
              dataSource={tableData}
              pagination={{
                // pageSize: 10, // by lhy 写了 pageSize 就要写 onShowSizeChange 回调啊
                showQuickJumper: true, pageSizeOptions: [10, 20, 50], showSizeChanger: true
              }}
              rowSelection={{
                type: 'checkbox', onChange(_, selectedRows_) {
                  selectedRows = selectedRows_
                }
              }}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  </>
}
