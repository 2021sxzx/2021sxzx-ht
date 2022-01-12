import React, { useEffect, useState } from "react";

import {
  DatePicker,Space,Form,Input,Button,Select,Table,Modal,Descriptions,Badge,Checkbox,Tag,
} from "antd";
import {SyncOutlined } from "@ant-design/icons";
import api from "../../../../api/log";
import Search from "antd/lib/transfer/search";
// const { RangePicker } = DatePicker;
// const { Option } = Select;

const SelectForm = (props) => {
    const [form]=Form.useForm();
    const [myself,setMyself]=useState('')
    const [today,setToday]=useState('')
    const [thisWeek,setThisWeek]=useState('')

    const Search=()=>{
        const data={
            myself,today,thisWeek
        }
        props.getSearch(data)
    }
  return (
    <Form>
      <Form.Item>
        <Button type="">查询日志</Button>
        <Input style={{ width: 600 }} enterButton="查询日志"></Input>
      </Form.Item>
      <Form.Item>
        <Space>
          <Checkbox type="" setData={setMyself}>
            查询操作人为您
          </Checkbox>
          <Checkbox type="" setData={setToday}>
            查询今天创建更新
          </Checkbox>
          <Checkbox type="" setData={setThisWeek}>
            查询本周创建更新
          </Checkbox>
          <Button type="" icon={<SyncOutlined />}>
            高级查询
          </Button>
          <Button type="">重置</Button>
          <Button type="primary" onClick={Search}>查询</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
const LogList = (props) => {};
const tableColumns = [
  {
    title: "标号",
    dataIndex: "Index",
    key: "Index",
  },
  {
    title: "时间",
    dataIndex: "Time",
    key: "Time",
  },
  {
    title: "操作描述",
    dataIndex: "Description",
    key: "Description",
  },
  {
    title: "操作人",
    key: "Operator",
    dataIndex: "Operator",
  },
  {
    title: "身份证号",
    key: "IdNumber",
    dataIndex: "IdNumber",
  },
];
const data = [
  {
    Index: 1,
    Time: "21.10.02",
    Description: "用户登入",
    Operator: "zyk",
    IdNumber: "445381",
  },
  {
    Index: 2,
    Time: "21.10.05",
    Description: "用户登出",
    Operator: "zyk",
    IdNumber: "445381",
  },
  {
    Index: 3,
    Time: "21.10.02",
    Description: "用户登入",
    Operator: "wlz",
    IdNumber: "445389",
  },
];
export default function SystemManageJournal() {
    const [tableData,setTableData]=useState([])
    const getLog=(data)=>{
        api.getLog(data).then(response=>{
            setTableData(response.data.data)
            console.log('response.data.data=',response.data.data)
        }).catch(error=>{})
    }
    const getSearchLog=(data)=>{
        console.log(data)
        api.SearchLog(data).then(response=>{
            console.log('searchData=',response.data.data)
            setTableData(response.data.data)
        }).catch(error=>{})
    }
    // useEffect(()=>{
    //     getLog({})
    // },[])
  return (
    <>
      <SelectForm getSearch={getSearchLog}></SelectForm>
      <Table columns={tableColumns} dataSource={data} />
    </>
  );
}
