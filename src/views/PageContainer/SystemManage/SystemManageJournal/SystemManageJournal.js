import React, { useEffect, useState } from "react";

import {
  Space,
  Form,
  Input,
  Button,
  Table,
  Checkbox,
  Radio
} from "antd";
import { SyncOutlined } from "@ant-design/icons";
import api from "../../../../api/log";
// const { RangePicker } = DatePicker;
// const { Option } = Select;
// function onChange(e) {
//   console.log(`checked = ${e.target.checked}`);
// }

class DataBindCheckbox extends React.Component{
  constructor(){
      super()
      this.state = {
          value: false
      }
  }
  handleChange(e){
      this.setState({
          value : e.target.value
      })
  }
  
  render(){
      return(
            <div>
                <Checkbox value={this.state.value} onChange={this.handleChange.bind(this)}>bind</Checkbox>
                <p>{this.state.value}</p>
            </div>      
      )
  }
}

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
const tableColumns = [
  {
    title: "标号",
    dataIndex: "log_id",
    key: "log_id",
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
    title: "操作人",
    key: "user_name",
    dataIndex: "user_name",
  },
  {
    title: "手机号",
    key: "idc",
    dataIndex: "idc",
  },
];

export default function SystemManageJournal() {
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
      <SelectForm getSearch={getSearchLog}></SelectForm>
      <Table rowKey="log_id" columns={tableColumns} dataSource={tableData} />
    </>
  );
}
