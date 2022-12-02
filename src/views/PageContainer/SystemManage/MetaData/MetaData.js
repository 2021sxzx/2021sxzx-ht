import {useEffect, useState} from 'react'
import {Button, Card, Col, Divider, Form, Input, message, Row, Tabs, Typography, Upload} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import apiMeta from '../../../../api/systemMetadata'
import './MetaData.css'
import LineChart from './components/Chart/LineChart'

const {Title} = Typography
const {TabPane} = Tabs

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
        appQRCodeFile: null,
        userManual: null,
    }

    // Interface
    const [interfaceStatus, setInterfaceStatus] = useState({})

    // LogPath
    const [logPath, setLogPath] = useState({})

    // 组件初始化
    useEffect(() => {
        // 获取核心设置的内容
        apiMeta.CoreSettings()
            .then(({
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
                   }) => {
                coreSettingsForm.setFieldsValue({
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
                })
            })

        // 获取接口设置中的接口 url
        apiMeta.GetInterfaceUrl()
            .then(({
                       data: {
                           data: {
                               api_BDDT,
                               api_GDZWFWPT,
                               api_GZSRSJGW,
                               api_GZSRSJWX,
                               api_SHBAPP,
                               api_ZNFWJQRPT
                           }
                       }
                   }) => {
                interfaceConfigurationForm.setFieldsValue({
                    api_GZSRSJGW,
                    api_GZSRSJWX,
                    api_SHBAPP,
                    api_GDZWFWPT,
                    api_ZNFWJQRPT,
                    api_BDDT,
                })
            })
    }, [])

    function onFinish() {
        // 上传图片（二维码）
        const data = new FormData()
        let empty = true
        for (let fileName of ['websiteLogoFile', 'addressBarIconFile', 'backstageLogoFile',
            'officialQRCode', 'wechatQRCodeFile', 'appQRCodeFile']) {
            if (files[fileName]) {
                data.append(fileName, files[fileName])
                files[fileName] = null
                empty = false
            }
        }
        if (!empty) {
            apiMeta.websiteSettings(data).then(() => {
                message.success('图片上传成功')
            }).catch(() => {
                message.error('图片上传失败')
            })
        }

        // 上传用户手册
        if (files.userManual) { // 如果用户手册有上传文件的话就上传，没有就忽略
            const data = new FormData()
            data.append('userManual', files.userManual)
            files.userManual = null
            apiMeta.uploadUserManual(data).then(() => {
                message.success('上传用户手册成功')
            }).catch(()=>{
                message.error('上传用户手册失败')
            })
        }
    }

    const ChangeCoreSettings = (values) => {
        apiMeta.ChangeCoreSettings(values).then()
        message.success('核心设置修改成功').then()
    }

    const ChangeInterfaceConfiguration = (values) => {
        apiMeta.SetInterfaceUrl(values).then()
        message.success('接口修改成功').then()
    }

    const onFinishFailed = errorInfo => alert('Failed:' + errorInfo)

    useEffect(() => {
        apiMeta.GetNetworkStatus().then(({data: {data}}) => {
            setInterfaceStatus(data)
        }).catch((error) => console.log(error))
        apiMeta.GetLogPath().then(({data}) => {
            setLogPath(data)
        }).catch((error) => console.log(error))
    }, [])

    function getMyState(data) {
        if (data === 0) return <span style={{color: '#63c044'}}>良好</span>
        else return <span style={{color: 'red'}}>不良</span>
    }

    // 检查图片格式和大小
    function imageBeforeUpload(file) {
        const isPng = file.type === 'image/png', isLt20M = file.size <= 20 * 1024 ** 2
        if (!isPng) message.error('只能上传 PNG 图片。').then()
        if (!isLt20M) message.error('文件大小须小于 20MB。').then()
        return isPng && isLt20M
    }

    return <div className="card-container">
        <Tabs type="card">
            <TabPane tab="元数据查看" key="1">
                <div style={{padding: '5px', backgroundColor: '#eeeeee'}}>
                    <Row gutter={16}>
                        <Col span={6}>
                            {' '}
                            <Card size="small">
                                <LineChart type="pv"/>
                            </Card>
                        </Col>
                        <Col span={6}>
                            {' '}
                            <Card size="small">
                                <LineChart type="uv"/>
                            </Card>
                        </Col>
                        <Col span={6}>
                            {' '}
                            <Card size="small">
                                <LineChart type="item_num"/>
                            </Card>
                        </Col>
                        <Col span={6}>
                            {' '}
                            <Card size="small">
                                <LineChart type="user_num"/>
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
                                const check = imageBeforeUpload(file)
                                if (check) files.websiteLogoFile = file
                                return check ? false : Upload.LIST_IGNORE
                                // Antd 的 Upload 有点逆天，返回 true 会自动上传，需要返回 false 禁止上传。当上传了错误的文件时，应返回 Upload.LIST_IGNORE 阻止上传
                            }}
                            name="websiteLogo"
                            maxCount={1}
                            onRemove={() => files.websiteLogoFile = null}
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
                                const check = imageBeforeUpload(file)
                                if (check) files.backstageLogoFile = file
                                return check ? false : Upload.LIST_IGNORE
                            }}
                            maxCount={1}
                            name="logo"
                            onRemove={() => files.backstageLogoFile = null}
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
                                const check = imageBeforeUpload(file)
                                if (check) files.addressBarIconFile = file
                                return check ? false : Upload.LIST_IGNORE
                            }}
                            maxCount={1}
                            name="addressBarIconFile"
                            onRemove={() => files.addressBarIconFile = null}
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
                                const check = imageBeforeUpload(file)
                                if (check) files.officialQRCode = file
                                return check ? false : Upload.LIST_IGNORE
                            }}
                            maxCount={1}
                            name="QRCode"
                            onRemove={() => files.officialQRCode = null}
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
                                const check = imageBeforeUpload(file)
                                if (check) files.wechatQRCodeFile = file
                                return check ? false : Upload.LIST_IGNORE
                            }}
                            maxCount={1}
                            name="QRCode"
                            onRemove={() => files.wechatQRCodeFile = null}
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
                                const check = imageBeforeUpload(file)
                                if (check) files.appQRCodeFile = file
                                return check ? false : Upload.LIST_IGNORE
                            }}
                            maxCount={1}
                            name="QRCode"
                            onRemove={() => files.appQRCodeFile = null}
                        >
                            <Button icon={<UploadOutlined/>}>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="用户手册" name="userManual" layout="inline">
                        <Upload
                            listType="text"
                            className="upload-list-inline"
                            accept=".pdf"
                            beforeUpload={file => {
                                if (file.type === 'application/pdf' && file.size <= 20 * 1024 ** 2) {
                                    //  如果是 pdf 文件并且文件大小小于 20M，就停止默认上传行为，将文件保存到 files 中
                                    // 保存文件信息
                                    files.userManual = file
                                    // 停止上传
                                    return false
                                } else {
                                    message.warn('请上传小于 20MB 大小的 PDF 文件。')
                                    // 列表中将不展示此文件
                                    return Upload.LIST_IGNORE
                                }
                            }}
                            maxCount={1}
                            name="userManual"
                            onRemove={() => {
                                // 删除保存的文件信息
                                files.userManual = null
                            }}
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
                        <Input maxLength={256}
                               showCount/>
                    </Form.Item>
                    <Form.Item
                        label="粤ICP备案号"
                        name="ICP_record_number"
                        rules={[{message: 'Please input ICP_record_number!'}]}
                    >
                        <Input maxLength={256}
                               showCount
                        />
                    </Form.Item>
                    <h2>网页下方超链接设置</h2>
                    <Form.Item
                        label="关于我们"
                        name="url_about_us"
                        rules={[{message: 'Please input url_about_us!'}]}
                    >
                        <Input maxLength={256}
                               showCount/>
                    </Form.Item>
                    <Form.Item
                        label="联系方式"
                        name="url_contact_detail"
                        rules={[{message: 'Please input url_contact_detail!'}]}
                    >
                        <Input maxLength={256}
                               showCount/>
                    </Form.Item>
                    <Form.Item
                        label="隐私安全"
                        name="url_privacy_security"
                        rules={[{message: 'Please input url_privacy_security!'}]}
                    >
                        <Input maxLength={256}
                               showCount/>
                    </Form.Item>
                    <Form.Item
                        label="网站声明"
                        name="url_website_statement"
                        rules={[{message: 'Please input url_website_statement!'}]}
                    >
                        <Input maxLength={256}
                               showCount/>
                    </Form.Item>
                    <Form.Item
                        label="网站地图"
                        name="url_website_map"
                        rules={[{message: 'Please input url_website_map!'}]}
                    >
                        <Input maxLength={256}
                               showCount/>
                    </Form.Item>
                    <Form.Item
                        label="使用帮助"
                        name="url_help"
                        rules={[{message: 'Please input url_help!'}]}
                    >
                        <Input maxLength={256}
                               showCount/>
                    </Form.Item>
                    <Form.Item
                        label="粤公安网备"
                        name="url_icp_record"
                        rules={[{message: 'Please input url_icp_record!'}]}
                    >
                        <Input maxLength={256}
                               showCount/>
                    </Form.Item>
                    <Form.Item
                        label="粤ICP备案"
                        name="url_network_record"
                        rules={[{message: 'Please input url_network_record!'}]}
                    >
                        <Input maxLength={256}
                               showCount/>
                    </Form.Item>
                    <h2>其他设置</h2>
                    <Form.Item
                        label="版权所有"
                        name="copyright"
                        rules={[{message: 'Please input copyright!'}]}
                    >
                        <Input maxLength={256}
                               showCount/>
                    </Form.Item>
                    <Form.Item
                        label="网站标识码"
                        name="siteCode"
                        rules={[{message: 'Please input siteCode!'}]}
                    >
                        <Input maxLength={256}
                               showCount/>
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
                                <Input maxLength={256}
                                       showCount/>
                            </Form.Item>
                            <Form.Item
                                label="广州市人社局微信公众号"
                                name="api_GZSRSJWX"
                                rules={[{message: 'Please input your username!'}]}
                            >
                                <Input maxLength={256}
                                       showCount/>
                            </Form.Item>
                            <Form.Item
                                label="穗好办APP"
                                name="api_SHBAPP"
                                rules={[{message: 'Please input your username!'}]}
                            >
                                <Input maxLength={256}
                                       showCount/>
                            </Form.Item>
                            <h2>出口配置</h2>
                            <Form.Item
                                label="广东省政务综合服务平台"
                                name="api_GDZWFWPT"
                                rules={[{message: 'Please input your username!'}]}
                            >
                                <Input maxLength={256}
                                       showCount/>
                            </Form.Item>
                            <Form.Item
                                label="智能服务机器人云平台"
                                name="api_ZNFWJQRPT"
                                rules={[{message: 'Please input your username!'}]}
                            >
                                <Input maxLength={256}
                                       showCount/>
                            </Form.Item>
                            <h2>其他配置</h2>
                            <Form.Item
                                label="百度地图"
                                name="api_BDDT"
                                rules={[{message: 'Please input your username!'}]}
                            >
                                <Input
                                    maxLength={256}
                                    showCount/>
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
                            style={{
                                margin: '20px',
                                padding: '20px',
                                border: '1px solid #CCCCCC',
                                borderRadius: '5px',
                            }}
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
