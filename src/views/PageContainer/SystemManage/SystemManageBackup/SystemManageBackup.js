import React, { useEffect, useState } from "react";
//
import {
  Space,
  Form,
  Input,
  PageHeader, Button, Descriptions,Table,Pagination,
  Checkbox,
  Radio,
  Divider,
  Modal,
  Tabs,
  DatePicker,
  Alert,
  message,
} from "antd";
import { getYMD, getTimeStamp } from "../../../../utils/TimeStamp";
import { SyncOutlined } from "@ant-design/icons";
import api from "../../../../api/systemBackup.js";
// import './SystemManageBackup.css'
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const SelectForm = (props) => {
  const [form] = Form.useForm();
/*  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [myself, setMyself] = useState(false);
  const [today, setToday] = useState(false);
  const [thisWeek, setThisWeek] = useState(false);

  const handleToday = (e) => {
    setToday(true);
    setThisWeek(false);
    console.log("today:", today, ".week:", thisWeek);
  };
  const handleWeek = (e) => {
    setToday(false);
    setThisWeek(true);
    console.log("week:", thisWeek, ".today:", today);
  };
  const handleRadio = (e) => {
    console.log("radio checked", e.target.value);
    if (e.target.value === 1) {
      handleToday();
    } else if (e.target.value === 2) {
      handleWeek();
    }
  };
  const Search = () => {
    const data = {
      myself,
      today,
      thisWeek,
    };
    props.getSearch(data);
  };
  const handleDateChange = (value, dateString) => {
    if (value) {
      setStartTime(getTimeStamp(dateString[0]));
      setEndTime(getTimeStamp(dateString[1]));
    } else {
      setEndTime("");
      setStartTime("");
    }
  };*/
  const onFinish=(values)=>{
    console.log('Success:',values)
    api.ChangeBackupCycle(values).then((res)=>{
      if(res.data.data==='success'){message.success(res.data.msg)}
      else{message.error(res.data.msg)}
    })
    // console.log(form.getFieldValue())
  }
/*  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  }*/
  const backupNow=()=>{
    message.success('备份')
  }
  useEffect(() => {
    api.GetBackupCycle().then((res)=>{
      // console.log('-----------------------')
      // console.log(res)
      form.setFieldsValue({
        time:res.data.data
      })
    })
  })
  return (
    <>
      <Form name="setTime" form={form} layout={"inline"} onFinish={onFinish}>
        {/* <Form.Item label="起止日期" layout={"inline"}>
          <RangePicker onChange={handleDateChange} />
        </Form.Item>
        <Form.Item label="备份名称">
          <Input></Input>
        </Form.Item>
        <Form.Item label="">
          <Button
            type="primary"
            onClick={() => {
              props.setVisible(true);
            }}
          >
            查询
          </Button>
        </Form.Item> */}
        <Form.Item>
              <Button type="primary" htmlType="" onClick={backupNow}>
                立即备份
              </Button>
        </Form.Item>
        <Form.Item>
          每
        </Form.Item>
        <Form.Item name="time">
          <Input //addonBefore="每" addonAfter="小时系统自动备份一次"
            style={{ width: "40px" }}
          ></Input>
        </Form.Item>
        <Form.Item>
          小时系统自动备份一次
        </Form.Item>
        <Form.Item>
              <Button type="primary" htmlType="submit">
                确认更改
              </Button>
        </Form.Item>
      </Form>
    </>
  );
};

const tableData1 = [
  {
    key: 1,
    failure_name: "闪退",
    create_time: "2017-01-01",
    content: "闪选",
    user_name: "zyk",
  },
  {
    key: 2,
    failure_name: "重启",
    create_time: "2017-08-01",
    content: "dddd",
    user_name: "wlz",
  },
  {
    key: 3,
    failure_name: "崩溃",
    create_time: "2017-10-01",
    content: "噢哟",
    user_name: "lyh",
  },
];
const pagination1=()=>{
  return (
    <Pagination size="small" total={50} showSizeChanger showQuickJumper />
  )
}
//弹窗Modal
const HandleModal = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button style={{ border: "1px solid blue" }} onClick={showModal}>
        处理
      </Button>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <p>{props.record.failure_name}</p>
        <p>{props.record.user_name}</p>
        <p>{props.record.create_time}</p>
      </Modal>
    </>
  );
};

