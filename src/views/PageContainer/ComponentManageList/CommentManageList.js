import React,{useEffect,useState} from 'react'

import { DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge  } from 'antd';
import api from "../../../api/comment";

import {
    CaretDownOutlined,
} from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { Option } = Select;

const starList=['全部','1','2','3','4','5']
const idList=['证件号','事项指南编码','事项编码','事项规则']
const DropSelect =(props)=> {
    const {dataList}=props
    return (
        <Select defaultValue={dataList[0]}  style={{ width: 120 }} >
            {
                dataList.map((item,index)=>{
                    return <Option value={index} key={index}>{item}</Option>
                })
            }

        </Select>
    )
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
        title: '星级',
        dataIndex: 'score',
        key: 'score',
    },
    {
        title: '评价内容',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: '评价内容',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: '查看详情',
        key: 'detail',
        render: (text, record) => (
            <Space size="middle">
                <DetailModal itemDetail={record}/>
            </Space>
        ),
    },
]

const SelectForm=()=>{
    const [form] = Form.useForm();
    const formLayout='inline'
    return(
        <>
            <Form
                layout={formLayout}
                form={form}
                initialValues={{
                    layout: formLayout,
                }}
            >
                <Form.Item label="起止日期">
                    <RangePicker />
                </Form.Item>
                <Form.Item label="星级排查">
                    <DropSelect dataList={starList}/>
                </Form.Item>
                <Form.Item label="编号排查">
                    <DropSelect dataList={idList}/>

                </Form.Item>
                <Form.Item >
                    <Input placeholder="请输入编号" size="middle" />
                </Form.Item>
                <Form.Item >
                    <Button type="primary">搜索</Button>
                </Form.Item>
            </Form>
        </>
    )
}

const DetailModal = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const detail=props.itemDetail
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
            <Button  onClick={showModal}>
                查看详情
            </Button>
            <Modal title="事项详情" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Descriptions>
                    {Object.keys(detail).map((item,index)=>{
                        return <Descriptions.Item label={item} span={3}>{detail[item]}</Descriptions.Item>
                    })}


                </Descriptions>
            </Modal>
        </>
    );
};

export default function CommentManageList() {
    const [tableData,setTableData]=useState([])
    const getComment=(data)=>{
        api.GetComment().then(response=>{
            setTableData(response.data.data)
            console.log(response.data.data)
        }).catch(error=>{
        })
    }
    useEffect(()=>{
        getComment({})
    },[])
    return (
    <div>
        <Space direction="vertical" size={12}>
            <SelectForm></SelectForm>
            <Table columns={tableColumns} dataSource={tableData} />

        </Space>,
    </div>
    )
}
