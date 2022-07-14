import React, { useEffect, useState } from "react";
//全选之后有啥用，详情有啥用,。报警阈值不会做。处理按钮是用来修改的吗。删除没做。成功的提示没做。
import {
  Form,
  Input,
  Button,
  Divider,
  Modal,
  Tabs,
  Switch,
  Upload,
  Row,
  Col,
  message,
  Typography,
  Card,
} from "antd";

const { Title, Paragraph } = Typography;
import { UploadOutlined } from "@ant-design/icons";
import * as echarts from "echarts";
import api from "../../../../api/systemBasic";
import apiLog from "../../../../api/log";
import "./MetaData.css";
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

let myChart; //echarts全局变量

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
        text: "事项数目",
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
  const [GZRSOfficeQRCode, setGZRSOfficeQRCode] = React.useState(null);
  const [GZRSWechatQRCode, setGZRSWechatQRCode] = React.useState(null);
  const [SHBAPPQRCode, setSHBAPPQRCode] = React.useState(null);

  //Interface
  const [interfaceStatus, setInterfaceStatus] = React.useState({});

  //LogPath
  const [logPath, setLogPath] = React.useState({});

  const onFinish = (values) => {
    api.ChangeSiteSettings(values);
    const onFinish = (values) => {
      api.ChangeSiteSettings(values);
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
      message.success("修改成功");
    };

    const ChangeCoreSettings = (values) => {
      api.ChangeCoreSettings(values);
      message.success("核心设置修改成功");
    };

    const ChangeInterfaceConfiguration = (values) => {
      api.SetInterfaceUrl(values);
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
        });
        // console.log('ii')
        // apiLog.MetaDataLog().then(response =>{setLogData15(response.data)} )
      });
      api.CoreSettings().then((response) => {
        coreSettingsForm.setFieldsValue({
          ICP_record_number: response.data.ICP_record_number,
          network_record_number: response.data.network_record_number,
          url_about_us: response.data.url_about_us,
          url_contact_detail: response.data.url_contact_detail,
          url_privacy_security: response.data.url_privacy_security,
          url_website_statement: response.data.url_website_statement,
          url_website_map: response.data.url_website_map,
          url_help: response.data.url_help,
          url_icp_record: response.data.url_icp_record,
          url_network_record: response.data.url_network_record,
        });
      });
      api.GetInterfaceUrl().then((response) => {
        interfaceConfigurationForm.setFieldsValue({
          api_GZSRSJGW: response.data.data.api_GZSRSJGW,
          api_GZSRSJWX: response.data.data.api_GZSRSJWX,
          api_SHBAPP: response.data.data.api_SHBAPP,
          api_GDZWFWPT: response.data.data.api_GDZWFWPT,
          api_ZNFWJQRPT: response.data.data.api_ZNFWJQRPT,
          api_BDDT: response.data.data.api_BDDT,
        });
      });
      getLog();
    }, []);

    function getMyState(data) {
      if (data === 0) return <span style={{ color: "#63c044" }}>良好</span>;
      else return <span style={{ color: "red" }}>不良</span>;
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
      fetch("http://localhost:5001/api/v1/QRCode-upload", {
        //需要设置fetch地址
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
      fetch("http://localhost:5001/api/v1/QRCode-upload", {
        //需要设置fetch地址
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
      fetch("http://localhost:5001/api/v1/QRCode-upload", {
        //需要设置fetch地址
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
    api.SetInterfaceUrl(values);
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
      });
      // console.log('ii')
      // apiLog.MetaDataLog().then(response =>{setLogData15(response.data)} )
    });
    api.CoreSettings().then((response) => {
      coreSettingsForm.setFieldsValue({
        ICP_record_number: response.data.ICP_record_number,
        network_record_number: response.data.network_record_number,
        url_about_us: response.data.url_about_us,
        url_contact_detail: response.data.url_contact_detail,
        url_privacy_security: response.data.url_privacy_security,
        url_website_statement: response.data.url_website_statement,
        url_website_map: response.data.url_website_map,
        url_help: response.data.url_help,
        url_icp_record: response.data.url_icp_record,
        url_network_record: response.data.url_network_record,
      });
    });
    api.GetInterfaceUrl().then((response) => {
      interfaceConfigurationForm.setFieldsValue({
        api_GZSRSJGW: response.data.data.api_GZSRSJGW,
        api_GZSRSJWX: response.data.data.api_GZSRSJWX,
        api_SHBAPP: response.data.data.api_SHBAPP,
        api_GDZWFWPT: response.data.data.api_GDZWFWPT,
        api_ZNFWJQRPT: response.data.data.api_ZNFWJQRPT,
        api_BDDT: response.data.data.api_BDDT,
      });
    });
    api
      .GetNetworkStatus()
      .then((response) => {
        setInterfaceStatus(response.data.data);
      })
      .catch((error) => console.log(error));
    api
      .GetLogPath()
      .then((response) => {
        setLogPath(response.data)
      })
      .catch((error) => console.log(error));
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
              name="network_record_number"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="粤ICP备案号"
              name="ICP_record_number"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <h2>网页下方超链接设置</h2>
            <Form.Item
              label="关于我们"
              name="url_about_us"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="联系方式"
              name="url_contact_detail"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="隐私安全"
              name="url_privacy_security"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="网站声明"
              name="url_website_statement"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="网站地图"
              name="url_website_map"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="使用帮助"
              name="url_help"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="粤公安网备"
              name="url_icp_record"
              rules={[{ message: "Please input your username!" }]}
            >
              <Input style={{ width: "700px" }} />
            </Form.Item>
            <Form.Item
              label="粤ICP备案"
              name="url_network_record"
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
        <TabPane tab="接口设置" key="5">
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
                  name="api_GZSRSJGW"
                  rules={[{ message: "Please input your username!" }]}
                  // validateStatus="success"
                  // hasFeedback
                >
                  <Input style={{ width: "700px" }} />
                </Form.Item>
                <Form.Item
                  label="广州市人社局微信公众号"
                  name="api_GZSRSJWX"
                  rules={[{ message: "Please input your username!" }]}
                >
                  <Input style={{ width: "700px" }} />
                </Form.Item>
                <Form.Item
                  label="穗好办APP"
                  name="api_SHBAPP"
                  rules={[{ message: "Please input your username!" }]}
                >
                  <Input style={{ width: "700px" }} />
                </Form.Item>
                <h2>出口配置</h2>
                <Form.Item
                  label="广东省政务综合服务平台"
                  name="api_GDZWFWPT"
                  rules={[{ message: "Please input your username!" }]}
                >
                  <Input style={{ width: "700px" }} />
                </Form.Item>
                <Form.Item
                  label="智能服务机器人云平台"
                  name="api_ZNFWJQRPT"
                  rules={[{ message: "Please input your username!" }]}
                >
                  <Input style={{ width: "700px" }} />
                </Form.Item>
                <h2>其他配置</h2>
                <Form.Item
                  label="百度地图"
                  name="api_BDDT"
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
                  {/* {getMyState(0)} */}
                  {interfaceStatus.GZSRSJGW}
                </Form.Item>
                <Form.Item
                  label="广州人设微信公众号接口"
                  name="OfficialWebsite"
                >
                  {interfaceStatus.GZSRSJWX}
                </Form.Item>
                <Form.Item label="穗好办APP接口" name="OfficialWebsite">
                  {interfaceStatus.SHBAPP}
                </Form.Item>
                <Form.Item
                  label="智能服务机器人云平台接口"
                  name="OfficialWebsite"
                >
                  {interfaceStatus.ZNFWJQRYPT}
                </Form.Item>
                <Form.Item
                  label="广东省政务服务综合平台接口"
                  name="OfficialWebsite"
                >
                  {interfaceStatus.GDZWFWPT}
                </Form.Item>
                <Form.Item label="百度地图接口" name="OfficialWebsite">
                  {interfaceStatus.BDDT}
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="日志路径查看" key="4">
          <Form labelCol={{ span: 4 }}>
            <Form.Item label="系统日志路径" name="SystemLogPath" width="200px">
              {logPath.systemLogPath}
            </Form.Item>
            <Form.Item label="数据库日志路径" name="DatabaseLogPath">
              {logPath.databaseLogPath}
            </Form.Item>
            <Form.Item label="操作系统日志路径" name="OSLogPath">
              {logPath.OSLogPath}
            </Form.Item>
            <Form.Item label="中间件日志路径" name="MiddleWareLogPath">
              {logPath.middlewareLogPath}
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
      <Demo />
    </>
  );
}
