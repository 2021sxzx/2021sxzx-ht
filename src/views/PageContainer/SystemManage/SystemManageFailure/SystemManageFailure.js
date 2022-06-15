import React, {useEffect, useState} from "react";
//全选之后有啥用，详情有啥用,。报警阈值不会做。处理按钮是用来修改的吗。删除没做。成功的提示没做。
//点击处理之后，要刷新一下界面才能变为“已处理”
//下一步，拿到表单信息
import {
    Space,
    Form,
    Input,
    Button,
    Table,
    Checkbox,
    Radio, Divider, Modal, Alert, Row, Col, Upload, message, Image
} from "antd";

const {TextArea} = Input;
import {UploadOutlined} from "@ant-design/icons";
import api from "../../../../api/systemFailure";
import emitter from "./ev"
import FormItem from "antd/lib/form/FormItem";

// const   tableColumns = [
//   {
//     title: "故障名称",
//     dataIndex: "failure_name",
//     key: "failure_name",
//   },
//   {
//     title: "时间",
//     dataIndex: "failure_time",
//     key: "failure_time",
//   },
//   {
//     title: "操作描述",
//     dataIndex: "failure_des",
//     key: "failure_des",
//   },
//   {
//     title: "提交人",
//     key: "user_name",
//     dataIndex: "user_name",
//   },
//   {
//     // title:"详情",
//     key:"detail",
//     dataIndex: "detail",
//     render: (_,record,index) => (
//       <Space size="middle">
//       <HandleModal record={record}></HandleModal>
//       </Space>)
//   },
//   // {
//   //   key:"handle",
//   //   dataIndex: "handle",
//   //   render: (_,record,index) => (//参数分别为当前行的值，当前行数据，行索引
//   //     <>
//   //     <Space size="middle">
//   //       <Button style={{border:"1px solid blue"}} onClick={()=>{console.log(tableData1[index].content);tableData1[index].content='已处理'}}>
//   //       处理
//   //       </Button>
//   //     </Space>
//   //     {/* <HandleModal record={record}></HandleModal> */}
//   //   </>
//   //     )
//   // },
//   {
//     key:"delete",
//     dataIndex: "delete",
//     render: (_,record) => (
//       <Space size="middle">
//         <Button style={{border:"1px solid blue"}} onClick={()=>{deleteFuncElem(record);console.log(failureData)}}>删除</Button>
//       </Space>)
//   }
// ];

// var fresh=true;//用来检测是否刷新

//详情的弹窗Modal
const HandleModal = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pictureList, setPictureList] = useState(props.record.failure_picture);
    const [failureData, setFailureData] = useState([]);
    // console.log(pictureList);
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    useEffect(() => {
        setPictureList(props.record.failure_picture)
    }, [props.record])
    // import img from "../../../../../../2021sxzx-server/upload/14549661650612887195.jpg";
    return (
        <>
            {/* <Button type="link" style={{color:"yellow",textDecoration:"underline"}}>详情</Button>
      <button style={{textDecoration:"underline"}}>underline</button> */}
            <a style={{textDecoration: "underline"}} onClick={showModal}>详情</a>
            <Modal title="故障详情" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="确定"
                   cancelText="取消">
                <h2>故障名称：{props.record.failure_name}</h2>
                <p>故障描述：{props.record.failure_des}</p>
                <Image.PreviewGroup>
                    {
                        pictureList.map(item => {
                            // return (<><h6>{item.url}</h6></>)
                            // return (<><h6>{item.url}</h6><Image src={require().default}/></>)
                            return (<><Image src={"http://localhost:5001/api/v1/get-picture" + "?url=" + item.url}/></>)
                            // return (<><h6>{item.url}</h6><Image src={"http://localhost:5001/api/v1/get-picture"+"?url="+item.url}/></>)
                        })
                    }
                </Image.PreviewGroup>
                <h6>{props.record.failure_time}</h6>
                {/* <p>{props.record}</p> */}
            </Modal>
        </>
    );
};

//删除操作
const deleteFuncElem = async (aimedRowData) => {
    // console.log(aimedRowData);
    api.DeleteSystemFailure(aimedRowData).then(message.success('删除故障成功.'));
    // const totalFuncDataList = tableData1;
    // console.log(totalFuncDataList);
    // let i;
    // let indexOfFuncList;
    // for(i = 0; i <totalFuncDataList.length;i++) {
    //   if(aimedRowData.index=== totalFuncDataList[i].index) {
    //     break;
    //   }
    // }
    // console.log(totalFuncDataList[i]);
    // totalFuncDataList.splice(i+1,1);
    // console.log(totalFuncDataList);
    // this.setState({
    //   data:totalFuncDataList
    // });
    // this.showTable(this.state.data);
}

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {//点前面的checkbox拿到当行的数据和index
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({//选择框的默认属性配置,目前没啥用
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
    }),
};
/**
 * 消息弹框
 * @returns null
 */
