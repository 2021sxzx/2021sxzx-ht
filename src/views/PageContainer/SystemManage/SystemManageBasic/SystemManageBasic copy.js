import React, { useEffect, useState } from "react";
//全选之后有啥用，详情有啥用,。报警阈值不会做。处理按钮是用来修改的吗。删除没做。成功的提示没做。
import {
  Space,
  Form,
  Input,
  Button,
  Table,
  Checkbox,
  Radio,
  Divider,
  Modal,
  Tabs,
  Image,
  Switch,
  Select,
  Upload,Col
} from "antd";
import { SyncOutlined, UploadOutlined } from "@ant-design/icons";
import api from "../../../../api/systemBasic";
import "./SystemManageBasic.css";
// import './FileMetaData.css'
const { TabPane } = Tabs;


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

const Demo = () => {
  const form=Form.useForm()
  const [WebsiteStatus, setWebsiteStatus] = React.useState(true);
  const [WebsiteName, setWebsiteName] = React.useState('');
  const fileList = [
    {
      uid: "-1",
      name: "xxx.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      thumbUrl:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-2",
      name: "yyy.png",
      status: "error",
    },
  ];
  const onFinish = (values) => {
    console.log('Success:', values);
    // console.log('api:',api.SiteSettings())
    api.SiteSettings().then((response)=>{
      console.log("data=",response.data)
      setWebsiteName('http')
      // form.setFieldsValue({WebsiteName:'hei'})
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const uProps = {
    // 上传后的文件名
    name: 'file',
    headers: {
      // authorization: 'authorization-text',
      // AccessControlAllowOrigin: "*",
      // AccessControlAllowCredentials: "true",
      // AccessControlAllowMethods:  "GET,PUT,OPTIONS",
      // AccessControlAllowHeaders:  "Content-Type,Access-Token",
      // Accept:"*/*",
      // 'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
      // "access-control-allow-headers":  "Content-Type,Access-Token",
      // "Access-Control-Allow-Origin":  "*",
      // "Access-Control-Allow-Headers":  "Content-Type,Access-Token",
      // "Access-Control-Allow-Methods":  "OPTIONS,GET,POST",
      // "Access-Control-Allow-Credentials": "true",
      // "access-control-allow-origin":  "*",
      // "access-control-allowHeaders":  "Content-Type,Access-Token",
      // "Access-Control-Expose-Headers":  "Authorization",
      // "Origin":'http://localhost',
      // "Access-Control-Request-Method":'post',
      // "Access-Control-Request-Headers":'X-Requested-With',
      // 'X-Requested-With':null
    },
    // 上传文件必须用拦截模式
    action: '/api/v1/upload',
    data:{enter:'file',test:'test-data'}
    // action: 'http://localhost:8080/api/system/protocol/upload'
  };

  return (
    <div className="card-container">
      <Tabs type="card">
        <TabPane tab="网站设置" key="1">
          <Form
            labelCol={{ span: 4 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item label="网站状态" name="WebsiteStatus">
              <Switch
                checked={WebsiteStatus}
                checkedChildren="开"
                unCheckedChildren="关"
                onChange={() => {
                  setWebsiteStatus(!WebsiteStatus);
                }}
              />{" "}
            </Form.Item>
            <Form.Item
              label="网站简称"
              name="WebsiteName"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} defaultValue={WebsiteName} />
            </Form.Item>
            <Form.Item label="网站logo" name="WebsiteLogo" layout="inline">
              <Form.Item>
                <Image
                  width="70px"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                ></Image>
              </Form.Item>
              <Form.Item>
                <Button type="">p</Button>
              </Form.Item>
            </Form.Item>
            <Form.Item label="后台logo" name="BackstageLogo">
              <Upload
                action="http://localhost:5001/api/v1/picture-upload"
                listType="picture"
                className="upload-list-inline"
                accept=".png,.jpg"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
                图片地址
              </Upload>
            </Form.Item>
            <Form.Item
              label="网站域名"
              name="WebsiteDomainName"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="版权信息"
              name="CopyrightInformation"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="备案号"
              name="RecordNumber"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="服务热线"
              name="ServiceHotline"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="地址"
              name="Address"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="免责声明"
              name="Disclaimers"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <Button type="primary" htmlType="submit">
                确认更改
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="核心设置" key="2">
          <Form
            labelCol={{ span: 4 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="移动端域名"
              name="WebsiteName"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="PC端域名"
              name="WebsiteDomainName"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item label="使用DigicertSSL" name="WebsiteStatus">
              <Switch
                checked={WebsiteStatus}
                checkedChildren="开"
                unCheckedChildren="关"
                onChange={() => {
                  setWebsiteStatus(!WebsiteStatus);
                }}
              />{" "}
            </Form.Item>
            <Form.Item label="DigicertSSL证书" name="WebsiteStatus">
              <Button>配置证书</Button>
            </Form.Item>
            <Form.Item label="使用https" name="WebsiteStatus">
              <Switch
                checked={WebsiteStatus}
                checkedChildren="开"
                unCheckedChildren="关"
                onChange={() => {
                  setWebsiteStatus(!WebsiteStatus);
                }}
              />{" "}
            </Form.Item>
            <Form.Item
              label="后台路径"
              name="CopyrightInformation"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="数据库备份目录"
              name="RecordNumber"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <Button type="primary" htmlType="submit">
                确认更改
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="URL配置" key="3">
          <h3>URL模式</h3>
          <h3>伪静态模式</h3>
          <Form>
          <Form.Item label="测试upload" name="BackstageLogo">
              <Upload {...uProps}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="后台logo" name="BackstageLogo">
              <Upload
                action="http://localhost:5001/api/v1/picture-upload"
                listType="picture"
                className="upload-list-inline"
                accept=".png,.jpg"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
                图片地址
              </Upload>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <Button type="primary" htmlType="submit">
                确认更改
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="接口配置" key="4">
          <Form
            labelCol={{ span: 4 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <h2>入口配置</h2>
            <Form.Item
              label="广州市人社局官网"
              name="WebsiteName"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="广州市人社局微信公众号"
              name="WebsiteDomainName"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="穗好办APP"
              name="CopyrightInformation"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="智能服务机器人云平台"
              name="RecordNumber"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <h2>出口配置</h2>
            <Form.Item
              label="广东省政务综合服务平台"
              name="RecordNumber"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <h2>其他配置</h2>
            <Form.Item
              label="百度地图"
              name="RecordNumber"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="QQ客服咨询"
              name="RecordNumber"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <Button type="primary" htmlType="submit">
                确认更改
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};
export default function SystemManageBasic() {
  return (
    <>
      <Demo></Demo>
    </>
  );
}
