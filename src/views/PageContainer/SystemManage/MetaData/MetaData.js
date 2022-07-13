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
  Upload,
  Row,
  Col,
  message,
  Typography,
  Card,
} from "antd";
const { Title, Paragraph } = Typography;
import { SyncOutlined, UploadOutlined } from "@ant-design/icons";
import * as echarts from "echarts";
import api from "../../../../api/systemBasic";
import apiLog from "../../../../api/log";
import "./MetaData.css";
import ChartsT from "./ChartsT";
import Charts from "./UsersChart";
import ChartsTe from "./ChartsTe";
// import LineChart from "./LineChart";
// import BarChart from "./BarChart";
import UsersChart from "./UsersChart";

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
var myChart; //echarts全局变量

const BarChart = (props) => {
  const [data, setData] = useState([]);
  // getLog(data, setData);
  if (myChart != null && myChart != "" && myChart != undefined) {
    myChart.dispose(); //销毁
  }
  React.useEffect(() => {
    var chartDom = document.getElementById(props.id);
    myChart = echarts.init(chartDom);
    myChart.setOption({
      title: {
        text: "日志记录",
        subtext: "5000",
        textStyle: {
          fontSize: "12px",
          fontWeight: "normal",
        },
        subtextStyle: {
          fontSize: "20px",
          fontWeight: "bolder",
        },
      },
      tooltip: {
        trigger: "item",
        position: function (pt) {
          // return [pt[0], '10%','top'];
          return "top";
        },
      },
      xAxis: {
        type: "category",
        // data: chart2()
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          // data: api.MetaDataLog(),
          data: props.data,
          // data: [120, 200, 150, 80, 70, 110, 130,120, 200, 150, 80, 70, 110, 130,140],
          type: "bar",
        },
      ],
    });
    // getLog(data,setData);
  });
  return (
    <div
      style={{
        width: "250px",
        height: "170px",
        // paddingLeft: "10px",
        display: "inline-block",

        // float: "left"
      }}
    >
      <div id={props.id} style={{ width: "100%", height: "100%" }} />
      <Divider style={{ marginTop: "-42px", marginBottom: "0px" }} />
      <div>
        <Paragraph style={{ marginLeft: "12px", marginRight: "20px" }}>
          更改条数 +{props.today}
        </Paragraph>
      </div>
    </div>
  );
};
const LineChart = (props) => {
  const [data, setData] = useState(props.data);
  // console.log("props.today:"+props.today)
  // console.log("props.today:"+props.today)
  // console.log("props:"+props.toString())

  React.useEffect(() => {
    for (var i in props) {
      // console.log(i + ":" + props[i]);
    }
    var chartDom = document.getElementById(props.id);
    // setData(props.data[props.data.length - 1][1])
    if (myChart != null && myChart != "" && myChart != undefined) {
      myChart.dispose(); //销毁
    }
    var myChart = echarts.init(chartDom);
    myChart.setOption({
      tooltip: {
        trigger: "axis",
        position: function (pt) {
          return [pt[0], "10%"];
        },
      },
      title: {
        left: "left",
        text: "今日事项浏览次数",
        subtext: props.today,
        textStyle: {
          fontSize: "12px",
          fontWeight: "normal",
        },
        subtextStyle: {
          fontSize: "20px",
          fontWeight: "bolder",
        },
      },
      xAxis: {
        type: "time",
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "100%"],
        show: false,
      },
      series: [
        {
          name: "今日事项浏览次数",
          type: "line",
          smooth: true,
          symbol: "none",
          areaStyle: {},
          data: props.data,
        },
      ],
    });
    // getItemBrowseCount();
  });
  return (
    /*        <div id={props.id} style={{
          width: "250px",
          height: "170px",
          paddingLeft: "10px",
          display: "inline-block",
          float: "left"
      }}/>*/
    <div
      style={{
        width: "250px",
        height: "170px",
        display: "inline-block",
      }}
    >
      <div id={props.id} style={{ width: "100%", height: "100%" }} />
      <Divider style={{ marginTop: "-42px", marginBottom: "0px" }} />
      <div>
        <Paragraph style={{ marginLeft: "12px", marginRight: "20px" }}>
          近15日日均访问量 14512
        </Paragraph>
      </div>
    </div>
  );
};
// const LineChart = (props) => {
//   React.useEffect(() => {
//     var chartDom = document.getElementById(props.id);
//     var myChart = echarts.init(chartDom);
//     var option;