//删除操作
const deleteFuncElem = (aimedRowData) => {
  // console.log(aimedRowData);
  const totalFuncDataList = tableData1;
  // console.log(totalFuncDataList);
  let i;
  let indexOfFuncList;
  for (i = 0; i < totalFuncDataList.length; i++) {
    if (aimedRowData.index === totalFuncDataList[i].index) {
      break;
    }
  }
  // console.log(totalFuncDataList[i]);
  totalFuncDataList.splice(i + 1, 1);
  console.log(totalFuncDataList);
  // this.setState({
  //   data:totalFuncDataList
  // });
  // this.showTable(this.state.data);
};

const tableColumns = [
  {
    title: "备份名称",
    dataIndex: "failure_name",
    key: "failure_name",
  },
  {
    title: "时间",
    dataIndex: "create_time",
    key: "create_time",
  },
  {
    title: "备份人",
    key: "user_name",
    dataIndex: "user_name",
  },
  {
    key: "handle",
    dataIndex: "handle",
    render: (
      _,
      record,
      index //参数分别为当前行的值，当前行数据，行索引
    ) => (
      <>
        {/* <Space size="middle">
        <button onClick={()=>{console.log(index)}}>处理</button>
      </Space> */}
        {/* <HandleModal record={record}></HandleModal> */}
        <Space size="middle">
        <Button
          style={{ border: "1px solid blue" }}
          onClick={() => {
            deleteFuncElem(record);
          }}
        >
          下载
        </Button>
      </Space>
      </>
      
    ),
  },
  {
    key: "delete",
    dataIndex: "delete",
    render: (_, record) => (
      <Space size="middle">
        <Button
          style={{ border: "1px solid blue" }}
          onClick={() => {
            deleteFuncElem(record);
          }}
        >
          删除
        </Button>
      </Space>
    ),
  },
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    // Column configuration not to be checked
    name: record.name,
  }),
};

const Demo = () => {
  const [visible, setVisible] = useState(false);
  const [selectionType, setSelectionType] = useState('checkbox');
  return (
    <>
      {visible ? (
        <Alert message="Warning" type="warning" showIcon closable />
      ) : null}
      <div className="card-container">
        <Tabs
          type="card"
          tabBarExtraContent={<SelectForm setVisible={setVisible}></SelectForm>}
        >
          <TabPane tab="数据库备份" key="1">
            <Table
              rowKey="log_id"
              // rowSelection={{
              //   type: selectionType,
              //   ...rowSelection,
              // }}
              columns={tableColumns}
              dataSource={tableData1}
              pagination={{ pageSize: 10,showQuickJumper:true,pageSizeOptions:[10,20,50],showSizeChanger:true }}
            />
          </TabPane>
          <TabPane tab="文件备份" key="2">
            <p>Content of Tab Pane 2</p>
            <p>Content of Tab Pane 2</p>
            <p>Content of Tab Pane 2</p>
          </TabPane>
          <TabPane tab="日志备份" key="3">
            <p>Content of Tab Pane 3</p>
            <p>Content of Tab Pane 3</p>
            <p>Content of Tab Pane 3</p>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};
export default function SystemManageBackup() {
  // const [tableData, setTableData] = useState([]);
  // const getLog = (data) => {
  //   api
  //     .GetLog(data)
  //     .then((response) => {
  //       setTableData(response.data.data);
  //       console.log("response.data.data=", response.data.data);
  //     })
  //     .catch((error) => {});
  // };
  // const getSearchLog = (data) => {
  //   console.log(data);
  //   api
  //     .SearchLog(data)
  //     .then((response) => {
  //       console.log("searchData=", response.data.data);
  //       setTableData(response.data.data);
  //     })
  //     .catch((error) => {});
  // };
  // useEffect(() => {
  //   getLog({});
  // }, []);
  return (
    <div id="backup">
      <Demo></Demo>
    </div>
  );
}
