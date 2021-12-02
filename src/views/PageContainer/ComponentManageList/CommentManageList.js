import React,{useEffect,useState} from 'react'

import { DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge  } from 'antd';
import {getYMD,getTimeStamp} from "../../../utils/TimeStamp";
import api from "../../../api/comment";

import {
    CaretDownOutlined,
} from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { Option } = Select;

const starList=['全部','1','2','3','4','5']
const idList=['全部','证件号','事项指南名称','事项指南编码','事项规则']
const DropSelect =(props)=> {
    const {dataList,setData}=props
    const handleChange=(value)=>{
        setData(value)

    }
    return (
        <Select defaultValue={dataList[0]}  style={{ width: 120 }} onChange={handleChange}>
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
        title: '事项指南编码',
        dataIndex: ['item_guide','item_guide_id'],
        key: 'item_guide.item_guide_id',
    },
    {
        title: '事项指南名称',
        dataIndex: ['item_guide','item_guide_name'],
        key: 'item_guide.item_guide_name',
    },
    {
        title: '星级',
        dataIndex: 'score',
        key: 'score',
    },
    {
        title:'评价日期',
        key:'create_time',
        render:(text,record)=>(
            <Space size="middle">
                {getYMD(record.create_time)}
            </Space>
        )
    },
    {
        title: '查看详情',
        key: 'detail',
        render: (text, record) => (
            <Space size="middle">
                <DetailModal itemDetail={record}></DetailModal>
            </Space>
        ),
    },
]

const SelectForm=(props)=>{
    const [form] = Form.useForm();
    const [startTime,setStartTime]=useState('')
    const [endTime,setEndTime]=useState('')
    const [score,setScore]=useState('')
    const [type,setType]=useState('')
    const [typeData,setTypeData]=useState('')
    const formLayout='inline'
    const paramTest=(param)=>{
        return (event)=>{

            props.getSearch(param)
        }
    }
    const handleInputChange=(e)=>{
        setTypeData(e.target.value)

    }

    const Search=()=>{

        const data={
            startTime,
            endTime,
            score,
            type,
            typeData
        }
        props.getSearch(data)
    }
    const handleDateChange=(value, dateString)=>{
        if (value){

            setStartTime(getTimeStamp(dateString[0]))
            setEndTime(getTimeStamp(dateString[1]))
        }
        else{
            setEndTime('')
            setStartTime('')
        }

    }
    return(
        <>
            <Form
                layout={formLayout}
                form={form}
                initialValues={{
                    layout: formLayout,
                }}
            >
                <Form.Item label="起止日期" >
                    <RangePicker onChange={handleDateChange}/>
                </Form.Item>
                <Form.Item label="星级排查" name="score">
                    <DropSelect dataList={starList} setData={setScore}/>
                </Form.Item>
                <Form.Item label="编号排查">
                    <DropSelect dataList={idList} setData={setType}/>

                </Form.Item>
                <Form.Item >
                    <Input placeholder="请输入编号" size="middle" onChange={handleInputChange} />
                </Form.Item>
                <Form.Item >
                    <Button type="primary" onClick={Search}>搜索</Button>
                </Form.Item>
            </Form>
        </>
    )
}

const DetailModal = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const detail=props.itemDetail
    const key2name={
        item_guide_name:'事项指南名称',
        item_guide_id:'事项指南编码',
        score:'星级',
        content:'评价内容',
        idc_type:'证件类型',
        idc:'证件号',
        rule_name:'事项规则',
        create_time: '创建时间'
    }
    const detailData={
        item_guide_name:detail.item_guide.item_guide_name,
        item_guide_id:detail.item_guide.item_guide_id,
        score:detail.score,
        content:detail.content,
        create_time:getYMD(detail.create_time),
        rule_name:detail.rule.rule_name,
        idc_type:detail.idc_type,
        idc:detail.idc,

    }
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
                {Object.keys(detailData).map((item,index)=>{

                    return  <Descriptions.Item label={key2name[item]} key={item} span={3}>{detailData[item]}</Descriptions.Item>
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
            console.log('response.data.data=',response.data.data)
        }).catch(error=>{
        })
    }
    const getSearchComment=(data)=>{
        console.log(data)
        api.SearchComment(data).then(response=>{
            console.log('searchData=',response.data.data)
            setTableData(response.data.data)
        }).catch(error=>{
        })

    }

    useEffect(()=>{
        getComment({})
    },[])
    return (
    <div>
        <Space direction="vertical" size={12}>
            <SelectForm getSearch={getSearchComment}></SelectForm>
            <Table columns={tableColumns} dataSource={tableData} />

        </Space>,
    </div>
    )
}
