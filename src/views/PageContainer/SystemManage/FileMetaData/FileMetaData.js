import React, { useEffect, useState } from "react";
//全选之后有啥用，详情有啥用,。报警阈值不会做。处理按钮是用来修改的吗。删除没做。成功的提示没做。
import {
  Space,
  Form,
  Input,
  Button,
  Table,
  Checkbox,
  Radio,Divider,Modal,Tabs 
} from "antd";
import { SyncOutlined } from "@ant-design/icons";
import api from "../../../../api/log";
// import './FileMetaData.css'
const { TabPane } = Tabs;
// const { RangePicker } = DatePicker;
// const { Option } = Select;
// function onChange(e) {
//   console.log(`checked = ${e.target.checked}`);
// }


const SelectForm = (props) => {
  const [form] = Form.useForm();
  const [myself, setMyself] = useState(false);
  const [today, setToday] = useState(false);
  const [thisWeek, setThisWeek] = useState(false);

  const handleToday=e=>{
    setToday(true);
    setThisWeek(false);
    console.log("today:",today,".week:",thisWeek)
  }
  const handleWeek=e=>{
    setToday(false);
    setThisWeek(true);
    console.log("week:",thisWeek,".today:",today)
  }
  const handleRadio=e=>{
    console.log('radio checked',e.target.value)
    if(e.target.value===1){
      handleToday()
    }
    else if(e.target.value===2){
      handleWeek()
    }
  }
  const Search = () => {
    const data = {
      myself,
      today,
      thisWeek,
    };
    props.getSearch(data);
  };
  return (
    <>
      <Form form={form}>
        <Form.Item>
          <Button type="">查询日志</Button>
          <Input style={{ width: 600 }}></Input>
          {/* <Input style={{ width: 600 }} enterButton="查询日志"></Input> */}
        </Form.Item>
      </Form>
      <Form layout={"inline"} form={form}>
        <Form.Item>
          <Space>
            {/* <DataBindCheckbox></DataBindCheckbox> */}
          <Checkbox onChange={(e)=>{setMyself(e.target.checked)}}>
              查询操作人为您
            </Checkbox>
            <Radio.Group onChange={handleRadio}>
            <Radio value={1}>
              查询今天创建更新
            </Radio>
            <Radio value={2}>
              查询本周创建更新
            </Radio>
            </Radio.Group>
            <Button icon={<SyncOutlined />}>
              高级查询
            </Button>
            <Button onClick={()=>{setMyself(false);setToday(false);setThisWeek(false);Search();}}>重置</Button>
            <Button type="primary" onClick={Search}>
              查询
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

const tableData1=[
  {key:1,failure_name:"闪退",create_time:"2017-01-01",content:"闪选",user_name:"zyk"}
,  {key:2,failure_name:"重启",create_time:"2017-08-01",content:"dddd",user_name:"wlz"}
,  {key:3,failure_name:"崩溃",create_time:"2017-10-01",content:"噢哟",user_name:"lyh"}
]
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
      <Button style={{border:"1px solid blue"}} onClick={showModal}>
        处理
      </Button>
      <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="确定" cancelText="取消">
        <p>{props.record.failure_name}</p>
        <p>{props.record.user_name}</p>
        <p>{props.record.create_time}</p>
      </Modal>
    </>
  );
};

//删除操作
const deleteFuncElem=(aimedRowData)=>{
  // console.log(aimedRowData);
  const totalFuncDataList = tableData1;
  // console.log(totalFuncDataList);
  let i;
  let indexOfFuncList;
  for(i = 0; i <totalFuncDataList.length;i++) {
    if(aimedRowData.index=== totalFuncDataList[i].index) {
      break;
    }
  }
  // console.log(totalFuncDataList[i]);
  totalFuncDataList.splice(i+1,1);
  console.log(totalFuncDataList);
  // this.setState({
  //   data:totalFuncDataList
  // });
  // this.showTable(this.state.data);
}

const tableColumns = [
  {
    title: "故障名称",
    dataIndex: "failure_name",
    key: "failure_name",
  },
  {
    title: "时间",
    dataIndex: "create_time",
    key: "create_time",
  },
  {
    title: "操作描述",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "提交人",
    key: "user_name",
    dataIndex: "user_name",
  },
  {
    // title:"详情",
    key:"detail",
    dataIndex: "detail",
    render: () => (
      <Space size="middle">
        <a style={{textDecoration:"underline"}}>详情</a>
      </Space>)
  },{
    key:"handle",
    dataIndex: "handle",
    render: (_,record,index) => (//参数分别为当前行的值，当前行数据，行索引
      <>
      {/* <Space size="middle">
        <button onClick={()=>{console.log(index)}}>处理</button>
      </Space> */}
      <HandleModal record={record}></HandleModal>
    </>
      )
  },{
    key:"delete",
    dataIndex: "delete",
    render: (_,record) => (
      <Space size="middle">
        <Button style={{border:"1px solid blue"}} onClick={()=>{deleteFuncElem(record)}}>删除</Button>
      </Space>)
  }
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
};

const Demo = () => {
  return (
    <div className="card-container">
    <Tabs type="card">
      <TabPane tab="Tab Title 1" key="1">
        <p>Content of Tab Pane 1</p>
        <p>Content of Tab Pane 1</p>
        <p>Content of Tab Pane 1</p>
      </TabPane>
      <TabPane tab="Tab Title 2" key="2">
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
      </TabPane>
      <TabPane tab="Tab Title 3" key="3">
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
      </TabPane>
    </Tabs>
  </div>
  );
};
export default function FileMetaData() {
  const [tableData, setTableData] = useState([]);
  const getLog = (data) => {
    api
      .GetLog(data)
      .then((response) => {
        setTableData(response.data.data);
        console.log("response.data.data=", response.data.data);
      })
      .catch((error) => {});
  };
  const getSearchLog = (data) => {
    console.log(data);
    api.SearchLog(data).then((response) => {
        console.log("searchData=", response.data.data);
        setTableData(response.data.data);
      }).catch((error) => {});
  };
  useEffect(() => {
    getLog({});
  }, []);
  return (
    <>
      {/* <SelectForm getSearch={getSearchLog}></SelectForm> */}
      {/* <Table rowKey="log_id"         
      rowSelection={{
          type: selectionType,
          ...rowSelection,
      }} 
      columns={tableColumns} dataSource={tableData1} /> */}
      <Demo></Demo>
    </>
  );
}