//     const dataCount = 5e5;
//     const data = generateData(dataCount);
//     option = {
//       title: {
//         text: echarts.format.addCommas(dataCount) + ' Data',
//         left: 10
//       },
//       toolbox: {
//         feature: {
//           dataZoom: {
//             yAxisIndex: false
//           },
//           saveAsImage: {
//             pixelRatio: 2
//           }
//         }
//       },
//       tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//           type: 'shadow'
//         }
//       },
//       grid: {
//         bottom: 90
//       },
//       dataZoom: [
//         {
//           type: 'inside'
//         },
//         {
//           type: 'slider'
//         }
//       ],
//       xAxis: {
//         data: data.categoryData,
//         silent: false,
//         splitLine: {
//           show: false
//         },
//         splitArea: {
//           show: false
//         }
//       },
//       yAxis: {
//         splitArea: {
//           show: false
//         }
//       },
//       series: [
//         {
//           type: 'bar',
//           data: data.valueData,
//           // Set `large` for large data amount
//           large: true
//         }
//       ]
//     };
//     function generateData(count) {
//       let baseValue = Math.random() * 1000;
//       let time = +new Date(2011, 0, 1);
//       let smallBaseValue;
//       function next(idx) {
//         smallBaseValue =
//           idx % 30 === 0
//             ? Math.random() * 700
//             : smallBaseValue + Math.random() * 500 - 250;
//         baseValue += Math.random() * 20 - 10;
//         return Math.max(0, Math.round(baseValue + smallBaseValue) + 3000);
//       }
//       const categoryData = [];
//       const valueData = [];
//       for (let i = 0; i < count; i++) {
//         categoryData.push(
//           echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', time, false)
//         );
//         valueData.push(next(i).toFixed(2));
//         time += 1000;
//       }
//       return {
//         categoryData: categoryData,
//         valueData: valueData
//       };
//     }

