import React, {useEffect, useState} from 'react'
import {Dropdown, Space, Menu, Button, Table, Modal, message} from 'antd'
import {getYMD} from "../../../../../utils/TimeStamp"
import api from '../../../../../api/item'
import SelectForm from './SelectForm'
import {
    getItemGuideWithAuditOpinionsOnDetailFormat, getItemGuideWithAuditOpinionsOnExportFormat,
    getItemsDataOnTableFormat, itemDetailTitle,
    itemStatusScheme
} from "../../../../../api/itemAdapter";
import jsonToExcel from "../../../../../utils/JsonToExcel";
import {ExclamationCircleOutlined} from "@ant-design/icons";

export default function ManageProcess(props) {
    // 页面的基础数据
    const [tableData, setTableData] = useState([])
    const [originData, setOriginData] = useState({})
    const [tableLoading, setTableLoading] = useState(true)
    const [unableCreate, setUnableCreate] = useState(true)
    const [guideDetail, setGuideDetail] = useState([])
    const [isDetailShown, setIsDetailShown] = useState(false)
    // 状态映射表
    const [statusScheme, setStatusScheme] = useState({})
    const [statusType, setStatusType] = useState([])
    // 该身份可处理的事项状态类型
    const [fullType, setFullType] = useState([])
    // 是否正在删除，以及删除队列
    const [deletingIds, setDeletingIds] = useState([])
    // 用于获取批量处理的事项规则id
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [isBatching, setIsBatching] = useState(false)
    const onSelectionChange = (keys, row) => {
        setIsBatching(keys.length > 0)
        setSelectedRowKeys(keys)
        setSelectedRows(row)
        console.log('selectedRows', row)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectionChange,
    }
    // 当前展示的页数，用于重置时归零
    const [current, setCurrent] = useState(0)
    const [currPageSize, setCurrPageSize] = useState(10)
    const [totalSize, setTotalSize] = useState(0)


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
        {
            title: '实施主体名称',
            dataIndex: 'service_agent_name',
            key: 'service_agent_name',
            width: 125
        },
        // {
        //     title: '机构',
        //     dataIndex: 'department_name',
        //     key: 'department_name',
        //     width: 100
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
                <Space size='middle'>
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
                            {
                                'unbind' in statusScheme[record.item_status].buttons &&
                                <Menu.Item key='0'>
                                    <Button type='primary' style={{width: 88}} onClick={function () {
                                        deleteSingleItem(record._id)
                                    }}>
                                        解绑
                                    </Button>
                                </Menu.Item>
                            }
                            {
                                'submit' in statusScheme[record.item_status].buttons &&
                                <Menu.Item style={{display: 'flex'}} key='1'>
                                    <Button type='primary' onClick={function () {
                                        changeItemStatus(record._id, statusScheme[record.item_status].next_status.next)
                                    }}>
                                        提交审核
                                    </Button>
                                </Menu.Item>
                            }
                            {
                                'detail' in statusScheme[record.item_status].buttons &&
                                <Menu.Item style={{display: 'flex'}} key='2'>
                                    <Button type='primary' onClick={function () {
                                        getGuideDetail(record._id)
                                    }}>
                                        查看详情
                                    </Button>
                                </Menu.Item>
                            }
                            {
                                'cancel' in statusScheme[record.item_status].buttons &&
                                <Menu.Item style={{display: 'flex'}} key='3'>
                                    <Button type='primary' onClick={function () {
                                        changeItemStatus(record._id, statusScheme[record.item_status].next_status.cancel)
                                    }}>
                                        取消审核
                                    </Button>
                                </Menu.Item>
                            }
                            {
                                'recall' in statusScheme[record.item_status].buttons &&
                                <Menu.Item style={{display: 'flex'}} key='4'>
                                    <Button style={{backgroundColor: 'red', color: 'white', width: 88}}
                                            onClick={function () {
                                                changeItemStatus(record._id, statusScheme[record.item_status].next_status.recall)
                                            }}>
                                        撤回
                                    </Button>
                                </Menu.Item>
                            }
                            {
                                'cancelRecall' in statusScheme[record.item_status].buttons &&
                                <Menu.Item style={{display: 'flex'}} key='5'>
                                    <Button style={{backgroundColor: 'red', color: 'white'}} onClick={function () {
                                        changeItemStatus(record._id, statusScheme[record.item_status].next_status.cancel)
                                    }}>
                                        取消撤回
                                    </Button>
                                </Menu.Item>
                            }
                        </Menu>
                    }
                    placement='bottomCenter'
                    trigger={['click', 'hover']}
                    getPopupContainer={(triggerNode) => {
                        return triggerNode.parentNode
                    }}
                >
                    <Button
                        type='primary'
                        style={{width: 88}}
                    >
                        操作
                    </Button>
                </Dropdown>
            )
        }
    ]

    const handleCreate = () => {
        props.setPageType(2)
    }

    const batchSubmission = () => {
        // 判断是否所有选择的事项都是未提交审核的状态
        const canBatchSubmission = selectedRows.every(item => {
            return item.item_status === 0
        })

        if (canBatchSubmission) {
            // 所有要提交审核的事项的 _id 的数组
            const itemIdArray = selectedRows.filter(item => {
                // 过滤出所有可以提交审核的事项（item_status === 0)，因为前面有判断，其实这一步可以省略
                return item.item_status === 0
            }).map(item => {
                // 转化为合适的数据类型
                return {
                    item_id: item._id,
                    next_status: 1
                }
            })

            setTableLoading(true)

            api.ChangeItemStatus({
                user_id: props.userId,
                items: itemIdArray
            }).then(() => {
                message.success('批量提交审核成功')
            }).catch(error => {
                message.error('批量提交审核失败：', error.message)
            }).finally(() => {
                // 更新完毕后重新获取事项
                getItems()
            })
        } else {
            // 如果有事项处于不可提交审核的状态，弹出对话框提示不能批量提交，并引导修改
            Modal.confirm({
                title: '批量提交审核失败',
                icon: <ExclamationCircleOutlined />,
                content: '批量选择中包含了“未提交审核”以外的其他状态的事项。批量提交审核前请取消这些事项的选择。',
                okText:'确认',
                cancelButtonProps:{
                    style:{
                        display:'none'
                    }
                },
            });
        }
    }


    /**
     * 根据所给的一组事项 _id 来导出带有审核意见的事项指南详情 csv 文件
     * @param {string[]} itemIdArray 需要导出的事项指南的事项 _id 数组
     * @return {Promise<void>}
     */
    const exportGuides = async (itemIdArray) => {
        try {
            let allDetails = []

            for (let itemId of itemIdArray) {
                // 获取符合导出格式的事项详情数据
                let detail = await getItemGuideWithAuditOpinionsOnExportFormat(itemId)
                allDetails.push(detail)
            }

            // 导出
            jsonToExcel(Object.values(itemDetailTitle), allDetails, '未命名.csv')
            message.info('正在导出...')
        } catch (err) {
            message.error('导出错误，请稍后重试')
        }
    }

    /**
     * 根据 data 中的条件来获取对应的表格数据，并刷新表格状态
     * @param data {*} （TODO: 重构时没找到接口文档，注释待补充）
     */
    const getAndRefreshTableData = (data) => {
        getItemsDataOnTableFormat(data).then(res => {
            setTotalSize(res.total)
            setTableData(res.items)
            setTableLoading(false)
        }).catch(error => {
            console.dir('err')
            console.dir(error)
            props.showError('获取事项失败！', error.message)
            setTableLoading(false)
        })
    }

    const getItems = () => {
        setTableLoading(true)
        let data = originData
        data['page_num'] = current
        data['page_size'] = currPageSize
        getAndRefreshTableData(data)
    }

    const deleteSingleItem = (id) => {
        // 删除单个事项，将事项id设为deletingIds
        let str = '确定解绑该节点吗？'
        Modal.confirm({
            centered: true,
            title: '解绑确认',
            content: str,
            onOk: function () {
                finishDeleting([id])
            }
        })
    }

    const handleBatchDelete = () => {
        // 删除多个事项，将selectedRowKeys全部推进deletingIds
        let str = '确定解绑该' + selectedRowKeys.length + '个节点吗？'
        Modal.confirm({
            centered: true,
            title: '解绑确认',
            content: str,
            onOk: function () {
                withDrawItems(selectedRowKeys)
            },
            style: {whiteSpace: 'pre-wrap'}
        })
    }

    /**
     * 批量解绑事项
     * @param selectedIDs {*[]} 勾选的的事项 id 数组
     */
    const withDrawItems = (selectedIDs) => {
        if(selectedIDs instanceof Array && selectedIDs.length > 0) {
            // 让表格加载中
            setTableLoading(true)

            const data = {
                items: selectedIDs
            }

            // 根据事项规则 id 解绑事项，删除完之后重新载入事项
            api.WithDrawItems(data).then(() => {
                props.showSuccess()
            }).catch(error => {
                // 删除报错时，弹出报错框并重新加载数据
                props.showError('解绑事项失败！', error.message)
            }).finally(()=>{
                getItems()
                setTableLoading(false)
            })
        } else {
            message.warn('请先选择要批量解绑的事项。')
        }
    }

    const finishDeleting = (id) => {
        // 确定删除，调用接口，通过hook触发
        setTableLoading(true)
        setDeletingIds(id)
    }

    useEffect(function () {
        // 避免初始化触发或误触发
        if (deletingIds.length === 0) return
        deleteItems()
    }, [deletingIds])

    const deleteItems = () => {
        let data = {
            items: deletingIds
        }
        // 根据事项规则id删除事项规则，删除完之后重新载入事项规则
        api.DeleteItems(data).then(() => {
            getItems()
            props.showSuccess()
        }).catch(error => {
            // 删除报错时，弹出报错框并重新加载数据
            getItems()
            setCurrent(0)
            props.showError('解绑事项失败！', error.message)
        })
    }

    const changeItemStatus = (item_id, next_status) => {
        setTableLoading(true)
        // 更新事项状态的接口
        let items = [{
            item_id: item_id,
            next_status: next_status
        }]

        api.ChangeItemStatus({
            user_id: props.userId,
            items: items
        }).then(() => {
            // 更新完毕后重新获取事项
            getItems()
        }).catch(error => {
            getItems()
            setCurrent(0)
            props.showError('更新事项状态失败！', error.message)
        })
    }

    const searchItems = (data) => {
        setTableLoading(true)
        setCurrent(0)
        setOriginData(data)

        // 搜索事项
        let totalData = data
        totalData['page_num'] = 0
        totalData['page_size'] = currPageSize
        getAndRefreshTableData(totalData)
    }

    const resetSearch = () => {
        // 重置搜索，搜索内容清零
        setCurrent(0)
        setOriginData({
            'item_status': fullType
        })
        setTableLoading(true)

        getAndRefreshTableData({
            page_num: 0,
            page_size: currPageSize,
            item_status: fullType
        })
    }

    const changePage = (page, pageSize) => {
        setTableLoading(true)
        // 换页时清空选择
        setSelectedRowKeys([])
        setSelectedRows([])
        setIsBatching(false)

        setCurrent(page - 1)
        setCurrPageSize(pageSize)
        // 换页的内容获取
        let totalData = originData
        totalData['page_num'] = page - 1
        totalData['page_size'] = pageSize
        getAndRefreshTableData(totalData)
    }

    const getGuideDetail = async (_id) => {
        try {
            setTableLoading(true)
            const detailTable = await getItemGuideWithAuditOpinionsOnDetailFormat(_id)
            setTableLoading(false)
            setGuideDetail(detailTable)
        } catch (err) {
            setTableLoading(false)
            props.showError('获取事项详情失败！')
        }
    }

    const endShowing = () => {
        setIsDetailShown(false)
        setGuideDetail([])
    }

    useEffect(function () {
        if (guideDetail.length > 0) {
            setIsDetailShown(true)
        }
    }, [guideDetail])

    const getItemStatusScheme = async () => {
        try {
            const scheme = await itemStatusScheme
            const type = []
            const fullType = []
            for (let key in scheme) {
                // 除了审核不通过之外都是可获取事项
                if (scheme[key].eng_name !== 'Failure') {
                    for (let i = 0; i < props.canOperate.length; i++) {
                        if (key === props.canOperate[i] + '') {
                            type.push({
                                label: scheme[key].cn_name,
                                value: parseInt(key)
                            })
                            fullType.push(parseInt(key))
                        }
                    }
                }
            }

            setStatusType(type)
            setFullType(fullType)
            setStatusScheme(scheme)
        } catch (err) {
            props.showError('初始化状态表失败，请刷新重试！', err.message)
            console.dir(err)
        }
    }

    useEffect(async () => {
        if (Object.keys(props.regionRoot).length
            && Object.keys(props.ruleRoot).length
            && Object.keys(props.canOperate).length) {
            await getItemStatusScheme()
        }
    }, [props.regionRoot, props.ruleRoot, props.canOperate])

    useEffect(() => {
        if (Object.keys(statusScheme).length) {
            // 若是跳转过来进行解绑的，处理绑定数据
            if (Object.keys(props.bindedData).length) {
                let data = {}
                if ('rule_id' in props.bindedData) {
                    data['rule_id'] = props.bindedData.rule_id
                }
                if ('region_code' in props.bindedData) {
                    data['region_code'] = props.bindedData.region_code
                }
                setOriginData(data)
                searchItems(data)
                // 只设置一次
                props.setBindedData({})
            }

            if (props.jumpCode && props.jumpCode !== '') {
                let data = {
                    'task_code': [props.jumpCode]
                }
                setOriginData(data)
                searchItems(data)
                props.setJumpCode('')
                setUnableCreate(false)
            } else {
                setCurrent(0)
                setUnableCreate(false)
                setOriginData({})
                resetSearch()
            }
        }
    }, [statusScheme])

    return (
        <>
            <Space direction='vertical' size={12} style={{width: '100%'}}>
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
                        rowKey='detailType'
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            wordBreak: 'break-all',
                            minWidth: '700px',
                        }}/>
                </Modal>
                <SelectForm getSearch={searchItems}
                            reset={resetSearch}
                            searchData={props.searchData}
                            setOriginData={setOriginData}
                            fullType={fullType}
                            jumpCode={props.jumpCode}
                            bindedData={props.bindedData}
                            setBindedData={props.setBindedData}
                            statusType={statusType}/>
                <Space direction='horizontal' size={12} style={{
                    display: "flex",
                    justifyContent: 'flex-end'
                }}>
                    <Button type='primary' disabled={unableCreate} onClick={handleCreate}>绑定事项</Button>
                    <Button type='primary' disabled={!isBatching} onClick={batchSubmission}>批量提交审核</Button>
                    <Button type='primary' disabled={!isBatching} onClick={() => {
                        exportGuides(selectedRowKeys)
                    }}>批量导出</Button>
                    <Button type='primary' disabled={!isBatching} onClick={handleBatchDelete}>批量解绑</Button>
                </Space>
                <Table
                    rowSelection={rowSelection}
                    columns={tableColumns}
                    dataSource={tableData} rowKey='_id'
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
