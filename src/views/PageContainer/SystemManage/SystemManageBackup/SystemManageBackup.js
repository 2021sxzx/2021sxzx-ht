import React, {useEffect, useState} from "react";
import {
  Space, Form, Button, Table, Tabs, message, InputNumber,
} from "antd";
import api from "../../../../api/systemBackup.js";

const {TabPane} = Tabs;

// 变量
// 用于记录被选中行
let selectedRows = null;

// 方法
// 删除操作
const deleteBackup = async (aimedRowData) => {
  api.DeleteSystemBackup(aimedRowData).then();
};

// 组件声明
// SelectForm 备份周期表单
const SelectForm = () => {
  // 变量
  // 表单数据
  const [form] = Form.useForm();

  // 方法
  // 提交表单，修改备份周期
  const onFinish = (values) => {
    api.ChangeBackupCycle(values).then((res) => {
      /** @property res.data.msg */
      if (res.data.data === 'success') {
        message.success(res.data.msg).then();
      } else {
        message.error(res.data.msg).then();
      }
    })
  }
  // 手动备份按钮的动作，立即向服务器发送手动备份请求
  const backupNow = () => {
    api.HandleBackup().then(() => {
      message.success('备份成功，因备份时间较长，请稍后刷新页面查看备份').then();
    })
  }

  // 组件初始化
  // 获取备份周期
  useEffect(() => {
    api.GetBackupCycle().then((res) => {
      form.setFieldsValue({
        time: res.data.data
      })
    })
  })

  return (<>
    <Form name="setTime" form={form} layout={"inline"} onFinish={onFinish}>
      <Form.Item>
        <Button type="primary" onClick={backupNow}>
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
  </>);
};

// 导出默认组件
export default function SystemManageBackup() {
  // 变量
  // 用于展示备份数据的表格
  const [tableData, setTableData] = useState();

  // 方法
  // 获取备份信息
  const getBackup = () => {
    api.GetBackup().then(response => {
      setTableData(response.data.data);
    });
  };

  // 组件初始化
  // 获取备份信息
  useEffect(getBackup, []);

  return <>
    <div id="backup">
      <div className="card-container">
        <Tabs
          type="card"
          tabBarExtraContent={<Space>
            <Button onClick={() => {
              if (selectedRows) Promise.all(selectedRows.map(row => deleteBackup(row))).then(() => {
                getBackup();
                message.success("批量删除备份成功").then();
              });
              else message.info("请选择要删除的备份").then();
            }}>批量删除</Button>
            <SelectForm/>
          </Space>}
        >
          <TabPane tab="数据库备份" key="1">
            <Table
              rowKey="_id" // by lhy 来自后人的一个 :) 明明数据返回的是 _id 硬生生写 log_id 成功让我在 rowSelection 卡了半天
              columns={[{title: "备份名称", dataIndex: "backup_name"}, {title: "备份人", dataIndex: "user_name"}, {
                title: "备份文件大小", dataIndex: "file_size", render: (_, record) => {
                  // 服务器返回一个数字，表示备份文件的字节数，展示时使用合适单位
                  if (typeof record['file_size'] === 'number') {
                    const power = Math.min(4, Math.floor(Math.log2(record['file_size']) / 10));
                    return `${(record['file_size'] / Math.pow(1024, power)).toFixed(2)} ${['B', 'KB', 'MB', 'GB'][power]}`
                  }
                  return record['file_size'];
                }
              }, {
                key: "delete", dataIndex: "delete", render: (_, record) => <Button
                  style={{border: "1px solid blue"}}
                  onClick={() => {
                    deleteBackup(record).then(message.success('删除故障成功.'));
                    getBackup();
                  }}
                >删除</Button>
              }]}
              dataSource={tableData}
              pagination={{
                // pageSize: 10, // by lhy 写了 pageSize 就要写 onShowSizeChange 回调啊
                showQuickJumper: true,
                pageSizeOptions: [10, 20, 50],
                showSizeChanger: true
              }}
              rowSelection={{
                type: "checkbox", onChange(_, selectedRows_) {
                  selectedRows = selectedRows_;
                  console.log(selectedRows);
                }
              }}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  </>;
}
