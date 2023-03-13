import React, {useEffect, useState} from 'react'
import {Button, Dropdown, Menu, message, Modal, Space, Table} from 'antd'
import {getYMD} from '../../../../../utils/TimeStamp'
import api from '../../../../../api/itemGuide'
import SelectForm from './SelectForm'
import {
    detailTitle,
    getItemGuideOnExportFormat,
    getItemGuideOnDetailFormat,
    getItemGuideOnTableFormat
} from '../../../../../api/itemGuideAdapter'
import jsonToExcel from "../../../../../utils/JsonToExcel";

const detailColumns = [
    {
        title: '数据类型',
        dataIndex: 'detailType',
        key: 'detailType',
        width: '20%'
    },
    {
        title: '详细信息',
        dataIndex: 'detailInfo',
        key: 'detailInfo',
        width: '80%'
    }
]

export default function ManageGuide(props) {
    // 页面的基础数据
    const [tableData, setTableData] = useState([])
    const [originData, setOriginData] = useState({})
    const [tableLoading, setTableLoading] = useState(true)
    const [guideDetail, setGuideDetail] = useState([])
    const [isDetailShown, setIsDetailShown] = useState(false)
    // 是否正在删除，以及删除队列
    const [deletingIds, setDeletingIds] = useState([])
    // 用于获取批量处理的事项规则id
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [isBatching, setIsBatching] = useState(false)
    const onSelectionChange = keys => {
        setIsBatching(keys.length > 0)
        setSelectedRowKeys(keys)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectionChange,
        getCheckboxProps: (record) => ({
            // 不允许删除中间节点
            disabled: (record.task_status === 1)
        })
    }
    // 当前展示的页数，用于重置时归零
    const [current, setCurrent] = useState(0)
    const [currPageSize, setCurrPageSize] = useState(10)
    const [totalSize, setTotalSize] = useState(0)

    const tableColumns = [
        {
            title: '事项指南编码',
            dataIndex: 'task_code',
            key: 'task_code',
            width: 320
        },
        {
            title: '事项指南',
            dataIndex: 'task_name',
            key: 'task_name'
        },
        {
            title: '实施主体名称',
            dataIndex: 'service_agent_name',
            key: 'service_agent_name',
            width: 125
        },
        // {
        //   title: '机构',
        //   dataIndex: 'department_name',
        //   key: 'department_name',
        //   width: 125
        // },
        {
            title: '负责人',
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
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item key="0">
                                <Button type="primary" style={{width: 88}} onClick={function () {
                                    modifyItemGuide(record.task_code)
                                }}>
                                    编辑
                                </Button>
                            </Menu.Item>
                            <Menu.Item key="1">
                                <Button type="primary" onClick={async () => {
                                    await showDetail(record.task_code)
                                }}>
                                    查看详情
                                </Button>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Button type="primary" style={{width: 88}} onClick={() => {
                                    exportGuides([record.task_code])
                                }}>
                                    导出
                                </Button>
                            </Menu.Item>
                            {
                                record.task_status === 0 &&
                                <Menu.Item key="3">
                                    <Button style={{backgroundColor: 'red', color: 'white', width: 88}}
                                            onClick={function () {
                                                deleteSingleItem(record.task_code)
                                            }}>
                                        删除
                                    </Button>
                                </Menu.Item>
                            }
                        </Menu>
                    }
                    trigger={['click', 'hover']}
                    getPopupContainer={(triggerNode) => {
                        return triggerNode.parentNode
                    }}
                >
                    <Button type="primary">
                        操作
                    </Button>
                </Dropdown>
            )
        }
    ]

    /**
     * 根据所给的一组事项指南编码来导出事项指南详情 csv 文件
     * @param {string[]} taskCodeArray 需要导出的事项指南的事项编码数组
     * @return {Promise<void>}
     */
    const exportGuides = async (taskCodeArray) => {
        try {
            let allDetails = []

            for (let taskCode of taskCodeArray) {
                // 获取符合导出格式的事项详情数据
                let detail = await getItemGuideOnExportFormat(taskCode)
                allDetails.push(detail)
            }

            // 导出
            jsonToExcel(Object.values(detailTitle), allDetails, '未命名.csv')
            message.info('正在导出...')
        } catch (err) {
            message.error('导出错误，请稍后重试')
        }
    }

    /**
     * 获取并展示事项详情弹窗
     * @param taskCode
     * @return {Promise<void>}
     */
    const showDetail = async (taskCode) => {
        try {
            // 根据事项编码获取事项详情
            const detail = await getItemGuideOnDetailFormat(taskCode)
            // 记录事项详情内容
            setGuideDetail(detail)
            // 展示事项详情弹窗
            setIsDetailShown(true)
        } catch (err) {
            props.showError('获取事项详情失败！')
            console.dir(err)
        }
    }

    const endShowing = () => {
        setIsDetailShown(false)
        setGuideDetail([])
    }

    const getItemGuides = () => {
        setTableLoading(true)
        let data = originData
        data['page_num'] = current
        data['page_size'] = currPageSize
        // 获取所有事项指南
        getItemGuideOnTableFormat(data).then(res => {
            setTotalSize(res.total)
            setTableData(res.guides)
            setTableLoading(false)
        }).catch(err => {
            props.showError('获取指南失败:' + err.message)
            setTableLoading(false)
        })
    }

    const deleteSingleItem = (id) => {
        // 删除单个事项，将事项id设为deletingIds
        let str = '确定删除该事项吗？'
        let nodes = [id]
        Modal.confirm({
            centered: true,
            title: '删除确认',
            content: str,
            onOk: function () {
                finishDeleting(nodes)
            }
        })
    }

    const handleBatchDelete = () => {
        // 删除多个事项，将selectedRowKeys全部推进deletingIds
        let str = '确定删除该' + selectedRowKeys.length + '个节点吗？'
        Modal.confirm({
            centered: true,
            title: '删除确认',
            content: str,
            onOk: function () {
                finishDeleting(selectedRowKeys)
            },
            style: {whiteSpace: 'pre-wrap'}
        })
    }

    const finishDeleting = (id) => {
        // 确定删除，调用接口，通过hook触发
        setDeletingIds(id)
    }

    useEffect(function () {
        // 避免初始化触发或误触发
        if (deletingIds.length === 0) return
        deleteItemGuides()
    }, [deletingIds])

    const deleteItemGuides = () => {
        let data = {
            task_code: deletingIds
        }
        // 根据事项规则id删除事项规则，删除完之后重新载入事项规则
        api.DeleteItemGuides(data).then(() => {
            getItemGuides()
            props.showSuccess()
        }).catch(() => {
            // 删除报错时，弹出报错框并重新加载数据
            props.showError('删除指南失败！')
            setCurrent(0)
            getItemGuides()
        })
    }

    const searchItemGuide = (data) => {
        setTableLoading(true)
        // 搜索时重置table
        setOriginData(data)
        let totalData = data
        totalData['page_num'] = 0
        totalData['page_size'] = currPageSize

        getItemGuideOnTableFormat(totalData).then(res => {
            setCurrent(0)
            setTotalSize(res.total)
            setTableData(res.guides)
            setTableLoading(false)
        }).catch(err => {
            props.showError('搜索指南失败:' + err.message)
            setTableLoading(false)
        })
    }

    const modifyItemGuide = (id) => {
        setTableLoading(true)
        api.GetItemGuide({
            task_code: id
        }).then(response => {
            let data = response.data.data

            let tempGuideContent = {}
            tempGuideContent['guideName'] = data.task_name
            tempGuideContent['guideCode'] = data.task_code
            tempGuideContent['guideContent'] = data.apply_content
            tempGuideContent['serviceAgentName'] = data.service_agent_name
            tempGuideContent['serviceAgentCode'] = data.service_agent_code
            let tempAccord = []
            if (data.legal_basis) {
                for (let i = 0; i < data.legal_basis.length; i++) {
                    tempAccord.push(data.legal_basis[i].name)
                }
            }
            tempGuideContent['guideAccord'] = tempAccord
            tempGuideContent['guideCondition'] = data.conditions
            tempGuideContent['guideMaterial'] = data.submit_documents
            tempGuideContent['legalPeriod'] = data.legal_period
            tempGuideContent['legalType'] = data.legal_period_type ? data.legal_period_type : '0'
            tempGuideContent['promisedPeriod'] = data.promised_period
            tempGuideContent['promisedType'] = data.promised_period_type ? data.promised_period_type : '0'
            tempGuideContent['guidePlatform'] = data.zxpt
            tempGuideContent['guidePCAddress'] = data.wsyy
            tempGuideContent['guidePEAddress'] = data.mobile_applt_website
            tempGuideContent['guideSelfmadeAddress'] = data.zzzd
            tempGuideContent['guideOnlineProcess'] = data.wsbllc
            tempGuideContent['guideOfflineProcess'] = data.ckbllc
            tempGuideContent['guideWindows'] = data.windows
            tempGuideContent['guideQRCode'] = data.qr_code
            tempGuideContent['principle'] = data.creator.name
            tempGuideContent['principleId'] = data.creator.id
            let tempServiceType = []
            if (data.service_object_type && data.service_object_type instanceof Array) {
                let type = data.service_object_type.split(',')
                for (let i = 0; i < type.length; i++) {
                    tempServiceType.push(parseInt(type[i]))
                }
            }
            tempGuideContent['guideServiceType'] = tempServiceType

            props.setModifyId(id)
            props.setModifyContent(tempGuideContent)
        }).catch(() => {
            props.showError('编辑指南时获取指南详情失败！')
        })
    }

    const handleCreate = () => {
        props.setModifyId('')
        props.setModifyContent({})
        props.setPageType(2)
    }

    const resetSearch = () => {
        setTableLoading(true)
        // 回 归 本 源
        setOriginData({})
        setCurrent(0)

        getItemGuideOnTableFormat({
            page_num: 0,
            page_size: currPageSize
        }).then(res => {
            setTotalSize(res.total)
            setTableData(res.guides)
            setTableLoading(false)
        }).catch(error => {
            props.showError('刷新表格数据失败，请检查网络并稍后尝试。' + error.message)
            setTableLoading(false)
        })
    }

    const changePage = (page, pageSize) => {
        // 换页时清空选择
        setSelectedRowKeys([])
        // 更新页面数据
        setCurrent(page - 1)
        setCurrPageSize(pageSize)
        // 只是换页的话还是用上一次的搜索条件进行筛查
        let totalData = originData
        totalData['page_num'] = page - 1
        totalData['page_size'] = pageSize
        setTableLoading(true)
        api.GetItemGuides(totalData).then(response => {
            let guides = response.data.data.data
            for (let i = 0; i < guides.length; i++) {
                guides[i]['creator_name'] = guides[i].creator.name
                guides[i]['department_name'] = guides[i].creator.department_name
                guides[i]['status'] = guides[i].task_status === 1 ? '已绑定' : '未绑定'
            }
            setTableData(guides)
            setTableLoading(false)
        }).catch(() => {
            props.showError('换页时获取指南失败！')
            setTableLoading(false)
        })
    }

    useEffect(() => {
        setCurrent(0)
        resetSearch()
    }, [])

    return (
        <>
            <Space direction="vertical" size={12} style={{width: '100%'}}>
                <Modal
                    width={800}
                    title={guideDetail.task_name}
                    visible={isDetailShown}
                    destroyOnClose={true}
                    onCancel={endShowing}
                    footer={null}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                    }}>
                    <Table
                        columns={detailColumns}
                        dataSource={guideDetail}
                        rowKey="detailType"
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            wordBreak: 'break-all'
                        }}/>
                </Modal>
                <SelectForm getSearch={searchItemGuide} reset={resetSearch} searchData={props.searchData}/>
                <Space direction="horizontal" size={12} style={{marginLeft: '75%'}}>
                    <Button type="primary" onClick={handleCreate}>创建指南</Button>
                    <Button type="primary" disabled={!isBatching} onClick={() => {
                        exportGuides(selectedRowKeys)
                    }}>批量导出</Button>
                    <Button type="primary" disabled={!isBatching} onClick={handleBatchDelete}>批量删除</Button>
                </Space>
                <Table
                    rowSelection={rowSelection}
                    columns={tableColumns}
                    dataSource={tableData}
                    rowKey="task_code"
                    pagination={{
                        onChange: changePage,
                        current: current + 1,
                        total: totalSize
                    }}
                    loading={tableLoading}/>
            </Space>
        </>
    )
}
