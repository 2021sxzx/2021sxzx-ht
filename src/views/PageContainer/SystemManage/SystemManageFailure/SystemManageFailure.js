import React, {useEffect, useState} from "react";
//全选之后有啥用，详情有啥用,。报警阈值不会做。处理按钮是用来修改的吗。删除没做。成功的提示没做。
//点击处理之后，要刷新一下界面才能变为“已处理”
//下一步，拿到表单信息
import {
  Space, Form, Input, Button, Table, Divider, Modal, Row, Col, Upload, message, Image
} from "antd";

const {TextArea} = Input;
import {UploadOutlined} from "@ant-design/icons";
import api from "../../../../api/systemFailure";
import apiPersonal from '../../../../api/personal';

//详情的弹窗Modal
const HandleModal = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pictureList, setPictureList] = useState(props.record.failure_picture);
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
  return (<>
    <a style={{textDecoration: "underline"}} onClick={showModal}>详情</a>
    <Modal title="故障详情" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="确定"
           cancelText="取消">
      <h2>故障名称：{props.record.failure_name}</h2>
      <p>故障描述：{props.record.failure_des}</p>
      <Image.PreviewGroup>
        {pictureList.map(item => {
          return (<><Image src={"http://localhost:5001/api/v1/get-picture" + "?url=" + item.url}/></>)
        })}
      </Image.PreviewGroup>
      <h6>{props.record.failure_time}</h6>
    </Modal>
  </>);
};

//删除操作
const deleteFuncElem = async (aimedRowData) => {
  api.DeleteSystemFailure(aimedRowData).then(message.success('删除故障成功.'));
}

// 提交故障的按钮以及弹窗
const SubmitFailure = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm(); // 用于之后取数据
  const formRef = React.createRef();
  const [failurePicture, setFailurePicture] = useState([]);
  const showModal = () => setIsModalVisible(true);

  const onFinish = async () => {
    let data = form.getFieldsValue();
    if (data.failureName === undefined || data.failureDescription === undefined || data.failureName === '' || data.failureDescription === '') {
      message.error('请完善故障名称或者故障描述')
      return false;
    }
    // by lhy 历史恶臭代码
    // data.user_name = localStorage.getItem('role_name');
    data.user_name = (await apiPersonal.getTopHeaderData()).data.data.user_name;
    data.create_time = new Date(new Date().getTime() + 8 * 3600 * 1000);
    data.fileSizeList = [];
    try {
      // by lhy 判断空数组 若数组不为空表示有上传图片
      if (failurePicture.length > 0) {
        const FailurePictureFormData = new FormData();
        failurePicture.forEach(file => {
          FailurePictureFormData.append('file', file);
          data.fileSizeList.push(file.size)
        })
        setFailurePicture([]);
        data.pictureList = await (await fetch('http://localhost:5001/api/v1/system-failure-picture-upload', {
          method: 'POST', body: FailurePictureFormData, mode: "cors"
        })).json();
      }
      await api.CreateSystemFailure(data);
      props.getFailure();
      form.resetFields();
      setIsModalVisible(false);
      message.success('提交故障成功.');
    } catch (e) {
      message.error('提交故障失败，错误信息：' + e);
    }
  };

  const handleCancel = () => {
    setFailurePicture([]);
    form.resetFields();
    setIsModalVisible(false);
  };

  return (<>
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
              setFailurePicture([...failurePicture, file])
              return false;
            }}
            onRemove={(file) => {
              const index = failurePicture.indexOf(file);
              const newFileList = failurePicture.slice();
              newFileList.splice(index, 1);
              setFailurePicture(newFileList)
            }}
            fileList={failurePicture}
            name="failurePicture"
            maxCount={6}>
            <Button icon={<UploadOutlined/>}>Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  </>);
}

// 故障显示主界面
const Demo = () => {
  const [failureData, setFailureData] = useState([]);
  const [fresh, setFresh] = useState(true);
  const tableColumns = [{title: "故障名称", dataIndex: "failure_name", key: "failure_name"},
    {title: "时间", dataIndex: "failure_time", key: "failure_time"},
    {title: "操作描述", dataIndex: "failure_des", key: "failure_des"},
    {title: "提交人", key: "user_name", dataIndex: "user_name"},
    {
      key: "detail", dataIndex: "detail", render: (_, record) => (<Space size="middle">
        <HandleModal record={record}></HandleModal>
      </Space>)
    },
    {
      key: "delete", dataIndex: "delete", render: (_, record) => (<Space size="middle">
        <Button style={{border: "1px solid blue"}} onClick={() => {
          deleteFuncElem(record).then(() => getFailure());
        }}>删除</Button>
      </Space>)
    }];
  const getFailure = () => {
    api.GetSystemFailure().then((response) => {
      setFailureData(response.data.data);
    });
  };
  useEffect(() => getFailure(), []);
  return (<div>
    <Row>
      <Col span={19}/>
      <Col span={2.5} offset={1}>
        <SubmitFailure fresh={fresh} setFresh={setFresh} getFailure={getFailure}/>
      </Col>
    </Row>
    <Divider/>
    <Table
      columns={tableColumns}
      dataSource={failureData}
      pagination={{
        pageSize: 10, showQuickJumper: true, pageSizeOptions: [10, 20, 50], showSizeChanger: true,
      }}
      fresh={fresh}
      setFresh={setFresh}
    />
  </div>);
};
export default function SystemFailure() {
  return (<>
    <Demo/>
  </>);
}
