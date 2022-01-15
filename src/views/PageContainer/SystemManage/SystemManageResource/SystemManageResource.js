import React, { useEffect, useState } from "react";

import {DatePicker,Space,Form,Input,Button,Select,Table,Modal,Descriptions,Badge,Checkbox,
} from "antd";
import { getYMD, getTimeStamp } from "../../../../utils/TimeStamp";
import api from "../../../../api/comment";

import { CaretDownOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
const { Option } = Select;

const starList = ["全部", "1", "2", "3", "4", "5"];
const idList = ["全部", "证件号", "事项指南名称", "事项指南编码", "事项规则"];
const DropSelect = (props) => {
  const { dataList, setData } = props;
  const handleChange = (value) => {
    setData(value);
  };
  return (
    <Select
      defaultValue={dataList[0]}
      style={{ width: 120 }}
      onChange={handleChange}
    >
      {dataList.map((item, index) => {
        return (
          <Option value={index} key={index}>
            {item}
          </Option>
        );
      })}
    </Select>
  );
};
const tableColumns = [
  /**{
        title: '事项指南编码',
        dataIndex: 'item_guide_id',
        key: 'item_guide_id',
    },
    {
        title: '事项指南名称',
        dataIndex: 'item_guide_name',
        key: 'item_guide_name',
    },**/
  {
    title: "事项指南编码",
    dataIndex: ["item_guide", "item_guide_id"],
    key: "item_guide.item_guide_id",
  },
  {
    title: "事项指南名称",
    dataIndex: ["item_guide", "item_guide_name"],
    key: "item_guide.item_guide_name",
  },
  {
    title: "星级",
    dataIndex: "score",
    key: "score",
  },
  {
    title: "评价日期",
    key: "create_time",
    render: (text, record) => (
      <Space size="middle">{getYMD(record.create_time)}</Space>
    ),
  },
  {
    title: "查看详情",
    key: "detail",
    render: (text, record) => (
      <Space size="middle">
        <DetailModal itemDetail={record}></DetailModal>
      </Space>
    ),
  },
];

const SelectForm = (props) => {
  const [form] = Form.useForm();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [score, setScore] = useState("");
  const [type, setType] = useState("");
  const [typeData, setTypeData] = useState("");
  const formLayout = "inline";
  const paramTest = (param) => {
    return (event) => {
      props.getSearch(param);
    };
  };
  const handleInputChange = (e) => {
    setTypeData(e.target.value);
  };

  const Search = () => {
    const data = {
      startTime,
      endTime,
      score,
      type,
      typeData,
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
  };
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };
  return (
    <>
      {/* <Form
        // layout={formLayout}
        // form={form}
        // initialValues={{
        //   layout: formLayout,
        // }}
        // name="basic"
        // labelCol={{
        //   span: 8,
        // }}
        // wrapperCol={{
        //   span: 16,
        // }}
        // initialValues={{
        //   remember: true,
        // }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        // autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form> */}
          <Form {...layout} form={form} name="control-hooks">
      <Form.Item
        name="note"
        label="Note"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="gender"
        label="Gender"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="Select a option and change input text above"
          allowClear
        >
          <Option value="male">male</Option>
          <Option value="female">female</Option>
          <Option value="other">other</Option>
        </Select>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
      >
        {({ getFieldValue }) =>
          getFieldValue('gender') === 'other' ? (
            <Form.Item
              name="customizeGender"
              label="Customize Gender"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          ) : null
        }
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="button">
          Reset
        </Button>
        <Button type="link" htmlType="button">
          Fill form
        </Button>
      </Form.Item>
    </Form>     
    </>
  );
};

const DetailModal = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const detail = props.itemDetail;
  const key2name = {
    item_guide_name: "事项指南名称",
    item_guide_id: "事项指南编码",
    score: "星级",
    content: "评价内容",
    idc_type: "证件类型",
    idc: "证件号",
    rule_name: "事项规则",
    create_time: "创建时间",
  };
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
      <Button onClick={showModal}>查看详情</Button>
      <Modal
        title="事项详情"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >

      </Modal>
    </>
  );
};



export default function SystemManageResource() {
  const [tableData, setTableData] = useState([]);const getComment = (data) => {
    api
      .GetComment()
      .then((response) => {
        setTableData(response.data.data);
        console.log("response.data.data=", response.data.data);
      })
      .catch((error) => {});
  };
  const getSearchComment = (data) => {
    console.log(data);
    api
      .SearchComment(data)
      .then((response) => {
        console.log("searchData=", response.data.data);
        setTableData(response.data.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getComment({});
  }, []);
  return (
    <div>
      <Space direction="vertical" size={12}>
        <SelectForm getSearch={getSearchComment}></SelectForm>
        <Table columns={tableColumns} dataSource={tableData} />
      </Space>
      ,
    </div>
  );
}