//     option && myChart.setOption(option);
//     return (
//   <div style={{
//       width: "250px",
//       height: "170px",
//       display: "inline-block",
//   }}>
//       <div id={props.id} style={{width:"100%",height:"100%"}}/>
//       <Divider style={{marginTop:"-42px",marginBottom:"0px"}}/>
//       <div>
//           <Paragraph style={{marginLeft:"12px",marginRight:"20px"}}>近15日日均访问量 14512</Paragraph>
//       </div>
//   </div>
//   );
//   })
// }
const Demo = () => {
  const [websiteSettingsForm] = Form.useForm();
  const [coreSettingsForm] = Form.useForm();
  const [interfaceConfigurationForm] = Form.useForm();

  // const [WebsiteStatus, setWebsiteStatus] = React.useState(true);
  // const [fileList, setFileList] = React.useState(null);
  const [BackstageLogoFile, setBackstageLogoFile] = React.useState(null);
  const [WebsiteLogoFile, setWebsiteLogoFile] = React.useState(null);
  const [AddressBarIconFile, setAddressBarIconFile] = React.useState(null);
  const [MobileLogoFile, setMobileLogoFile] = React.useState(null);
  const [QRCodeFile, setQRCodeFile] = React.useState(null);

  //QRCode
  const [GZRSOfficeQRCode, setGZRSOfficeQRCode,] = React.useState(null);
  const [GZRSWechatQRCode, setGZRSWechatQRCode] = React.useState(null);
  const [SHBAPPQRCode, setSHBAPPQRCode] = React.useState(null);

  //InterfaceEntrance
  const [officialWebsite, setOfficialWebsite] = React.useState(null);
  const [officialAccount, setOfficialAccount] = React.useState(null);
  const [SHBAPP,setSHBAPP] = React.useState(null)

  // const [APP, setAPP] = React.useState(null);
  // const [cloudPlatform, setCloudPlatform] = React.useState(null);
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
    api.ChangeSiteSettings(values);
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
    if (BackstageLogoFile) {
      const formData = new FormData();
      // fileList.forEach(file => {
      formData.append("file", BackstageLogoFile);
      formData.append("imgName", "logo");
      formData.append("test", "123456");
      // });
      // setUploading(true)
      // console.log("formData.file:", formData.get("file"));
      // console.log('formData.test:',formData.get('test'))
      // You can use any AJAX library you like
      fetch("http://8.134.73.52/api/v1/backstagelogo-upload", {
        method: "POST",
        body: formData,
        mode: "cors",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      })
        .then((res) => res.json())
        .then(() => {
          //上传之后删除浏览器的图片
          setBackstageLogoFile(null);
          message.success("首页轮播图上传成功.");
        })
        .catch(() => {
          message.error("首页轮播图上传失败.");
        });
    }

    if (WebsiteLogoFile) {
      const WebsiteLogoFileFormData = new FormData();
      WebsiteLogoFileFormData.append("file", WebsiteLogoFile);
      // console.log(
      //   "WebsiteLogoFileFormData.file:",
      //   WebsiteLogoFileFormData.get("file")
      // );
      fetch("http://localhost:5001/api/v1/websitelogo-upload", {
        method: "POST",
        body: WebsiteLogoFileFormData,
        mode: "cors",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      })
        .then((res) => res.json())
        .then(() => {
          //上传之后删除浏览器的图片
          setWebsiteLogoFile(null);
          message.success("网站logo上传成功.");
        })
        .catch(() => {
          message.error("网站logo上传失败.");
        });
    }
    if (AddressBarIconFile) {
      const AddressBarIconFileFormData = new FormData();
      AddressBarIconFileFormData.append("file", AddressBarIconFile);
      // console.log('WebsiteLogoFileFormData.file:',WebsiteLogoFileFormData.get('file'))
      fetch("http://localhost:5001/api/v1/addressbaricon-upload", {
        method: "POST",
        body: AddressBarIconFileFormData,
        mode: "cors",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      })
        .then((res) => res.json())
        .then(() => {
          //上传之后删除浏览器的图片
          setAddressBarIconFile(null);
          message.success("地址栏图标上传成功.");
        })
        .catch(() => {
          message.error("地址栏图标上传失败.");
        });
    }
    if (MobileLogoFile) {
      const MobileLogoFileFormData = new FormData();
      MobileLogoFileFormData.append("file", MobileLogoFile);
      // console.log('WebsiteLogoFileFormData.file:',WebsiteLogoFileFormData.get('file'))
      fetch("http://localhost:5001/api/v1/mobilelogo-upload", {
        method: "POST",
        body: MobileLogoFileFormData,
        mode: "cors",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      })
        .then((res) => res.json())
        .then(() => {
          //上传之后删除浏览器的图片
          setMobileLogoFile(null);
          message.success("手机端logo上传成功.");
        })
        .catch(() => {
          message.error("手机端logo上传失败.");
        });
    }
    if (QRCodeFile) {
      const QRCodeFileFormData = new FormData();
      QRCodeFileFormData.append("file", QRCodeFile);
      // console.log('WebsiteLogoFileFormData.file:',WebsiteLogoFileFormData.get('file'))
      fetch("http://localhost:5001/api/v1/QRCode-upload", {
        method: "POST",
        body: QRCodeFileFormData,
        mode: "cors",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      })
        .then((res) => res.json())
        .then(() => {
          //上传之后删除浏览器的图片
          setQRCodeFile(null);
          message.success("二维码上传成功.");
        })
        .catch(() => {
          message.error("二维码上传失败.");
        });
    }

    if (GZRSOfficeQRCode) {
      const GZRSOfficeQRCodeFormData = new FormData();
      GZRSOfficeQRCodeFormData.append("file", GZRSOfficeQRCode);
      fetch("http://localhost:5001/api/v1/QRCode-upload", {//需要设置fetch地址
        method: "POST",
        body: GZRSOfficeQRCodeFormData,
        mode: "cors",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      })
        .then((res) => res.json())
        .then(() => {
          //上传之后删除浏览器的图片
          setGZRSOfficeQRCode(null);
          message.success("二维码上传成功.");
        })
        .catch(() => {
          message.error("二维码上传失败.");
        });
    }

    if (GZRSWechatQRCode) {
      const GZRSWechatQRCodeFileFormData = new FormData();
      GZRSWechatQRCodeFileFormData.append("file", GZRSWechatQRCode);
      fetch("http://localhost:5001/api/v1/QRCode-upload", {//需要设置fetch地址
        method: "POST",
        body: GZRSWechatQRCodeFileFormData,
        mode: "cors",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      })
        .then((res) => res.json())
        .then(() => {
          //上传之后删除浏览器的图片
          setQRCodeFile(null);
          message.success("二维码上传成功.");
        })
        .catch(() => {
          message.error("二维码上传失败.");
        });
    }

    if (GZRSOfficeQRCode) {
      const GZRSOfficeQRCodeFileFormData = new FormData();
      GZRSOfficeQRCodeFileFormData.append("file", GZRSOfficeQRCode);
      fetch("http://localhost:5001/api/v1/QRCode-upload", {//需要设置fetch地址
        method: "POST",
        body: GZRSOfficeQRCodeFileFormData,
        mode: "cors",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      })
        .then((res) => res.json())
        .then(() => {
          //上传之后删除浏览器的图片
          setQRCodeFile(null);
          message.success("二维码上传成功.");
        })
        .catch(() => {
          message.error("二维码上传失败.");
        });
    }
    message.success("修改成功");
  };

  const ChangeCoreSettings = (values) => {
    api.ChangeCoreSettings(values);
    message.success("核心设置修改成功");
  };

  const ChangeInterfaceConfiguration = (values) => {
    api.ChangeInterfaceConfiguration(values);
    message.success("接口修改成功");
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
  };
  const [logData15, setLogData15] = useState(false);
  const [logToday, setLogToday] = useState(false);
  const [itemBrowseCount15, setItemBrowseCount15] = useState(false);
  const [itemBrowseCountAverage, setItemBrowseCountAverage] = useState(false);
  const [itemBrowseCountToday, setItemBrowseCountToday] = useState(false);

  const getLog = () => {
    // setLogData15([1, 10]);
    // return [1, 10];
    apiLog
      .MetaDataLog()
      .then((response) => {
        setLogData15(response.data);
        setLogToday(response.data[response.data.length - 1][1]);
        // console.log("response.data.data=", response.data);
      })
      .catch((error) => {});
    apiLog
      .ItemBrowseCount()
      .then((response) => {
        setItemBrowseCount15(response.data);
        setItemBrowseCountToday(response.data[response.data.length - 1][1]);
        // console.log("Item=", response.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    api.SiteSettings().then((response) => {
      websiteSettingsForm.setFieldsValue({
        WebsiteAbbreviation: response.data.WebsiteAbbreviation,
        WebsiteDomainName: response.data.WebsiteDomainName,
        CopyrightInformation: response.data.CopyrightInformation,
        RecordNumber: response.data.RecordNumber,
        ServiceHotline: response.data.ServiceHotline,
        Address: response.data.Address,
        Disclaimers: response.data.Disclaimers,
      });
      // console.log('ii')
      // apiLog.MetaDataLog().then(response =>{setLogData15(response.data)} )
    });
    api.CoreSettings().then((response) => {
      coreSettingsForm.setFieldsValue({
        MobileDomainName: response.data.MobileDomainName,
        PCDomainName: response.data.PCDomainName,
      });
    });
    api.InterfaceConfiguration().then((response) => {
      interfaceConfigurationForm.setFieldsValue({
        OfficialWebsite: response.data.OfficialWebsite,
        OfficialAccount: response.data.OfficialAccount,
      });
      setOfficialWebsite(response.data.OfficialWebsite);
      setOfficialAccount(response.data.OfficialAccount);
      setSHBAPP(response.data.SHBAPP)
      // setAPP(response.data.APP)
      // setCloudPlatform(response.data.CloudPlatform)
    });
    getLog();
  }, []);

  function getMyState(data) {
    if (data === 0) return <span style={{ color: "#63c044" }}>良好</span>;
    else return <span style={{ color: "red" }}>不良</span>;
  }

  return (
    <div className="card-container">
      <Tabs type="card">
        <TabPane tab="元数据查看" key="1">
          <div style={{ padding: "5px", backgroundColor: "#eeeeee" }}>
            <Row gutter={10}>
              <Col span={8}>
                {" "}
                <Card size="small">
                  <UsersChart id="xi" />
                </Card>
              </Col>
              <Col span={8}>
                {" "}
                <Card size="small">
                  <LineChart
                    id="ha"
                    data={itemBrowseCount15}
                    today={itemBrowseCountToday}
                  />
                </Card>
              </Col>
              <Col span={8}>
                {" "}
                <Card size="small">
                  <BarChart id="ww" data={logData15} today={logToday} />
                </Card>
              </Col>
            </Row>
          </div>
          <Divider />
        </TabPane>
        <TabPane tab="网站设置" key="2">
          <Form
            labelCol={{ span: 4 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={websiteSettingsForm}
            name="websiteSettings"
          >
            {/* <Form.Item label="网站状态" name="WebsiteStatus">
    <Switch
      checked={WebsiteStatus}
      checkedChildren="开"
      unCheckedChildren="关"
      onChange={() => {
        setWebsiteStatus(!WebsiteStatus);
      }}
    />{" "}
  </Form.Item> */}
            <Form.Item
              label="网站简称"
              name="WebsiteAbbreviation"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "200px" }} />
            </Form.Item>
            <Form.Item label="网站logo" name="WebsiteLogo" layout="inline">
              <Upload
                listType="picture"
                className="upload-list-inline"
                accept=".png"
                beforeUpload={(file) => {
                  setWebsiteLogoFile(file);
                  // console.log(WebsiteLogoFile);
                  return false;
                }}
                name="websiteLogo"
                maxCount={1}
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
                accept=".jpg"
                beforeUpload={(file) => {
                  // console.log(file);
                  // var fileExtension = name.substring(name.lastIndexOf(".") + 1); //截取文件后缀名
                  // this.props.form.setFieldsValue({
                  //   filename: name,
                  //   filetype: fileExtension,
                  // }); //选择完文件后把文件名和后缀名自动填入表单
                  // this.setState((state) => ({
                  //   fileList: [file],
                  // }));
                  const isPNG = file.type === "image/jpeg";
                  if (!isPNG) {
                    message.error(`${file.name}不是jpg格式`);
                    return Upload.LIST_IGNORE;
                  }
                  setBackstageLogoFile(file);
                  // console.log(BackstageLogoFile);
                  return false;
                }}
                maxCount={1}
                name="logo"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
                图片地址
              </Upload>
            </Form.Item>
            <Form.Item label="地址栏图标" name="AddressBarIcon" layout="inline">
              <Upload
                listType="picture"
                className="upload-list-inline"
                accept=".png"
                beforeUpload={(file) => {
                  setAddressBarIconFile(file);
                  // console.log(AddressBarIconFile);
                  return false;
                }}
                maxCount={1}
                name="addressBarIconFile"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
                图片地址
              </Upload>
            </Form.Item>
            <Form.Item label="手机端logo" name="MobileLogo" layout="inline">
              <Upload
                listType="picture"
                className="upload-list-inline"
                accept=".png"
                beforeUpload={(file) => {
                  setMobileLogoFile(file);
                  // console.log(MobileLogoFile);
                  return false;
                }}
                maxCount={1}
                name="mobileLogo"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
                图片地址
              </Upload>
            </Form.Item>
            <Form.Item label="二维码" name="QRCode" layout="inline">
              <Upload
                listType="picture"
                className="upload-list-inline"
                accept=".png"
                beforeUpload={(file) => {
                  setQRCodeFile(file);
                  // console.log(QRCodeFile);
                  return false;
                }}
                maxCount={1}
                name="QRCode"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
                图片地址
              </Upload>
            </Form.Item>
            <Form.Item label="广州市人设局官网" name="QRCode" layout="inline">
              <Upload
                listType="picture"
                className="upload-list-inline"
                accept=".png"
                beforeUpload={(file) => {
                  setQRCodeFile(file);
                  // console.log(QRCodeFile);
                  return false;
                }}
                maxCount={1}
                name="QRCode"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
                图片地址
              </Upload>
            </Form.Item>
            <Form.Item label="广州市人设局公众号" name="QRCode" layout="inline">
              <Upload
                listType="picture"
                className="upload-list-inline"
                accept=".png"
                beforeUpload={(file) => {
                  setQRCodeFile(file);
                  // console.log(QRCodeFile);
                  return false;
                }}
                maxCount={1}
                name="QRCode"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
                图片地址
              </Upload>
            </Form.Item>
            <Form.Item label="穗好办APP" name="QRCode" layout="inline">
              <Upload
                listType="picture"
                className="upload-list-inline"
                accept=".png"
                beforeUpload={(file) => {
                  setQRCodeFile(file);
                  // console.log(QRCodeFile);
                  return false;
                }}
                maxCount={1}
                name="QRCode"
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
        <TabPane tab="核心设置" key="3">
          <Form
            labelCol={{ span: 4 }}
            onFinish={ChangeCoreSettings}
            onFinishFailed={onFinishFailed}
            form={coreSettingsForm}
            name="CoreSettings"
            labelAlign="left"
          >
            <h2>备案号设置</h2>
            <Form.Item
              label="粤公安网备案号"
              name="RecordNumber"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="粤ICP备案号"
              name="RecordNumber"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <h2>网页下方超链接设置</h2>
            <Form.Item
              label="关于我们"
              name="about_us"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="联系方式"
              name="contact_detail"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="隐私安全"
              name="privacy_security"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="网站声明"
              name="website_statement"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="粤公安网备"
              name="network_record"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="粤ICP备案"
              name="icp_record"
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
        <TabPane tab="接口配置" key="5">
          <Row>
            <Col span={18}>
              <Form
                labelCol={{ span: 5 }}
                onFinish={ChangeInterfaceConfiguration}
                onFinishFailed={onFinishFailed}
                form={interfaceConfigurationForm}
                labelAlign="left"
              >
                <h2>入口配置</h2>
                <Form.Item
                  label="广州市人社局官网"
                  name="OfficialWebsite"
                  rules={[{ message: "Please input your username!" }]}
                  // validateStatus="success"
                  // hasFeedback
                >
                  {/*<Input style={{ width: "700px" }} bordered={false} disabled={true} />*/}
                  {officialWebsite}
                </Form.Item>
                <Form.Item
                  label="广州市人社局微信公众号"
                  name="OfficialAccount"
                  rules={[{ message: "Please input your username!" }]}
                >
                  {/*<Input  style={{ width: "700px" }} />*/}
                  {officialAccount}
                </Form.Item>
                <Form.Item
                  label="穗好办APP"
                  name="APP"
                  rules={[{ message: "Please input your username!" }]}
                >
                  {/* <Input style={{ width: "700px" }} /> */}
                  {SHBAPP}
                </Form.Item>
                <h2>出口配置</h2>
                <Form.Item
                  label="广东省政务综合服务平台"
                  name="ServicePlatform"
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
                <h2>其他配置</h2>
                <Form.Item
                  label="百度地图"
                  name="BaiduMaps"
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
            </Col>
            <Col span={6}>
              <Form
                labelCol={{ span: 15 }}
                // onFinish={ChangeInterfaceConfiguration}
                // onFinishFailed={onFinishFailed}
                // form={interfaceConfigurationForm}
                labelAlign="left"
              >
                <Title level={4}>服务器与接口状态</Title>
                <Form.Item label="服务器网络" name="OfficialWebsite">
                  {
                    getMyState(1)
                    // ? <span style={{color: '#63c044'}}>良好</span> :
                    //     <span style={{color: 'red'}}>不良</span>
                  }
                </Form.Item>
                <Form.Item label="广州市人社局接口" name="OfficialWebsite">
                  {getMyState(0)}
                </Form.Item>
                <Form.Item
                  label="广州人设微信公众号接口"
                  name="OfficialWebsite"
                >
                  良好
                </Form.Item>
                <Form.Item label="穗好办APP接口" name="OfficialWebsite">
                  良好
                </Form.Item>
                <Form.Item
                  label="智能服务机器人云平台接口"
                  name="OfficialWebsite"
                >
                  良好
                </Form.Item>
                <Form.Item
                  label="广东省政务服务综合平台接口"
                  name="OfficialWebsite"
                >
                  良好
                </Form.Item>
                <Form.Item label="百度地图接口" name="OfficialWebsite">
                  良好
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="URL配置" key="4">
          <Form labelCol={{ span: 4 }}>
            <Form.Item label="系统日志路径" name="SystemLogPath" width="200px">
              /root/sxzx/sxzx/log
            </Form.Item>
            <Form.Item label="数据库日志路径" name="DatabaseLogPath">
              /usr/local/mongodb/logs
            </Form.Item>
            <Form.Item label="操作系统日志路径" name="OSLogPath">
              /var/log
            </Form.Item>
            <Form.Item label="中间件日志路径" name="MiddleWareLogPath">
              /usr/local/redis/log
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};
export default function MetaData() {
  return (
    <>
      <Demo></Demo>
    </>
  );
}