var HandleAlertBox = (isShow, type, message) => {
    emitter.emit("alert", isShow, type, message)
}
const AlertBox = () => {//有四种样式 success、info、warning、error。
    const [show, setShow] = useState(false)
    const [type, setType] = useState(null)
    const [message, setMessage] = useState(null)
    useEffect(() => {
        var eventEmitter = emitter.addListener("alert", (isShow, type, message) => {
            setShow(isShow)
            setType(type)
            setMessage(message)
            // console.log(isShow)
            // console.log(type)
        })
    })
    return (
        <div style={{display: show ? "block" : "none"}}>
            <Alert message={message} type={type}/>
        </div>
    )
}

//提交故障的按钮以及弹窗
const SubmitFailure = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm(); //用于之后取数据
    const formRef = React.createRef();
    const [failurePicture, setFailurePicture] = useState([]);
    // const [pictureList,setPictureList]=useState([]);
    const [failure, setFailure] = useState({});
    const showModal = () => {
        setIsModalVisible(true);
    };

    const onFinish = async (values) => {
        // console.log(form.getFieldsValue(true))
        // console.log(form.getFieldValue('failureName'));
        // setIsModalVisible(false);
        let data = form.getFieldsValue();
        // console.log(data)
        // console.log('data.failure_name:',data.failureName,'||data.failure_des:',data.failureDes)
        if (data.failureName === undefined || data.failureDescription === undefined || data.failureName === '' || data.failureDescription === '') {
            // console.log('data.failure_name:',data.failureName,'||data.failure_des:',data.failureDes)
            message.error('请完善故障名称或者故障描述')
            return false;
        }
        data.user_name = localStorage.getItem('role_name');
        data.create_time = new Date(new Date().getTime() + 8 * 3600 * 1000);
        data.fileSizeList = [];
        // props.setFresh(!props.fresh)
        // console.log('fresh:',props.fresh)
        // setFailure(data);
        // console.log('failure')
        // console.log(failure)
        // console.log('Success:', form.getFieldsValue());
        if (failurePicture != []) {
            const FailurePictureFormData = new FormData();
            failurePicture.forEach(file => {
                FailurePictureFormData.append('file', file);
                data.fileSizeList.push(file.size)
            })
            // console.log('FailurePictureFormData.file:',FailurePictureFormData.get('file'))
            // console.log('fileSizeList:',data.fileSizeList)
            fetch('http://localhost:5001/api/v1/system-failure-picture-upload', {
                method: 'POST',
                body: FailurePictureFormData,
                mode: "cors",
                // headers: {
                //   "Content-Type": "multipart/form-data",
                // },
            })
                .then(res => {
                    res.json().then((res) => {
                        // console.log("res:");console.log(res);
                        data.pictureList = res;
                        api.CreateSystemFailure(data).then(props.getFailure());
                    })
                })//上传图片接口返回的res信息，有需要就返回
                // .then(res => console.log('res:',res.json()))//上传图片接口返回的res信息，有需要就返回
                .then(() => {
                    //上传之后删除浏览器的图片，这里好像失败了没清除也没关闭弹窗
                    setFailurePicture([]);
                    form.resetFields();
                    // console.log("form.getFieldsValue()")
                    // console.log(form.getFieldsValue())
                    // console.log(formRef.current.resetFields())
                    // formRef.current.resetFields();
                    // FailurePictureFormData = new FormData();
                    setIsModalVisible(false);
                    // console.log('first')
                    // props.getFailure();
                    message.success('提交故障成功.');
                })
                // .then(() => {console.log('second');props.getFailure()})
                .catch((e) => {
                    console.log(e)
                    message.error('提交故障失败.');
                })
        }
        // data.pictureList=pictureList
        // console.log('setPictureList')
        // data.test='Test'
        // console.log('Finish:', formRef.current?.getFieldsValue());
    };

    const handleCancel = () => {
        setFailurePicture([]);
        form.resetFields();
        setIsModalVisible(false);
    };

    return (
        <>
            {/* <Button type="link" style={{color:"yellow",textDecoration:"underline"}}>详情</Button>
      <button style={{textDecoration:"underline"}}>underline</button> */}
            {/* <a style={{textDecoration:"underline"}} onClick={showModal}>详情</a> */}
            <Button type="primary" size="large" onClick={showModal}>
                故障提交
            </Button>
            <Modal
                title="故障提交"
                visible={isModalVisible}
                onOk={onFinish}
                onCancel={handleCancel}
                okText="提交"
                cancelText="取消"
            >
                <Form ref={formRef} form={form} name="createSystemFailure" onFinish={onFinish}>
                    <Form.Item label="故障名称" name="failureName"
                               rules={[{required: true, message: '请输入故障名称!'}]}>
                        <Input placeholder="请输入名称"/>
                    </Form.Item>
                    <Form.Item label="故障描述" name="failureDescription"
                               rules={[{required: true, message: '请输入故障描述!'}]}>
                        <TextArea rows={4} showCount maxLength={100}/>
                    </Form.Item>
                    <Form.Item label="故障截图" name="failurePicture" rules={[{required: true, message: '请输入故障描述!'}]}>
                        <Upload
                            listType="picture"
                            beforeUpload={(file) => {
                                // console.log("--------",file.type)
                                // console.log(failurePicture)
                                // const isPNG = file.type === 'image/png';
                                // if (!isPNG) {
                                //   message.error(`${file.name}不是jpg格式`);
                                //   return Upload.LIST_IGNORE
                                // }
                                setFailurePicture([...failurePicture, file])
                                return false;
                            }}
                            onRemove={(file) => {
                                // console.log('remove')
                                // console.log(failurePicture)
                                const index = failurePicture.indexOf(file);
                                // console.log(index)
                                const newFileList = failurePicture.slice();
                                newFileList.splice(index, 1);
                                // failurePicture.slice(index, 1);
                                // console.log(newFileList)
                                // console.log(failurePicture)
                                setFailurePicture(newFileList)
                                // console.log(failurePicture)
                            }}
                            fileList={failurePicture}
                            name="failurePicture"
                            maxCount={6}>
                            <Button icon={<UploadOutlined/>}>Upload</Button>
                            {/* {localStorage.getItem('_id')} */}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
    return (
        <Button type="primary" size="large" onClick={() => {
            HandleInputModal("true", "error", "Done")
        }}>故障提交</Button>
    )
}

