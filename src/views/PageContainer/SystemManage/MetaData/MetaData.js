import {useEffect, useState} from 'react'
import {Button, Card, Col, Divider, Form, Input, message, Row, Tabs, Typography, Upload} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import * as echarts from 'echarts'
import api from '../../../../api/systemBasic'
import apiLog from '../../../../api/log'
import apiMeta from '../../../../api/systemMetadata'
import './MetaData.css'
import UsersChart from './UsersChart'

const {Title, Paragraph} = Typography
const {TabPane} = Tabs
let myChart = undefined // echarts全局变量

// 元数据查看的条形图
const BarChart = ({data, id, today}) => {
  if (myChart != null && myChart !== '' && myChart !== undefined) myChart.dispose() // 销毁

  useEffect(() => {
    const chartDom = document.getElementById(id)
    myChart = echarts.init(chartDom)
    myChart.setOption({
      title: {
        text: '事项数目', subtext: '5000', textStyle: {
          fontSize: '12px', fontWeight: 'normal',
        }, subtextStyle: {
          fontSize: '20px', fontWeight: 'bolder',
        },
      }, tooltip: {
        trigger: 'item', position: () => 'top',
      }, xAxis: {
        type: 'category',
      }, yAxis: {
        type: 'value', show: false,
      }, series: [{
        data: data, type: 'bar',
      },],
    })
  })
  return <div
    style={{
      width: '250px', height: '170px', display: 'inline-block',
    }}
  >
    <div id={id} style={{width: '100%', height: '100%'}}/>
    <Divider style={{marginTop: '-42px', marginBottom: '0px'}}/>
    <div>
      <Paragraph style={{marginLeft: '12px', marginRight: '20px'}}>
        更改条数 +{today}
      </Paragraph>
    </div>
  </div>
}
// 元数据查看的折线图
const LineChart = ({data, id, today}) => {
  useEffect(() => {
    const chartDom = document.getElementById(id)
    if (myChart != null && myChart !== '' && myChart !== undefined) myChart.dispose() // 销毁

    const myChart0 = echarts.init(chartDom)
    myChart0.setOption({
      tooltip: {
        trigger: 'axis', position(pt) {
          return [pt[0], '10%']
        },
      }, title: {
        left: 'left', text: '今日事项浏览次数', subtext: today, textStyle: {
          fontSize: '12px', fontWeight: 'normal',
        }, subtextStyle: {
          fontSize: '20px', fontWeight: 'bolder',
        },
      }, xAxis: {
        type: 'time', boundaryGap: false,
      }, yAxis: {
        type: 'value', boundaryGap: [0, '100%'], show: false,
      }, series: [{
        name: '今日事项浏览次数', type: 'line', smooth: true, symbol: 'none', areaStyle: {}, data: data,
      },],
    })
  })
  return <div
    style={{
      width: '250px', height: '170px', display: 'inline-block',
    }}
  >
    <div id={id} style={{width: '100%', height: '100%'}}/>
    <Divider style={{marginTop: '-42px', marginBottom: '0px'}}/>
    <div>
      <Paragraph style={{marginLeft: '12px', marginRight: '20px'}}>
        近15日日均访问量 14512 {/* todo by lhy ??? */}
      </Paragraph>
    </div>
  </div>
}
export default function MetaData() {
  const [websiteSettingsForm] = Form.useForm()
  const [coreSettingsForm] = Form.useForm()
  const [interfaceConfigurationForm] = Form.useForm()

  let files = {
    backstageLogoFile: null,
    websiteLogoFile: null,
    addressBarIconFile: null,
    officialQRCode: null,
    wechatQRCodeFile: null,
    appQRCodeFile: null
  }

  // Interface
  const [interfaceStatus, setInterfaceStatus] = useState({})

  // LogPath
  const [logPath, setLogPath] = useState({})

  // 组件初始化
  useEffect(() => {
    api.SiteSettings().then(({data: {WebsiteAbbreviation}}) => {
      websiteSettingsForm.setFieldsValue({
        WebsiteAbbreviation
      })
    })
    api.CoreSettings().then(({
                               data: {
                                 data: {
                                   ICP_record_number,
                                   copyright,
                                   network_record_number,
                                   siteCode,
                                   url_about_us,
                                   url_contact_detail,
                                   url_help,
                                   url_icp_record,
                                   url_network_record,
                                   url_privacy_security,
                                   url_website_map,
                                   url_website_statement
                                 }
                               }
                             }) => coreSettingsForm.setFieldsValue({
      ICP_record_number,
      network_record_number,
      url_about_us,
      url_contact_detail,
      url_privacy_security,
      url_website_statement,
      url_website_map,
      url_help,
      url_icp_record,
      url_network_record,
      copyright,
      siteCode
    }))
    api.GetInterfaceUrl().then(({
                                  data: {
                                    data: {
                                      api_BDDT, api_GDZWFWPT, api_GZSRSJGW, api_GZSRSJWX, api_SHBAPP, api_ZNFWJQRPT
                                    }
                                  }
                                }) => interfaceConfigurationForm.setFieldsValue({
      api_GZSRSJGW, api_GZSRSJWX, api_SHBAPP, api_GDZWFWPT, api_ZNFWJQRPT, api_BDDT,
    }))
    getLog()
  }, [])

  function onFinish() {
    // todo
    // 上传各种图片的流程是相似的。为了减少代码量，只将有区别的部分用数组存储
    for (let {api: api1, error, fileName, success} of [{
      fileName: 'websiteLogoFile',
      api: apiMeta.webSiteLogo,
      success: '网站logo上传成功.',
      error: '网站logo上传失败.'
    }, {
      fileName: 'addressBarIconFile',
      api: apiMeta.addressBarIcon,
      success: '地址栏图标上传成功.',
      error: '地址栏图标上传失败.'
    }, {
      fileName: 'backstageLogoFile',
      api: apiMeta.backstageLogo,
      success: '首页轮播图上传成功',
      error: '首页轮播图上传失败'
    }, {
      fileName: 'officialQRCode',
      api: apiMeta.officialQRCode,
      success: '官网二维码上传成功',
      error: '官网二维码上传失败'
    }, {
      fileName: 'wechatQRCodeFile',
      api: apiMeta.wechatOfficialAccountQRCode,
      success: '公众号二维码上传成功',
      error: '公众号二维码上传失败'
    }, {
      fileName: 'appQRCodeFile',
      api: apiMeta.appQRCode,
      success: 'APP二维码上传成功',
      error: 'APP二维码上传失败'
    }]) {
      if (files[fileName]) {
        const data = new FormData()
        data.append('file', files[fileName])
        api1(data).then(() => {
          files[fileName] = null
          message.success(success).then()
        }).catch(() => message.error(error))
      }
    }
  }

  const ChangeCoreSettings = (values) => {
    api.ChangeCoreSettings(values).then()
    message.success('核心设置修改成功').then()
  }

  const ChangeInterfaceConfiguration = (values) => {
    api.SetInterfaceUrl(values).then()
    message.success('接口修改成功').then()
  }

  const onFinishFailed = errorInfo => alert('Failed:' + errorInfo)
  const [logData15, setLogData15] = useState(false)
  const [logToday, setLogToday] = useState(false)
  const [itemBrowseCount15, setItemBrowseCount15] = useState(false)
  const [itemBrowseCountToday, setItemBrowseCountToday] = useState(false)

  const getLog = () => {
    apiLog.MetaDataLog().then(({data}) => {
      setLogData15(data)
      setLogToday(data[data.length - 1][1])
    })
    apiLog.ItemBrowseCount().then(({data}) => {
      setItemBrowseCount15(data)
      setItemBrowseCountToday(data[data.length - 1][1])
    })
  }

  useEffect(() => {
    api.GetNetworkStatus().then(({data: {data}}) => {
      setInterfaceStatus(data)
    }).catch((error) => console.log(error))
    api.GetLogPath().then(({data}) => {
      setLogPath(data)
    }).catch((error) => console.log(error))
    getLog()
  }, [])

  function getMyState(data) {
    if (data === 0) return <span style={{color: '#63c044'}}>良好</span>
    else return <span style={{color: 'red'}}>不良</span>
  }

  return <div className="card-container">
    <Tabs type="card">
      <TabPane tab="元数据查看" key="1">
        <div style={{padding: '5px', backgroundColor: '#eeeeee'}}>
          <Row gutter={10}>
            <Col span={8}>
              {' '}
              <Card size="small">
                <UsersChart id="xi"/>
              </Card>
            </Col>
            <Col span={8}>
              {' '}
              <Card size="small">
                <LineChart
                  id="ha"
                  data={itemBrowseCount15}
                  today={itemBrowseCountToday}
                />
              </Card>
            </Col>
            <Col span={8}>
              {' '}
              <Card size="small">
                <BarChart id="ww" data={logData15} today={logToday}/>
              </Card>
            </Col>
          </Row>
        </div>
        <Divider/>
      </TabPane>
      <TabPane tab="网站设置" key="2">
        <Form
          labelCol={{span: 4}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={websiteSettingsForm}
          name="websiteSettings"
        >
          <Form.Item label="网站简称" name="WebsiteAbbreviation"
                     rules={[{message: 'Please input your username!'}]}> 智能咨询平台 </Form.Item>
          <Form.Item label="网站logo" name="WebsiteLogo" layout="inline">
            <Upload
              listType="picture"
              className="upload-list-inline"
              accept=".png"
              beforeUpload={file => {
                files.websiteLogoFile = file
                return false
              }}
              name="websiteLogo"
              maxCount={1}
            >
              <Button icon={<UploadOutlined/>}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="首页轮播图" name="BackstageLogo">
            <Upload
              listType="picture"
              className="upload-list-inline"
              accept=".png"
              beforeUpload={file => {
                files.backstageLogoFile = file
                return false
              }}
              maxCount={1}
              name="logo"
            >
              <Button icon={<UploadOutlined/>}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="地址栏图标" name="AddressBarIcon" layout="inline">
            <Upload
              listType="picture"
              className="upload-list-inline"
              accept=".png"
              beforeUpload={file => {
                files.addressBarIconFile = file
                return false
              }}
              maxCount={1}
              name="addressBarIconFile"
            >
              <Button icon={<UploadOutlined/>}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="广州市人设局官网" name="QRCode" layout="inline">
            <Upload
              listType="picture"
              className="upload-list-inline"
              accept=".png"
              beforeUpload={file => {
                files.officialQRCode = file
                return false
              }}
              maxCount={1}
              name="QRCode"
            >
              <Button icon={<UploadOutlined/>}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="广州市人设局公众号" name="QRCode" layout="inline">
            <Upload
              listType="picture"
              className="upload-list-inline"
              accept=".png"
              beforeUpload={file => {
                files.wechatQRCodeFile = file
                return false
              }}
              maxCount={1}
              name="QRCode"
            >
              <Button icon={<UploadOutlined/>}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="穗好办APP" name="QRCode" layout="inline">
            <Upload
              listType="picture"
              className="upload-list-inline"
              accept=".png"
              beforeUpload={file => {
                files.appQRCodeFile = file
                return false
              }}
              maxCount={1}
              name="QRCode"
            >
              <Button icon={<UploadOutlined/>}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item wrapperCol={{offset: 10, span: 16}}>
            <Button type="primary" htmlType="submit">
              确认更改
            </Button>
          </Form.Item>
        </Form>
      </TabPane>
      <TabPane tab="核心设置" key="3">
        <Form
          labelCol={{span: 4}}
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
            rules={[{message: 'Please input network_record_number!'}]}
          >
            <Input style={{width: '700px'}}/>
          </Form.Item>
          <Form.Item
            label="粤ICP备案号"
            name="ICP_record_number"
            rules={[{message: 'Please input ICP_record_number!'}]}
          >
            <Input style={{width: '700px'}}/>
          </Form.Item>
          <h2>网页下方超链接设置</h2>
          <Form.Item
            label="关于我们"
            name="url_about_us"
            rules={[{message: 'Please input url_about_us!'}]}
          >
            <Input style={{width: '700px'}}/>
          </Form.Item>
          <Form.Item
            label="联系方式"
            name="url_contact_detail"
            rules={[{message: 'Please input url_contact_detail!'}]}
          >
            <Input style={{width: '700px'}}/>
          </Form.Item>
          <Form.Item
            label="隐私安全"
            name="url_privacy_security"
            rules={[{message: 'Please input url_privacy_security!'}]}
          >
            <Input style={{width: '700px'}}/>
          </Form.Item>
          <Form.Item
            label="网站声明"
            name="url_website_statement"
            rules={[{message: 'Please input url_website_statement!'}]}
          >
            <Input style={{width: '700px'}}/>
          </Form.Item>
          <Form.Item
            label="网站地图"
            name="url_website_map"
            rules={[{message: 'Please input url_website_map!'}]}
          >
            <Input style={{width: '700px'}}/>
          </Form.Item>
          <Form.Item
            label="使用帮助"
            name="url_help"
            rules={[{message: 'Please input url_help!'}]}
          >
            <Input style={{width: '700px'}}/>
          </Form.Item>
          <Form.Item
            label="粤公安网备"
            name="url_icp_record"
            rules={[{message: 'Please input url_icp_record!'}]}
          >
            <Input style={{width: '700px'}}/>
          </Form.Item>
          <Form.Item
            label="粤ICP备案"
            name="url_network_record"
            rules={[{message: 'Please input url_network_record!'}]}
          >
            <Input style={{width: '700px'}}/>
          </Form.Item>
          <h2>其他设置</h2>
          <Form.Item
            label="版权所有"
            name="copyright"
            rules={[{message: 'Please input copyright!'}]}
          >
            <Input style={{width: '700px'}}/>
          </Form.Item>
          <Form.Item
            label="网站标识码"
            name="siteCode"
            rules={[{message: 'Please input siteCode!'}]}
          >
            <Input style={{width: '700px'}}/>
          </Form.Item>
          <Form.Item wrapperCol={{offset: 10, span: 16}}>
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
              labelCol={{span: 5}}
              onFinish={ChangeInterfaceConfiguration}
              onFinishFailed={onFinishFailed}
              form={interfaceConfigurationForm}
              labelAlign="left"
            >
              <h2>入口配置</h2>
              <Form.Item
                label="广州市人社局官网"
                name="api_GZSRSJGW"
                rules={[{message: 'Please input your username!'}]}
              >
                <Input style={{width: '700px'}}/>
              </Form.Item>
              <Form.Item
                label="广州市人社局微信公众号"
                name="api_GZSRSJWX"
                rules={[{message: 'Please input your username!'}]}
              >
                <Input style={{width: '700px'}}/>
              </Form.Item>
              <Form.Item
                label="穗好办APP"
                name="api_SHBAPP"
                rules={[{message: 'Please input your username!'}]}
              >
                <Input style={{width: '700px'}}/>
              </Form.Item>
              <h2>出口配置</h2>
              <Form.Item
                label="广东省政务综合服务平台"
                name="api_GDZWFWPT"
                rules={[{message: 'Please input your username!'}]}
              >
                <Input style={{width: '700px'}}/>
              </Form.Item>
              <Form.Item
                label="智能服务机器人云平台"
                name="api_ZNFWJQRPT"
                rules={[{message: 'Please input your username!'}]}
              >
                <Input style={{width: '700px'}}/>
              </Form.Item>
              <h2>其他配置</h2>
              <Form.Item
                label="百度地图"
                name="api_BDDT"
                rules={[{message: 'Please input your username!'}]}
              >
                <Input style={{width: '700px'}}/>
              </Form.Item>
              <Form.Item wrapperCol={{offset: 10, span: 16}}>
                <Button type="primary" htmlType="submit">
                  确认更改
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={6}>
            <Form
              labelCol={{span: 15}}
              labelAlign="left"
            >
              <Title level={4}>服务器与接口状态</Title>
              <Form.Item label="服务器网络" name="OfficialWebsite">
                {getMyState(1)}
              </Form.Item>
              <Form.Item label="广州市人社局接口" name="OfficialWebsite">
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
        <Form labelCol={{span: 4}}>
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
}