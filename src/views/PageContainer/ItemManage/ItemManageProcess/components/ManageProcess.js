import React, {cloneElement, useEffect, useState} from 'react'
import { Dropdown, Space, Menu, message, Button, Select, Table, Modal,Descriptions, Badge  } from 'antd';
import { getYMD } from "../../../../../utils/TimeStamp";
import api from '../../../../../api/rule';
import SelectForm from './SelectForm'

export default function ManageProcess(props) {
    // 页面的基础数据
    const [tableData, setTableData] = useState([])
    const [originData, setOriginData] = useState({})
    const [tableLoading, setTableLoading] = useState(true)
    const [unableCreate, setUnableCreate] = useState(true)
    const [guideDetail, setGuideDetail] = useState({})
    const [isDetailShown, setIsDetailShown] = useState(false)
    // 状态映射表
    const [statusScheme, setStatusScheme] = useState({})
    const [statusType, setStatusType] = useState([])
    const [fullType, setFullType] = useState([])
    // 是否正在删除，以及删除队列
    const [isDeleting, setIsDeleting] = useState(false)
    const [deletingIds, setDeletingIds] = useState([])
    // 用于获取批量处理的事项规则id
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [isBatching, setIsBatching] = useState(false)
    const onSelectionChange = keys=>{
        setIsBatching(keys.length > 0)
        setSelectedRowKeys(keys)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectionChange,
    }
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
            dataIndex: 'rule_path',
            key: 'rule_path'
        },
        {
            title: '业务部门',
            dataIndex: 'department_name',
            key: 'department_name',
            width: 100
        },
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
            render: (text, record)=>(
                <Space size='middle'>
                    {getYMD(record.create_time)}
                </Space>
            )
        },
        {
            title: '操作',
            key: 'operation',
            width: 120,
            render: (text, record)=>(
                <Dropdown overlay={
                    <Menu>
                        {
                            'unbind' in statusScheme[record.item_status].buttons &&
                            <Menu.Item key='0'>
                                <Button type='primary' style={{width: 88}} onClick={function(){
                                    deleteSingleItem(record._id)
                                }}>
                                    解绑
                                </Button>
                            </Menu.Item>
                        }
                        {
                            'submit' in statusScheme[record.item_status].buttons &&
                            <Menu.Item style={{display: 'flex'}} key='1'>
                                <Button type='primary' onClick={function(){
                                    changeItemStatus(record._id, statusScheme[record.item_status].next_status.next)
                                }}>
                                    提交审核
                                </Button>
                            </Menu.Item>
                        }
                        {
                            'detail' in statusScheme[record.item_status].buttons &&
                            <Menu.Item style={{display: 'flex'}} key='2'>
                                <Button type='primary' onClick={function(){
                                    getGuideDetail(record._id)
                                }}>
                                    查看详情
                                </Button>
                            </Menu.Item>
                        }
                        {
                            'cancel' in statusScheme[record.item_status].buttons &&
                            <Menu.Item style={{display: 'flex'}} key='3'>
                                <Button type='primary' onClick={function(){
                                    console.log(statusScheme[record.item_status])
                                    changeItemStatus(record._id, statusScheme[record.item_status].next_status.cancel)
                                }}>
                                    取消审核
                                </Button>
                            </Menu.Item>
                        }
                        {
                            'recall' in statusScheme[record.item_status].buttons &&
                            <Menu.Item style={{display: 'flex'}} key='4'>
                                <Button style={{backgroundColor: 'red', color: 'white', width: 88}} onClick={function(){
                                    changeItemStatus(record._id, statusScheme[record.item_status].next_status.recall)
                                }}>
                                    撤回
                                </Button>
                            </Menu.Item>
                        }
                        {
                            'cancelRecall' in statusScheme[record.item_status].buttons &&
                            <Menu.Item style={{display: 'flex'}} key='5'>
                                <Button style={{backgroundColor: 'red', color: 'white'}} onClick={function(){
                                    changeItemStatus(record._id, statusScheme[record.item_status].next_status.cancel)
                                }}>
                                    取消撤回
                                </Button>
                            </Menu.Item>
                        }
                    </Menu>
                } placement='bottomCenter' trigger={['click']}>
                    <Button type='primary' style={{width: 88}}>
                        操作
                    </Button>
                </Dropdown>
            )
        }
    ]

    const handleCreate = ()=>{
        props.setPageType(2)
    }

    const getPathByRuleId = (id)=>{
        // 获取规则id对应的规则路径
        let parent = props.ruleNodes[id].parentId
        let currId = id
        let res = ''
        while (parent !== '' && parent !== currId){
            res = props.ruleNodes[currId].rule_name + '\\' + res
            currId = parent
            parent = props.ruleNodes[currId].parentId
        }
        res = props.ruleNodes[currId].rule_name + '\\' + res
        return res
    }

    const getPathByRegionId = (id)=>{
        // 获取规则id对应的规则路径
        let parent = props.regionNodes[id].parentId
        let currId = id
        let res = ''
        while (parent !== '' && parent !== currId){
            res = props.regionNodes[currId].region_name + '\\' + res
            currId = parent
            parent = props.regionNodes[currId].parentId
        }
        res = props.regionNodes[currId].region_name + '\\' + res
        return res
    }

    const getItems = ()=>{
        setTableLoading(true)
        let data = originData
        data['page_num'] = current
        data['page_size'] = currPageSize
        // 获取所有事项规则
        api.GetItems(data).then(response=>{
            let items = response.data.data.data
            setTotalSize(response.data.data.total)
            for (let i = 0; i < items.length; i++){
                // 规则路径生成、状态码转状态名
                items[i]['creator_name'] = items[i].creator.name
                items[i]['department_name'] = items[i].creator.department_name
                items[i]['rule_path'] = getPathByRuleId(items[i].rule_id) + getPathByRegionId(items[i].region_id)
                items[i]['status'] = statusScheme[items[i].item_status].cn_name
            }
            setTableLoading(false)
            setTableData(items)
        }).catch(error=>{
            props.showError('获取事项失败！')
            console.log(error)
            setTableLoading(false)
        })
    }

    const deleteSingleItem = (id)=>{
        // 删除单个事项，将事项id设为deletingIds
        let str = '确定解绑该节点吗？'
        Modal.confirm({
            centered: true,
            title: '解绑确认',
            content: str,
            onOk: function(){
                finishDeleting([id])
            }
        })
    }

    const handleBatchDelete = ()=>{
        // 删除多个事项，将selectedRowKeys全部推进deletingIds
        let str = '确定解绑该' + selectedRowKeys.length + '个节点吗？'
        Modal.confirm({
            centered: true,
            title: '解绑确认',
            content: str,
            onOk: function(){
                finishDeleting(selectedRowKeys)
            },
            style: {whiteSpace: 'pre-wrap'}
        })
    }

    const finishDeleting = (id)=>{
        // 确定删除，调用接口，通过hook触发
        setTableLoading(true)
        setDeletingIds(id)
    }

    useEffect(function(){
        // 避免初始化触发或误触发
        if (deletingIds.length === 0) return
        deleteItems()
    }, [deletingIds])

    const deleteItems = ()=>{
        let data = {
            items: deletingIds
        } 
        // 根据事项规则id删除事项规则，删除完之后重新载入事项规则
        api.DeleteItems(data).then(response=>{ 
            getItems()
            props.showSuccess()
        }).catch(error=>{
            // 删除报错时，弹出报错框并重新加载数据
            getItems()
            setCurrent(0)
            props.showError('解绑事项失败！')
        })
    }

    const changeItemStatus = (item_id, next_status)=>{
        setTableLoading(true)
        // 更新事项状态的接口
        let items = [{
            item_id: item_id,
            next_status: next_status
        }]
        api.ChangeItemStatus({
            user_id: props.userId,
            items: items
        }).then(response=>{
            // 更新完毕后重新获取事项
            getItems()
        }).catch(error=>{
            getItems()
            setCurrent(0)
            props.showError('更新事项状态失败！')
        })
    }

    const searchItems = (data)=>{
        setTableLoading(true)
        // 搜索事项
        setOriginData(data)
        let totalData = data
        totalData['page_num'] = 0
        totalData['page_size'] = currPageSize
        api.GetItems(totalData).then(response=>{
            let items = response.data.data.data
            setCurrent(0)
            for (let i = 0; i < items.length; i++){
                // 规则路径生成、状态码转状态名
                items[i]['creator_name'] = items[i].creator.name
                items[i]['department_name'] = items[i].creator.department_name
                items[i]['rule_path'] = getPathByRuleId(items[i].rule_id) + getPathByRegionId(items[i].region_id)
                items[i]['status'] = statusScheme[items[i].item_status].cn_name
            }
            setTotalSize(response.data.data.total)
            setTableData(items)
            setTableLoading(false)
        }).catch(error=>{
            props.showError('搜索事项失败！')
            setTableLoading(false)
        })
    }

    const resetSearch = ()=>{
        // 重置搜索，搜索内容清零
        setCurrent(0)
        setOriginData({})
        setTableLoading(true)
        // 获取所有事项规则
        api.GetItems({
            page_num: 0,
            page_size: currPageSize,
            item_status: fullType
        }).then(response=>{
            let items = response.data.data.data
            setTotalSize(response.data.data.total)
            for (let i = 0; i < items.length; i++){
                // 规则路径生成、状态码转状态名
                items[i]['creator_name'] = items[i].creator.name
                items[i]['department_name'] = items[i].creator.department_name
                items[i]['rule_path'] = getPathByRuleId(items[i].rule_id) + getPathByRegionId(items[i].region_id)
                items[i]['status'] = statusScheme[items[i].item_status].cn_name
            }
            setTableLoading(false)
            setTableData(items)
        }).catch(error=>{
            props.showError('重置失败！')
            console.log(error)
            setTableLoading(false)
        })
    }

    const changePage = (page, pageSize)=>{
        setTableLoading(true)
        // 换页时清空选择
        setSelectedRowKeys([])
        setCurrent(page - 1)
        setCurrPageSize(pageSize)
        // 换页的内容获取
        let totalData = originData
        totalData['page_num'] = page - 1
        totalData['page_size'] = pageSize
        api.GetItems(totalData).then(response=>{
            let items = response.data.data.data
            setTotalSize(response.data.data.total)
            for (let i = 0; i < items.length; i++){
                // 规则路径生成、状态码转状态名
                items[i]['creator_name'] = items[i].creator.name
                items[i]['department_name'] = items[i].creator.department_name
                items[i]['rule_path'] = getPathByRuleId(items[i].rule_id) + getPathByRegionId(items[i].region_id)
                items[i]['status'] = statusScheme[items[i].item_status].cn_name
            }
            setTableData(items)
            setTableLoading(false)
        }).catch(error=>{
            props.showError('换页时获取事项信息失败！')
            setTableLoading(false)
        })
    }

    const getItemstatusScheme = ()=>{
        api.GetItemStatusScheme({}).then(response=>{
            // 获取状态表
            let scheme = response.data.data
            console.log(scheme)
            let type = []
            let fullType = []
            for (let key in scheme){
                if (scheme[key].eng_name !== 'Failure'){
                    type.push({
                        label: scheme[key].cn_name,
                        value: key
                    })
                    fullType.push(key)
                }
            }
            setStatusType(type)
            setFullType(fullType)
            setStatusScheme(scheme)
        }).catch(error=>{
            props.showError('初始化状态表失败！')
        })
    }

    const getGuideDetail = (_id)=>{
        setTableLoading(true)
        api.GetItemGuideAndAuditAdvises({
            item_id: _id
        }).then(response=>{
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
                'detailType': '事项内容',
                'detailInfo': data.apply_content
            })
            // 政策依据数组处理
            let tempLegalBasis = ''
            if (data.legal_basis){
                for (let i = 0; i < data.legal_basis.length; i++){
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
            let tempMaterial = ''
            if (data.submit_documents){
                for (let i = 0; i < data.submit_documents.length; i++){
                    tempMaterial += ((i + 1) + '.' + data.submit_documents[i].materials_name + '\n')
                }
            } 
            detailTable.push({
                'detailType': '申办材料',
                'detailInfo': tempMaterial
            })
            // 审核时限格式处理
            let tempTimeLimit = ''
            if (data.legal_period_type){
                tempTimeLimit += ('法定办结时限：' + data.legal_period + '个' + 
                    (data.legal_period_type === '1' ? '工作日' : '自然日'))
            }
            if (data.promised_period_type){
                if (tempTimeLimit !== '') tempTimeLimit += '\n'
                tempTimeLimit += ('承诺办结时限：' + data.promised_period + '个' + 
                    (data.promised_period_type === '1' ? '工作日' : '自然日'))
            }
            detailTable.push({
                'detailType': '审核时限',
                'detailInfo': tempTimeLimit
            })
            // 咨询电话、办事大厅地址数组处理
            let tempPhone = ''
            let tempAddress = ''
            if (data.windows){
                for (let i = 0; i < data.windows.length; i++){
                    tempPhone += ((i + 1) + '.' + data.windows[i].name + '：' + data.windows[i].phone + '\n')
                    tempAddress += ((i + 1) + '.' + data.windows[i].name + '：' + data.windows[i].address + '\n')
                }
            }
            detailTable.push({
                'detailType': '咨询电话',
                'detailInfo': tempPhone
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
                'detailType': '办事大厅地址',
                'detailInfo': tempAddress
            })
            detailTable.push({
                'detailType': '二维码',
                'detailInfo': data.qr_code
            })
            // 服务对象类型数组处理
            let type = data.service_object_type.split(',')
            let tempServiceType = ''
            for (let i = 0; i < type.length; i++){
                if (tempServiceType !== '') tempServiceType += '、'
                tempServiceType += serviceType[type[i]]
            }
            detailTable.push({
                'detailType': '服务对象类型',
                'detailInfo': tempServiceType
            })
            // 审核意见处理
            let tempAdvises = ''
            if ('audit_advises' in data){
                for (let i = 0; i < data.audit_advises.length; i++){
                    tempAdvises += ((i + 1) + '.' + data['audit_advises'][i].user_name + '：' + data['audit_advises'][i].advise + '\n')
                }
            }
            detailTable.push({
                'detailType': '审核意见',
                'detailInfo': tempAdvises
            })
            setTableLoading(false)
            setGuideDetail(detailTable)
        }).catch(error=>{
            setTableLoading(false)
            props.showError('获取事项详情失败！')
        })
    }

    const endShowing = ()=>{
        setIsDetailShown(false)
        setGuideDetail({})
    }

    useEffect(function(){
        for (let key in guideDetail){
            setIsDetailShown(true)
            break
        }
    }, [guideDetail])

    useEffect(()=>{
        for (let key in props.regionNodes){
            for (let key in props.ruleNodes){
                getItemstatusScheme()
                break
            }
            break
        }
    }, [props.regionNodes, props.ruleNodes])

    useEffect(()=>{
        // 若是跳转过来进行解绑的，处理绑定数据
        for (let key in props.bindedData){
            for (let key in statusScheme){
                let data = {}
                if ('rule_id' in props.bindedData){
                    data['rule_id'] = props.bindedData.rule_id
                }
                if ('region_code' in props.bindedData){
                    data['region_code'] = props.bindedData.region_code
                }
                setOriginData(data)
                searchItems(data)
                // 只设置一次
                props.setBindedData({})
                break
            }
            return
        }
        for (let key in statusScheme){
            setCurrent(0)
            setUnableCreate(false)
            setOriginData({})
            resetSearch()
            break
        }      
    }, [statusScheme])

    return (
        <>
            <Space direction='vertical' size={12} style={{width: '100%'}}>
                <Modal width={800} title={guideDetail.task_name} visible={isDetailShown}
                    destroyOnClose={true} onCancel={endShowing} footer={null}>
                    <Table style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word', wordBreak: 'break-all'}} columns={detailColumns} dataSource={guideDetail} rowKey='detailType'/>
                </Modal>
                <SelectForm getSearch={searchItems} reset={resetSearch} setOriginData={setOriginData} fullType={fullType}
                    bindedData={props.bindedData} setBindedData={props.setBindedData} statusType={statusType} />
                <Space direction='horizontal' size={12} style={{marginLeft: '75%'}}>
                    <Button type='primary' disabled={unableCreate} onClick={handleCreate}>绑定事项</Button>
                    <Button type='primary' disabled={!isBatching}>批量导出</Button>
                    <Button type='primary' disabled={!isBatching} onClick={handleBatchDelete}>批量解绑</Button>
                </Space>
                <Table rowSelection={rowSelection} columns={tableColumns} dataSource={tableData} rowKey='_id'
                    pagination={{onChange: changePage, current: current + 1, total: totalSize}} loading={tableLoading}/>
            </Space>
        </>
    )
}
