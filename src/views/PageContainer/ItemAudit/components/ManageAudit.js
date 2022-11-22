import React, {useEffect, useState} from 'react'
import {Button, Space, Table, Tabs} from 'antd'
import {getYMD, getYMDHMS} from '../../../../utils/TimeStamp'
import api from '../../../../api/rule'
import SelectForm from './SelectForm'

const {TabPane} = Tabs

export default function ManageAudit(props) {
    // 页面的基础数据
    const [tableData, setTableData] = useState([])
    const [originData, setOriginData] = useState({})
    const [tableLoading, setTableLoading] = useState(true)
    // 当前展示的页数，用于重置时归零
    const [current, setCurrent] = useState(0)
    const [currPageSize, setCurrPageSize] = useState(10)
    const [totalSize, setTotalSize] = useState(0)

    const serviceType = {
        '1': '自然人',
        '2': '企业法人',
        '3': '事业法人',
        '4': '社会组织法人',
        '5': '非法人企业',
        '6': '行政机关',
        '9': '其他组织'
    }

    const necessityType = {
        '1': '必要',
        '2': '非必要',
        '3': '容缺后补'
    }

    const typesType = {
        '1': '证件证书证明',
        '2': '申请表格文书',
        '3': '其他'
    }

    const formType = {
        '1': '纸质',
        '2': '电子化',
        '3': '纸质/电子化'
    }

    const requiredType = {
        '0': '否',
        '1': '是'
    }

    const tableColumns = [
        {
            title: '事项指南编码',
            dataIndex: 'task_code',
            key: 'task_code',
            width: 270
        },
        {
            title: '事项指南',
            dataIndex: 'item_name',
            key: 'item_name'
        },
        {
            title: '事项规则',
            dataIndex: 'item_path',
            key: 'item_path'
        },
        // {
        //   title: '机构',
        //   dataIndex: 'department_name',
        //   key: 'department_name',
        //   width: 100
        // },
        {
            title: '创建人',
            dataIndex: 'creator_name',
            key: 'creator_name',
            width: 100
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100
        },
        {
            title: '创建时间',
            key: 'create_time',
            width: 120,
            render: (text, record) => (
                <Space size="middle">
                    {getYMD(record.create_time)}
                </Space>
            )
        },
        {
            title: '操作',
            key: 'operation',
            width: 120,
            render: (text, record) => (
                <Button disabled={props.canOperate.indexOf(record.item_status) === -1} type="primary"
                        style={{width: 88}}
                        onClick={function () {
                            auditTask(record)
                        }}>
                    审核
                </Button>
            )
        }
    ]

    const searchItems = (data) => {
        setTableLoading(true)
        // 搜索事项
        setOriginData(data)
        let totalData = data
        totalData['page_num'] = 0
        totalData['page_size'] = currPageSize
        api.GetItems(totalData).then(response => {
            let items = response.data.data.data
            setCurrent(0)
            for (let i = 0; i < items.length; i++) {
                // 规则路径生成、状态码转状态名
                items[i]['creator_name'] = items[i].creator.name
                items[i]['department_name'] = items[i].creator.department_name
                items[i]['item_path'] = items[i]['rule_path'] + items[i]['region_path']
                items[i]['status'] = props.statusScheme[items[i].item_status].cn_name
            }
            setTotalSize(response.data.data.total)
            setTableData(items)
            setTableLoading(false)
        }).catch(error => {
            props.showError('搜索事项失败！')
            setTableLoading(false)
        })
    }

    const resetSearch = () => {
        // 初始化
        setCurrent(0)
        setOriginData({
            'item_status': props.canSee
        })
        setTableLoading(true)
        // 获取所有事项规则
        api.GetItems({
            page_num: 0,
            page_size: currPageSize,
            item_status: props.canSee
        }).then(response => {
            let items = response.data.data.data
            setTotalSize(response.data.data.total)
            for (let i = 0; i < items.length; i++) {
                // 规则路径生成、状态码转状态名
                items[i]['creator_name'] = items[i].creator.name
                items[i]['department_name'] = items[i].creator.department_name
                items[i]['item_path'] = items[i]['rule_path'] + items[i]['region_path']
                items[i]['status'] = props.statusScheme[items[i].item_status].cn_name
            }
            setTableLoading(false)
            setTableData(items)
        }).catch(error => {
            props.showError('重置失败！')
            setTableLoading(false)
        })
    }

    const changePage = (page, pageSize) => {
        setTableLoading(true)
        setCurrent(page - 1)
        setCurrPageSize(pageSize)
        // 换页的内容获取
        let totalData = originData
        totalData['page_num'] = page - 1
        totalData['page_size'] = pageSize
        api.GetItems(totalData).then(response => {
            let items = response.data.data.data
            setTotalSize(response.data.data.total)
            for (let i = 0; i < items.length; i++) {
                // 规则路径生成、状态码转状态名
                items[i]['creator_name'] = items[i].creator.name
                items[i]['department_name'] = items[i].creator.department_name
                items[i]['item_path'] = items[i]['rule_path'] + items[i]['region_path']
                items[i]['status'] = props.statusScheme[items[i].item_status].cn_name
            }
            setTableData(items)
            setTableLoading(false)
        }).catch(error => {
            props.showError('换页时获取事项信息失败！')
            setTableLoading(false)
        })
    }

    const auditTask = (item) => {
        setTableLoading(true)
        api.GetItemGuideAndAuditAdvises({
            item_id: item._id
        }).then(response => {
            // 将数据处理为有序格式
            let data = response.data.data
            let detailTable = []
            detailTable.push({
                'detailType': '事项名称',
                'detailInfo': data.task_name
            })
            detailTable.push({
                'detailType': '事项代码',
                'detailInfo': data.task_code
            })
            detailTable.push({
                'detailType': '事项规则',
                'detailInfo': item.item_path
            })
            detailTable.push({
                'detailType': '事项内容',
                'detailInfo': data.apply_content
            })
            // 政策依据数组处理
            let tempLegalBasis = ''
            if (data.legal_basis) {
                for (let i = 0; i < data.legal_basis.length; i++) {
                    tempLegalBasis += ((i + 1) + '.' + data.legal_basis[i].name + '\n')
                }
            }
            detailTable.push({
                'detailType': '政策依据',
                'detailInfo': tempLegalBasis
            })

            detailTable.push({
                'detailType': '申办所需审核条件',
                'detailInfo': data.conditions
            })
            // 申办材料数组处理
            detailTable.push({
                'detailType': '申办所需材料',
                'detailInfo': (!data.submit_documents || data.submit_documents.length === 0) ? '' :
                    <Tabs defaultActiveKey="0" tabPosition="left" style={{whiteSpace: 'pre-wrap'}}>
                        {
                            data.submit_documents.map((item, index) => (
                                'materials_name' in item &&
                                <TabPane tab={item.materials_name} key={index}>
                                    {
                                        ('原件数量： ' + item.origin) +
                                        ('\n复印件数量： ' + item.copy) +
                                        (item.material_form ? ('\n材料形式： ' + formType[item.material_form]) : '') +
                                        (item.page_format ? ('\n纸质材料规格： ' + item.page_format) : '') +
                                        (item.material_necessity ? ('\n是否必要： ' + necessityType[item.material_necessity]) : '') +
                                        (item.material_type ? ('\n材料类型： ' + typesType[item.material_type]) : '') +
                                        (item.submissionrequired ? ('\n是否免提交： ' + requiredType[item.submissionrequired]) : '')
                                    }
                                </TabPane>
                            ))
                        }
                    </Tabs>
            })
            // 审核时限格式处理
            let tempTimeLimit = ''
            if (data.legal_period_type) {
                tempTimeLimit += ('法定办结时限：' + data.legal_period + '个' +
                    (data.legal_period_type === '1' ? '工作日' : '自然日'))
            }
            if (data.promised_period_type) {
                if (tempTimeLimit !== '') tempTimeLimit += '\n'
                tempTimeLimit += ('承诺办结时限：' + data.promised_period + '个' +
                    (data.promised_period_type === '1' ? '工作日' : '自然日'))
            }
            detailTable.push({
                'detailType': '审核时限',
                'detailInfo': tempTimeLimit
            })
            detailTable.push({
                'detailType': '咨询平台',
                'detailInfo': data.zxpt
            })
            detailTable.push({
                'detailType': '网办PC端',
                'detailInfo': data.wsyy
            })
            detailTable.push({
                'detailType': '网办移动端',
                'detailInfo': data.mobile_applt_website
            })
            detailTable.push({
                'detailType': '自助终端',
                'detailInfo': data.zzzd
            })
            detailTable.push({
                'detailType': '网上办理流程',
                'detailInfo': data.wsbllc
            })
            detailTable.push({
                'detailType': '线下办理流程',
                'detailInfo': data.ckbllc
            })
            detailTable.push({
                'detailType': '办理点信息',
                'detailInfo': (!data.windows || data.windows.length === 0) ? '' :
                    <Tabs defaultActiveKey="1" tabPosition="left" style={{whiteSpace: 'pre-wrap'}}>
                        {
                            data.windows.map((item, index) => (
                                'name' in data.windows[index] &&
                                <TabPane tab={data.windows[index].name} key={index}>
                                    {
                                        '办理地点： ' + data.windows[index].address +
                                        '\n\n咨询及投诉电话： ' + data.windows[index].phone +
                                        '\n\n办公时间： ' + data.windows[index].office_hour
                                    }
                                </TabPane>
                            ))
                        }
                    </Tabs>
            })
            detailTable.push({
                'detailType': '二维码',
                'detailInfo': data.qr_code === '' ? '暂无' :
                    <img style={{height: 128, width: 128}} src={'/api' + data.qr_code} alt={'二维码'}/>
            })
            // 服务对象类型数组处理
            let type = data.service_object_type.split(',')
            let tempServiceType = ''
            for (let i = 0; i < type.length; i++) {
                if (tempServiceType !== '') tempServiceType += '、'
                tempServiceType += serviceType[type[i]]
            }
            detailTable.push({
                'detailType': '服务对象类型',
                'detailInfo': tempServiceType
            })
            // 审核意见处理
            let tempAdvises = ''
            if ('audit_advises' in data) {
                for (let i = data.audit_advises.length - 1; i >= 0; i--) {
                    tempAdvises += (getYMDHMS(data['audit_advises'][i].time) + '：' + data['audit_advises'][i].user_name + '：' + data['audit_advises'][i].advise + '\n')
                }
            }
            detailTable.push({
                'detailType': '审核意见',
                'detailInfo': tempAdvises
            })
            setTableLoading(false)
            props.setAuditingData(detailTable)
            props.setAuditingId(item._id)
            props.setAuditingStatus(item.item_status)
        }).catch(error => {
            setTableLoading(false)
            props.showError('获取事项详情失败！')
        })
    }

    useEffect(() => {
        // statusId和canSee都必须有
        for (let key in props.statusId) {
            for (let key in props.canSee) {
                // 初始化
                setCurrent(0)
                setOriginData({})
                resetSearch()
                break
            }
            break
        }
    }, [props.statusId, props.canSee])

    return (
        <>
            <Space direction="vertical" size={12} style={{width: '100%'}}>
                <SelectForm
                    getSearch={searchItems} reset={resetSearch} setOriginData={setOriginData}
                    statusType={props.statusType}
                    bindedData={props.bindedData} setBindedData={props.setBindedData} fullType={props.canSee}/>
                <Table
                    columns={tableColumns} dataSource={tableData} rowKey="_id"
                    pagination={{onChange: changePage, current: current + 1, total: totalSize}}
                    loading={tableLoading}/>
            </Space>
        </>
    )
}