const Demo = () => {
    const [selectionType, setSelectionType] = useState('checkbox');
    const [failureData, setFailureData] = useState([]);
    const [fresh, setFresh] = useState(true);
    const tableColumns = [
        {
            title: "故障名称",
            dataIndex: "failure_name",
            key: "failure_name",
        },
        {
            title: "时间",
            dataIndex: "failure_time",
            key: "failure_time",
        },
        {
            title: "操作描述",
            dataIndex: "failure_des",
            key: "failure_des",
        },
        {
            title: "提交人",
            key: "user_name",
            dataIndex: "user_name",
        },
        {
            // title:"详情",
            key: "detail",
            dataIndex: "detail",
            render: (_, record, index) => (
                <Space size="middle">
                    <HandleModal record={record}></HandleModal>
                </Space>)
        },
        {
            key: "delete",
            dataIndex: "delete",
            render: (_, record) => (
                <Space size="middle">
                    <Button style={{border: "1px solid blue"}} onClick={() => {
                        deleteFuncElem(record).then(getFailure());
                    }}>删除</Button>
                </Space>)
        }
    ];
    const getFailure = () => {
        api
            .GetSystemFailure()
            .then((response) => {
                setFailureData(response.data.data);
                // console.log("response.data.data=", response.data.data);
            })
            .catch((error) => {
            });
    };
    useEffect(() => {
        getFailure();
    }, []);
    return (
        <div>
            <Row>
                <Col span={19}>
                    <AlertBox></AlertBox>
                </Col>
                <Col span={2.5} offset={1}>
                    <SubmitFailure fresh={fresh} setFresh={setFresh} getFailure={getFailure}/>
                </Col>
            </Row>
            <Divider/>
            <Table
                // rowSelection={{全选框
                //   type: selectionType,
                //   ...rowSelection,
                // }}
                columns={tableColumns}
                dataSource={failureData}
                pagination={{
                    pageSize: 10,
                    showQuickJumper: true,
                    pageSizeOptions: [10, 20, 50],
                    showSizeChanger: true,
                }} //,position:['bottomLeft']
                fresh={fresh}
                setFresh={setFresh}
            />
        </div>
    );
};
export default function SystemFailure() {
    return (
        <>
            <Demo/>
        </>
    );
}
