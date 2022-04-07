import React, {cloneElement, useEffect, useState} from 'react'
import { Dropdown, Space, Menu, Input, Button, Select, Table, Modal,Descriptions, Badge, message  } from 'antd';
import { getYMD } from "../../../../../utils/TimeStamp";
import api from '../../../../../api/rule';
import SelectForm from './SelectForm'

export default function ManageGuide(props) {
    // 页面的基础数据
    const [tableData, setTableData] = useState([])
    const [originData, setOriginData] = useState({})
    const [tableLoading, setTableLoading] = useState(true)
    const [guideDetail, setGuideDetail] = useState({})
    const [isDetailShown, setIsDetailShown] = useState(false)
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
        getCheckboxProps: (record)=>({
            // 不允许删除中间节点
            disabled: (record.task_status === 1)
        })
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
            width: 320
        },
        {
            title: '事项指南',
            dataIndex: 'task_name',
            key: 'task_name'
        },
        {
            title: '业务部门',
            dataIndex: 'department_name',
            key: 'department_name',
            width: 125
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
                        <Menu.Item key='0'>
                            <Button type='primary' style={{width: 88}} onClick={function(){
                                modifyItemGuide(record.task_code)
                            }}>
                                编辑
                            </Button>
                        </Menu.Item>
                        <Menu.Item key='1'>
                            <Button type='primary' onClick={function(){
                                getGuideDetail(record.task_code)
                            }}>
                                查看详情
                            </Button>
                        </Menu.Item>
                        <Menu.Item key='2'>
                            <Button type='primary' style={{width: 88}} onClick={function(){
                                message.info('导出！')
                            }}>
                                导出
                            </Button>
                        </Menu.Item>
                        {
                            record.task_status === 0 &&
                            <Menu.Item key='3'>
                                <Button style={{backgroundColor: 'red', color: 'white', width: 88}} onClick={function(){
                                    deleteSingleItem(record.task_code)
                                }}>
                                    删除
                                </Button>
                            </Menu.Item>
                        }
                    </Menu>
                } trigger={['click']}>
                    <Button type='primary'>
                        操作
                    </Button>
                </Dropdown>
            )
        }
    ]

    const getGuideDetail = (task_code)=>{
        api.GetItemGuide({
            task_code: task_code
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
                'detailType': '咨询电话',
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
            setGuideDetail(detailTable)
        }).catch(error=>{
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

    const getItemGuides = ()=>{
        setTableLoading(true)
        let data = originData
        data['page_num'] = current
        data['page_size'] = currPageSize
        // 获取所有事项指南
        api.GetItemGuides(data).then(response=>{
            let guides = response.data.data.data
            setTotalSize(response.data.data.total)
            for (let i = 0; i < guides.length; i++){
                guides[i]['creator_name'] = guides[i].creator.name
                guides[i]['department_name'] = guides[i].creator.department_name
                guides[i]['status'] = guides[i].task_status === 0 ? '未绑定' : '已绑定'
            }
            setTableData(guides)
            setTableLoading(false)
        }).catch(error=>{
            console.log(error)
            props.showError('获取指南失败！')
            setTableLoading(false)
        })
    }

    const deleteSingleItem = (id)=>{
        // 删除单个事项，将事项id设为deletingIds
        let str = '确定删除该节点吗？'
        let nodes = [id]
        Modal.confirm({
            centered: true,
            title: '删除确认',
            content: str,
            onOk: function(){
                finishDeleting(nodes)
            }
        })
    }

    const handleBatchDelete = ()=>{
        // 删除多个事项，将selectedRowKeys全部推进deletingIds
        let str = '确定删除该' + selectedRowKeys.length + '个节点吗？'      
        Modal.confirm({
            centered: true,
            title: '删除确认',
            content: str,
            onOk: function(){
                finishDeleting(selectedRowKeys)
            },
            style: {whiteSpace: 'pre-wrap'}
        })
    }

    const finishDeleting = (id)=>{
        // 确定删除，调用接口，通过hook触发
        setDeletingIds(id)
    }

    useEffect(function(){
        // 避免初始化触发或误触发
        if (deletingIds.length === 0) return
        deleteItemGuides()
    }, [deletingIds])

    const deleteItemGuides = ()=>{
        let data = {
            task_code: deletingIds
        } 
        // 根据事项规则id删除事项规则，删除完之后重新载入事项规则
        api.DeleteItemGuides(data).then(response=>{ 
            getItemGuides()
            props.showSuccess()
        }).catch(error=>{
            // 删除报错时，弹出报错框并重新加载数据
            props.showError('删除指南失败！')
            setCurrent(0)
            getItemGuides()
        })
    }

    const searchItemGuide = (data)=>{
        setTableLoading(true)
        // 搜索时重置table
        setOriginData(data)
        let totalData = data
        totalData['page_num'] = 0
        totalData['page_size'] = currPageSize
        api.GetItemGuides(totalData).then(response=>{
            let guides = response.data.data.data
            setCurrent(0)
            setTotalSize(response.data.data.total)
            for (let i = 0; i < guides.length; i++){
                guides[i]['creator_name'] = guides[i].creator.name
                guides[i]['department_name'] = guides[i].creator.department_name
                guides[i]['status'] = guides[i].task_status === 0 ? '未绑定' : '已绑定'
            }
            setTableData(guides)
            setTableLoading(false)
        }).catch(error=>{
            props.showError('搜索指南失败！')
            setTableLoading(false)
        })
    }

    const modifyItemGuide = (id)=>{
        api.GetItemGuide({
            task_code: id
        }).then(response=>{
            let data = response.data.data
            let tempGuideContent = {}
            tempGuideContent['guideName'] = data.task_name
            tempGuideContent['guideCode'] = data.task_code
            tempGuideContent['guideContent'] = data.apply_content
            let tempAccord = []
            if (data.legal_basis){
                for (let i = 0; i < data.legal_basis.length; i++){
                    tempAccord.push(data.legal_basis[i].name)
                }
            }
            tempGuideContent['guideAccord'] = tempAccord
            tempGuideContent['guideCondition'] = data.conditions
            let tempMaterial = []
            if (data.submit_documents){
                for (let i = 0; i < data.submit_documents.length; i++){
                    tempMaterial.push(data.submit_documents[i].materials_name)
                }
            }
            tempGuideContent['guideMaterial'] = tempMaterial
            tempGuideContent['legalPeriod'] = data.legal_period
            tempGuideContent['legalType'] = data.legal_period_type ? data.legal_period_type : '0'
            tempGuideContent['promisedPeriod'] = data.promised_period
            tempGuideContent['promisedType'] = data.promised_period_type ? data.promised_period_type : '0'
            let tempWindow = []
            let tempPhone = []
            let tempAddress = []
            if (data.windows){
                for (let i = 0; i < data.windows.length; i++){
                    tempWindow.push(data.windows[i].name)
                    tempPhone.push(data.windows[i].phone)
                    tempAddress.push(data.windows[i].address)
                }
            }
            tempGuideContent['guidePhone'] = tempPhone
            tempGuideContent['guideWindow'] = tempWindow
            tempGuideContent['guideAddress'] = tempAddress
            tempGuideContent['guidePlatform'] = data.zxpt
            tempGuideContent['guidePCAddress'] = data.wsyy
            tempGuideContent['guidePEAddress'] = data.mobile_applt_website
            tempGuideContent['guideSelfmadeAddress'] = data.zzzd
            tempGuideContent['guideQRCode'] = data.qr_code
            let type = data.service_object_type.split(',')
            let tempServiceType = []
            for (let i = 0; i < type.length; i++){
                tempServiceType.push(parseInt(type[i]))
            }
            tempGuideContent['guideServiceType'] = tempServiceType

            props.setModifyId(id)
            props.setModifyContent(tempGuideContent)
        }).catch(error=>{
            props.showError('编辑指南时获取指南详情失败！')
        }) 
    }

    const handleCreate = ()=>{
        props.setModifyId('')
        props.setModifyContent({})
        props.setPageType(2)
    }

    const resetSearch = ()=>{
        // 回 归 本 源
        setOriginData({})
        setCurrent(0)
        api.GetItemGuides({
            page_num: 0,
            page_size: currPageSize
        }).then(response=>{
            let guides = response.data.data.data
            setTotalSize(response.data.data.total)
            for (let i = 0; i < guides.length; i++){
                guides[i]['creator_name'] = guides[i].creator.name
                guides[i]['department_name'] = guides[i].creator.department_name
                guides[i]['status'] = guides[i].task_status === 0 ? '未绑定' : '已绑定'
            }
            setTableData(guides)
            setTableLoading(false)
        }).catch(error=>{
            console.log(error)
            props.showError('重置失败！')
            setTableLoading(false)
        })
    }

    const changePage = (page, pageSize)=>{
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
        api.GetItemGuides(totalData).then(response=>{
            let guides = response.data.data.data
            for (let i = 0; i < guides.length; i++){
                guides[i]['creator_name'] = guides[i].creator.name
                guides[i]['department_name'] = guides[i].creator.department_name
                guides[i]['status'] = guides[i].task_status === 1 ? '已绑定' : '未绑定'
            }
            setTableData(guides)
            setTableLoading(false)
        }).catch(error=>{
            props.showError('换页时获取指南失败！')
            setTableLoading(false)
        })
    }

    useEffect(()=>{
        setCurrent(0)
        getItemGuides()
    }, [])

    return (
        <>
            <Space direction='vertical' size={12} style={{width: '100%'}}>
                <Modal width={800} title={guideDetail.task_name} visible={isDetailShown}
                    destroyOnClose={true} onCancel={endShowing} footer={null}>
                    <Table style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word', wordBreak: 'break-all'}} columns={detailColumns} dataSource={guideDetail} rowKey='detailType'/>
                </Modal>
                <SelectForm getSearch={searchItemGuide} reset={resetSearch}></SelectForm>
                <Space direction='horizontal' size={12} style={{marginLeft: '75%'}}>
                    <Button type='primary' onClick={handleCreate}>创建指南</Button>
                    <Button type='primary' disabled={!isBatching}>批量导出</Button>
                    <Button type='primary' disabled={!isBatching} onClick={handleBatchDelete}>批量删除</Button>
                </Space>
                <Table rowSelection={rowSelection} columns={tableColumns} dataSource={tableData} rowKey='task_code'
                    pagination={{onChange: changePage, current: current + 1, total: totalSize}} loading={tableLoading}/>
            </Space>
        </>
    )
}
