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
  Upload,Col,message
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
  const [websiteSettingsForm]=Form.useForm()
  const [coreSettingsForm]=Form.useForm()
  const [interfaceConfigurationForm]=Form.useForm()
  const [WebsiteStatus, setWebsiteStatus] = React.useState(true);
  const [fileList,setFileList]=React.useState(null)
  const [BackstageLogoFile,setBackstageLogoFile]=React.useState(null)
  const [WebsiteLogoFile,setWebsiteLogoFile]=React.useState(null)
  // const handleUpload = () => {
  //   const formData = new FormData();
  //   fileList.forEach(file => {
  //     formData.append('files[]', file);
  //   });
  //   setUploading(true)
  //   // You can use any AJAX library you like
  //   fetch('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
  //     method: 'POST',
  //     body: formData,
  //   })
  //     .then(res => res.json())
  //     .then(() => {
  //       setFileList([])
  //       message.success('upload successfully.');
  //     })
  //     .catch(() => {
  //       message.error('upload failed.');
  //     })
  // };

  // const fileList = [
  //   {
  //     uid: "-1",
  //     name: "xxx.png",
  //     status: "done",
  //     url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  //     thumbUrl:
  //       "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  //   },
  //   {
  //     uid: "-2",
  //     name: "yyy.png",
  //     status: "error",
  //   },
  // ];
  const onFinish = (values) => {
    api.ChangeSiteSettings(values)
    // let formData = new FormData();
    // fileList.forEach(file => {
    //   formData.append('file', file);
    // });
    // websiteSettingsForm.validateFields((err,data)=>{
    //   let { filename, filetype, describe } = values;
    //   formData.append('name', filename);
    //   formData.append('type', filetype);

    //   UploadFile(formData).then(res => { //这个是请求
    //     if (res.status == 200 && res.data != undefined) {
    //       notification.success({
    //         message: "上传成功",
    //         description: res.data,
    //       });
    //     } else {
    //       notification.error({
    //         message: "上传失败",
    //         description: res.status,
    //       });
    //     }
    //   })

    // })
    const formData = new FormData();
    // fileList.forEach(file => {
      formData.append('file', BackstageLogoFile);
      formData.append('imgName','logo');
      formData.append('test','123456');
    // });
    // setUploading(true)
    console.log('formData.file:',formData.get('file'))
    // console.log('formData.test:',formData.get('test'))
    // You can use any AJAX library you like
    fetch('http://localhost:5001/api/v1/backstagelogo-upload', {
      method: 'POST',
      body: formData,
      mode: "cors",
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    })
      .then(res => res.json())
      .then(() => {
        //上传之后删除浏览器的图片
        // setFileList(null)
        message.success('upload successfully.');
      })
      .catch(() => {
        message.error('upload failed.');
      })
      
      const WebsiteLogoFileFormData = new FormData();
      WebsiteLogoFileFormData.append('file', WebsiteLogoFile);
      console.log('WebsiteLogoFileFormData.file:',WebsiteLogoFileFormData.get('file'))
      fetch('http://localhost:5001/api/v1/websitelogo-upload', {
        method: 'POST',
        body: WebsiteLogoFileFormData,
        mode: "cors",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      })
        .then(res => res.json())
        .then(() => {
          //上传之后删除浏览器的图片
          // setFileList(null)
          message.success('upload successfully.');
        })
        .catch(() => {
          message.error('upload failed.');
        })
  
    message.success('修改成功')
  };

  const ChangeCoreSettings=(values)=>{
    api.ChangeCoreSettings(values)
    message.success('核心设置修改成功')
  }

  const ChangeInterfaceConfiguration=(values)=>{
    api.ChangeInterfaceConfiguration(values)
    message.success('接口修改成功')
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const uProps = {
    // 上传后的文件名
    name: 'file',
    headers: {
    },
    // 上传文件必须用拦截模式
    action: '/api/v1/upload',
    data:{enter:'file',test:'test-data'}
    // action: 'http://localhost:8080/api/system/protocol/upload'
  };

  useEffect(()=>{
    api.SiteSettings().then((response)=>{
      websiteSettingsForm.setFieldsValue({
        WebsiteAbbreviation:response.data.WebsiteAbbreviation,
        WebsiteDomainName:response.data.WebsiteDomainName,
        CopyrightInformation:response.data.CopyrightInformation,
        RecordNumber:response.data.RecordNumber,
        ServiceHotline:response.data.ServiceHotline,
        Address:response.data.Address,
        Disclaimers:response.data.Disclaimers
      })
    })
    api.CoreSettings().then((response)=>{coreSettingsForm.setFieldsValue({
      MobileDomainName: response.data.MobileDomainName,
      PCDomainName:response.data.PCDomainName
    })})
    api.InterfaceConfiguration().then((response)=>{
      interfaceConfigurationForm.setFieldsValue({
        OfficialWebsite:response.data.OfficialWebsite,
        OfficialAccount:response.data.OfficialAccount
      })
    })
  })

  return (
    <div className="card-container">
      <Tabs type="card">
        <TabPane tab="网站设置" key="1">
          <Form
            labelCol={{ span: 4 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={websiteSettingsForm}
            name="websiteSettings"
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
              name="WebsiteAbbreviation"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item label="网站logo" name="WebsiteLogo" layout="inline">
            <Upload
                listType="picture"
                className="upload-list-inline"
                accept=".png"
                beforeUpload={(file)=>{       
                  setWebsiteLogoFile(file)
                  console.log(WebsiteLogoFile)
                  return false;
                }}
                name="websiteLogo"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
                图片地址
              </Upload>
            </Form.Item>
            <Form.Item label="首页轮播图" name="BackstageLogo">
              <Upload
                // action="http://localhost:5001/api/v1/logo-upload"
                listType="picture"
                className="upload-list-inline"
                accept=".png"
                beforeUpload={(file)=>{       
                  // console.log(file);
                  // var fileExtension = name.substring(name.lastIndexOf(".") + 1); //截取文件后缀名
                  // this.props.form.setFieldsValue({
                  //   filename: name,
                  //   filetype: fileExtension,
                  // }); //选择完文件后把文件名和后缀名自动填入表单
                  // this.setState((state) => ({
                  //   fileList: [file],
                  // }));
                  setBackstageLogoFile(file)
                  console.log(BackstageLogoFile)
                  return false;
                }}
                name="logo"
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
            onFinish={ChangeCoreSettings}
            onFinishFailed={onFinishFailed}
            form={coreSettingsForm}
            name="CoreSettings"
          >
            <Form.Item
              label="移动端域名"
              name="MobileDomainName"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="PC端域名"
              name="PCDomainName"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item label="使用DigicertSSL" name="DigicertSSL">
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
            <Form.Item label="使用https" name="httpsService">
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
              name="BackgroundPath"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="数据库备份目录"
              name="DatabaseBackupDirectory"
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
            labelCol={{span: 4}}     onFinish={ChangeInterfaceConfiguration}
            onFinishFailed={onFinishFailed}
            form={interfaceConfigurationForm}
          >
            <h2>入口配置</h2>
            <Form.Item
              label="广州市人社局官网"
              name="OfficialWebsite"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="广州市人社局微信公众号"
              name="OfficialAccount"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="穗好办APP"
              name="APP"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="智能服务机器人云平台"
              name="CloudPlatform"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <h2>出口配置</h2>
            <Form.Item
              label="广东省政务综合服务平台"
              name="ServicePlatform"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <h2>其他配置</h2>
            <Form.Item
              label="百度地图"
              name="BaiduMaps"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="QQ客服咨询"
              name="QQCustomerService"
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
