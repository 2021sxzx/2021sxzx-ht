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

const SelectForm = (props) => {
  const [topForm] = Form.useForm();
  const [underForm] = Form.useForm();
  const [myself, setMyself] = useState(false);
  const [myselfID, setMyselfID] = useState('');
  const [today, setToday] = useState(false);
  const [thisWeek, setThisWeek] = useState(false);
  const [groupVal, setGroupVal] = useState(0);

  const handleToday=e=>{
    setToday(true);
    setThisWeek(false);
    // console.log("today:",today,".week:",thisWeek)
  }
  const handleWeek=e=>{
    setToday(false);
    setThisWeek(true);
    // console.log("week:",thisWeek,".today:",today)
  }
  const handleRadio=(e)=>{
    // console.log('value:',val)
    // if (val === 4) {
    //   setToday(false);
    //   setThisWeek(false);
    // }
    // console.log('radio checked',e.target.value);
    setGroupVal(e.target.value);
    if(e.target.value===1){
      handleToday()
    }
    else if(e.target.value===2){
      handleWeek()
    }
  }
  const Search = () => {
    // console.log('::',myself,'--',myselfID)
    const data = {
      myselfID,
      today,
      thisWeek,
    };
    // console.log(data)
    props.getSearch(data);
  };
  const onReset = () => {
    topForm.resetFields();
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };
  return (
    <>
      {/* <Form form={topForm} layout="inline">
          <Form.Item>
            <Button htmlType="button" onClick={onReset}>查询日志</Button>
          </Form.Item>
          <Form.Item name="InputSearch">
            <Input style={{width: 600}} /> */}
      {/* <Input style={{ width: 600 }} enterButton="查询日志"></Input> */}
      {/* </Form.Item>
        </Form> */}
      <Form layout={"inline"} form={underForm}>
        <Form.Item>
          <Space>
            {/* <DataBindCheckbox></DataBindCheckbox> */}
            <Checkbox
              onChange={(e) => {
                setMyself(e.target.checked);
                // console.log('1:',myself,e.target.checked)
                if (e.target.checked) {
                  setMyselfID(localStorage.getItem("_id"));
                } else {
                  // console.log('2',myself,e.target.checked)
                  setMyselfID("");
                }
                // console.log('3')
                // console.log('myself:',myself,' myselfID:',myselfID)
              }
            }
            checked={myself}
            >
              查询操作人为您
            </Checkbox>
            <Radio.Group onChange={handleRadio} value={groupVal}>
              <Radio value={1}>查询今天创建更新</Radio>
              <Radio value={2}>查询本周创建更新</Radio>
            </Radio.Group>
            {/* <Button icon={<SyncOutlined />}>高级查询</Button> */}
            <Form.Item>
              <Button
                htmlType="button"
                onClick={() => {
                  // topForm.resetFields();
                  setMyself(false);
                  setToday(false);
                  setThisWeek(false);
                  setMyselfID('');
                  // console.log(myself, today, thisWeek);
                  setGroupVal(0);
                }}
              >
                重置
              </Button>
            </Form.Item>
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
    width:100
  },
  {
    title: "时间",
    dataIndex: "create_time",
    key: "create_time",
    width:180
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
    width:100
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
          // console.log("response.data.data=", response.data.data);
        })
        .catch((error) => {});
  };
  const getSearchLog = (data) => {
    // console.log(data);
    api.SearchLog(data).then((response) => {
      // console.log("searchData=", response.data.data);
      setTableData(response.data.data);
    }).catch((error) => {});
  };
  useEffect(() => {
    getLog({});
  }, []);
  return (
      <>
        <SelectForm getSearch={getSearchLog}/>
        <Table rowKey="log_id" columns={tableColumns} dataSource={tableData} />
      </>
  );
}
