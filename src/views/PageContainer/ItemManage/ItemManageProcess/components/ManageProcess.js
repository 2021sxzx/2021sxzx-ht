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
    // 状态映射表
    const [statusScheme, setStatusScheme] = useState({})
    const [statusName, setStatusName] = useState({})
    const [statusButtons, setStatusButtons] = useState({})
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

    const tempGuide = [{
        item_id: 'temp',
        task_code: '11440100696927671X3442011817001',
        guide_name: '（1年后）劳动能力复查鉴定申请',
        rule_path: '分类规则标准\\个人业务\\人事人才\\人才引进\\引进在职人才入户\\市辖区\\南沙区\\区县本级\\',
        create_time: 1646709061357
    }]

    const tempGuideContent = {
        guideName: '（1年后）劳动能力复查鉴定申请',
        guideCode: '11440100696927671X3442011817001',
        guideContent: '（1年后）劳动能力复查鉴定申请',
        guideAccord: '《工伤保险条例》( 2010年国务院令586号修订)',
        guideCondition: '自劳动能力鉴定结论作出之日起1年后，工伤职工、用人单位或者社会保险经办机构认为伤残情况发生变化的，可以向设区的市级劳动能力鉴定委员会申请劳动能力复查鉴定。',
        guideMaterial: '1.工伤职工的居民身份证或者社会保障卡等其他有效身份证明原件；\n2.劳动能力鉴定（确认）申请表；\n3.有效的诊断证明、按照医疗机构病历管理有关规定复印或者复制的检查、检验报告等完整病历材料。',
        guideTimeLimit: '法定办结时限：60个工作日\n承诺办结时限：40个工作日',
        guidePhone: '市区办理点：020-87656275\n番禺办理点：020-84881099\n花都办理点：020-86969331\n增城办理点：020-82729239\n从化办理点：020-87963237',
        guidePlatform: 'http://rsj.gz.gov.cn/sofpro/bmyyqt/hrssgz/ywzx/ywzx_list.jsp',
        guidePCAddress: 'http://tyrz.gd.gov.cn/tif/sso/connect/page/oauth2/authorize?service=initService&response_type=code&client_id=gzldbzxt&scope=all&redirect_uri=http://gzlss.hrssgz.gov.cn/gzlss_web/business/tomain/styzr.xhtml?sxbm=11440100696927671X3442111817001',
        guidePEAddress: 'http://tyrz.gd.gov.cn/tif/sso/connect/page/oauth2/authorize?service=initService&response_type=code&client_id=gzldbzxt&scope=all&redirect_uri=http://gzlss.hrssgz.gov.cn/gzlss_web/business/tomain/styzr.xhtml?sxbm=11440100696927671X3442111817001',
        guideSelfmadeAddress: 'http://tyrz.gd.gov.cn/tif/sso/connect/page/oauth2/authorize?service=initService&response_type=code&client_id=gzldbzxt&scope=all&redirect_uri=http://gzlss.hrssgz.gov.cn/gzlss_web/business/tomain/styzr.xhtml?sxbm=11440100696927671X3442111817001',
        guideAddress: '1.市区办理点：广州市越秀区梅东路28号广州市人力资源和社会保障综合服务大厅2楼\n2.番禺办理点：广州市番禺区桥南街桥南路11号1楼4、5号窗口\n3.花都办理点：广州市花都区新华街公益大道府西路1号花都区人力资源和社会保障局3号楼1楼工伤业务窗\n4.增城办理点：广州市增城区荔湖街景观大道北7号增城区政务服务中心B区社保医保服务厅24号窗口\n5.从化办理点：广州市从化区街口街河滨南路43号一楼社保科办公室',
        guideQRCode: '1'
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
            dataIndex: 'rule_path',
            key: 'rule_path'
        },
        {
            title: '业务部门',
            dataIndex: 'department',
            key: 'department',
            width: 100
        },
        {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
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
                            'unbind' in statusButtons[record.item_status] &&
                            <Menu.Item key='0'>
                                <Button type='primary' style={{width: 88}} onClick={function(){
                                    deleteSingleItem(record._id)
                                }}>
                                    解绑
                                </Button>
                            </Menu.Item>
                        }
                        {
                            'submit' in statusButtons[record.item_status] &&
                            <Menu.Item style={{display: 'flex'}} key='1'>
                                <Button type='primary' onClick={function(){
                                    changeItemStatus(record._id, statusScheme.FirstAudit.id)
                                }}>
                                    提交审核
                                </Button>
                            </Menu.Item>
                        }
                        {
                            'detail' in statusButtons[record.item_status] &&
                            <Menu.Item style={{display: 'flex'}} key='2'>
                                <Button type='primary' onClick={function(){
                                    showGuide(record.item_id)
                                }}>
                                    查看详情
                                </Button>
                            </Menu.Item>
                        }
                        {
                            'cancel' in statusButtons[record.item_status] &&
                            <Menu.Item style={{display: 'flex'}} key='3'>
                                <Button type='primary' onClick={function(){
                                    changeItemStatus(record._id, statusScheme.WaitAudit.id)
                                }}>
                                    取消审核
                                </Button>
                            </Menu.Item>
                        }
                        {
                            'recall' in statusButtons[record.item_status] &&
                            <Menu.Item style={{display: 'flex'}} key='4'>
                                <Button style={{backgroundColor: 'red', color: 'white', width: 88}} onClick={function(){
                                    changeItemStatus(record._id, statusScheme.Recall.id)
                                }}>
                                    撤回
                                </Button>
                            </Menu.Item>
                        }
                        {
                            'cancelRecall' in statusButtons[record.item_status] &&
                            <Menu.Item style={{display: 'flex'}} key='5'>
                                <Button style={{backgroundColor: 'red', color: 'white'}} onClick={function(){
                                    changeItemStatus(record._id, statusScheme.Success.id)
                                }}>
                                    取消撤回
                                </Button>
                            </Menu.Item>
                        }
                        {/*<Menu.Item key='6'>
                            <Button style={{backgroundColor: 'red', color: 'white', width: 88}} onClick={function(){
                                deleteSingleItem(record.item_id)
                            }}>
                                删除
                            </Button>
                        </Menu.Item>*/}
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
        props.setModifyId('')
        props.setModifyContent({})
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
        // 获取所有事项规则
        api.GetItems({
            page_num: current,
            page_size: currPageSize
        }).then(response=>{
            let items = response.data.data.data
            setTotalSize(response.data.data.total)
            for (let i = 0; i < items.length; i++){
                // 规则路径生成、状态码转状态名
                items[i]['rule_path'] = getPathByRuleId(items[i].rule_id) + getPathByRegionId(items[i].region_id)
                items[i]['status'] = statusName[items[i].item_status]
            }
            setTableLoading(false)
            setTableData(items)
        }).catch(error=>{
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
            console.log(error)
            props.showError()
        })
        setDeletingIds([])
    }

    const changeItemStatus = (item_id, next_status)=>{
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
            console.log(error)
        })
    }

    const searchItems = (data)=>{
        // 搜索事项
        setCurrent(0)
        let totalData = data
        totalData['page_num'] = 0
        totalData['page_size'] = currPageSize
        api.GetItems(totalData).then(response=>{
            let items = response.data.data.data
            for (let i = 0; i < items.length; i++){
                // 规则路径生成、状态码转状态名
                items[i]['rule_path'] = getPathByRuleId(items[i].rule_id) + getPathByRegionId(items[i].region_id)
                items[i]['status'] = statusName[items[i].item_status]
            }
            setTotalSize(response.data.data.total)
            setTableData(items)
            setTableLoading(false)
        }).catch(error=>{
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
            page_size: currPageSize
        }).then(response=>{
            let items = response.data.data.data
            setTotalSize(response.data.data.total)
            for (let i = 0; i < items.length; i++){
                // 规则路径生成、状态码转状态名
                items[i]['rule_path'] = getPathByRuleId(items[i].rule_id) + getPathByRegionId(items[i].region_id)
                items[i]['status'] = statusName[items[i].item_status]
            }
            setTableLoading(false)
            setTableData(items)
        }).catch(error=>{
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
            for (let i = 0; i < items.length; i++){
                // 规则路径生成、状态码转状态名
                items[i]['rule_path'] = getPathByRuleId(items[i].rule_id) + getPathByRegionId(items[i].region_id)
                items[i]['status'] = statusName[items[i].item_status]
            }
            setTableData(items)
            setTableLoading(false)
        }).catch(error=>{
            setTableLoading(false)
        })
    }

    const getItemStatusScheme = ()=>{
        api.GetItemStatusScheme({}).then(response=>{
            // 获取状态表
            let scheme = response.data.data
            let keyToWord = {}
            let buttons = {}
            for (let key in scheme){
                // 状态码对状态名和相关按钮的映射
                keyToWord[scheme[key].id] = scheme[key].cn_name
                buttons[scheme[key].id] = scheme[key].buttons
            }
            setStatusScheme(scheme)
            setStatusButtons(buttons)
            setStatusName(keyToWord)
        }).catch(error=>{

        })
    }

    useEffect(()=>{
        for (let key in props.regionNodes){
            for (let key in props.ruleNodes){
                getItemStatusScheme()
                break
            }
            break
        }
    }, [props.regionNodes, props.ruleNodes])

    useEffect(()=>{
        for (let key in statusName){
            getItems()
            setUnableCreate(false)
            break
        }      
    }, [statusName])

    return (
        <>
            <Space direction='vertical' size={12} style={{width: '100%'}}>
                <SelectForm getSearch={searchItems} reset={resetSearch} setOriginData={setOriginData}></SelectForm>
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
