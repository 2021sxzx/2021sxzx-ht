import React, {cloneElement, useEffect, useState} from 'react'
import { Dropdown, Space, Menu, Input, Button, Select, Table, Modal,Descriptions, Badge, message  } from 'antd';
import { getYMD } from "../../../../../utils/TimeStamp";
import api from '../../../../../api/rule';
import SelectForm from './SelectForm'

export default function ManageGuide(props) {
    // 页面的基础数据
    const [tableData, setTableData] = useState([])
    // 是否正在删除，以及删除队列
    const [isDeleting, setIsDeleting] = useState(false)
    const [deletingIds, setDeletingIds] = useState([])
    // 用于获取批量处理的事项规则id
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [isBatching, setIsBatching] = useState(false)
    const onSelectionChange = keys=>{
        console.log(keys)
        setIsBatching(keys.length > 0)
        setSelectedRowKeys(keys)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectionChange,
    }
    // 当前展示的页数，用于重置时归零
    const [current, setCurrent] = useState(1)   

    const tableColumns = [
        {
            title: '事项指南编码',
            dataIndex: 'item_guide_id',
            key: 'item_guide_id',
            width: 310
        },
        {
            title: '事项指南',
            dataIndex: 'guide_name',
            key: 'guide_name',
            width: 410
        },
        {
            title: '业务部门',
            dataIndex: 'department',
            key: 'department',
            width: 125
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
                        <Menu.Item key='0'>
                            <Button type='primary' onClick={function(){
                                modifyItemGuide(record.item_guide_id)
                            }}>
                                编辑
                            </Button>
                        </Menu.Item>
                        <Menu.Item key='2'>
                            <Button type='primary' onClick={function(){
                                message.info('导出！')
                            }}>
                                导出
                            </Button>
                        </Menu.Item>
                        <Menu.Item key='1'>
                            <Button style={{backgroundColor: 'red', color: 'white'}} onClick={function(){
                                deleteSingleItem(record.item_guide_id)
                            }}>
                                删除
                            </Button>
                        </Menu.Item>
                    </Menu>
                } trigger={['click']}>
                    <Button type='primary'>
                        操作
                    </Button>
                </Dropdown>
            )
        }
    ]

    const tempGuide = [{
        item_guide_id: '11440100696927671X3442011817001',
        guide_name: '（1年后）劳动能力复查鉴定申请',
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

    const getItemGuide = ()=>{
        // 获取所有事项规则
        /*api.GetItemGuide({}).then(response=>{
            let Guide = response.data.data
            for (let i = 0; i < Guide.length; i++){
                Guide[i]['rule_path'] = (Guide[i]['rule_id'] != '' ? getPathByRuleId(Guide[i]['rule_id']) : '') + (Guide[i]['region_id'] != '' ? getPathByRegionId(Guide[i]['region_id']) : '')
            }
            setTableData(Guide)
        }).catch(error=>{
        })*/
        setTableData(tempGuide)
    }

    const deleteSingleItem = (id)=>{
        // 删除单个事项，将事项id设为deletingIds
        setIsDeleting(true)
        setDeletingIds([{
            item_rule_id: id
        }])
    }

    const handleBatchDelete = ()=>{
        // 删除多个事项，将selectedRowKeys全部推进deletingIds
        setIsDeleting(true)
        let temp = []
        for (let i = 0; i < selectedRowKeys.length; i++){
            temp.push({
                item_rule_id: selectedRowKeys[i]
            })
        }
        setDeletingIds(temp)
    }

    const endDeleting = ()=>{
        setIsDeleting(false)
    }

    const finishDeleting = ()=>{
        // 确定删除，调用接口
        deleteGuide()
        setIsDeleting(false)
    }

    const deleteGuide = ()=>{
        /*let data = {
            itemGuide: deletingIds
        }
        // 根据事项规则id删除事项规则，删除完之后重新载入事项规则
        api.DeleteItemGuide(data).then(response=>{ 
            // 等规则路径问题处理完后只需要刷新ruleItems
            getItemGuide()
        }).catch(error=>{
            // 删除报错时，弹出报错框并重新加载数据
            props.showError()
            props.init()
            getItemGuide()
        })*/
    }

    const searchItemGuide = (data)=>{
        /*api.GetItemGuide(data).then(response=>{
            let Guide = response.data.data
            for (let i = 0; i < Guide.length; i++){
                Guide[i]['rule_path'] = getPathByRuleId(Guide[i]['rule_id']) + getPathByRegionId(Guide[i]['region_id'])
            }
            setTableData(Guide)
        }).catch(error=>{
        })*/
    }

    const modifyItemGuide = (id)=>{
        props.setModifyId(id)
        props.setModifyContent(tempGuideContent)
        props.setPageType(2)
    }

    const handleCreate = ()=>{
        props.setModifyId('')
        props.setModifyContent({})
        props.setPageType(2)
    }

    const resetSearch = ()=>{
        setCurrent(1)
        getItemGuide()
    }

    const changePage = (page)=>{
        // 换页时清空选择
        setSelectedRowKeys([])
        setCurrent(page)
    }

    useEffect(()=>{
        getItemGuide()
    }, [])

    return (
        <>
            <Space direction='vertical' size={12}>
                <Modal centered destroyOnClose={true} title='删除确认' visible={isDeleting} onCancel={endDeleting} onOk={finishDeleting}>
                    <div>是否确定删除该{deletingIds.length}项规则？</div>
                </Modal>
                <SelectForm getSearch={searchItemGuide} reset={resetSearch}></SelectForm>
                <Space direction='horizontal' size={12} style={{marginLeft: 925}}>
                    <Button type='primary' onClick={handleCreate}>创建指南</Button>
                    <Button type='primary' disabled={!isBatching}>批量导出</Button>
                    <Button type='primary' disabled={!isBatching} onClick={handleBatchDelete}>批量删除</Button>
                </Space>
                <Table rowSelection={rowSelection} columns={tableColumns} dataSource={tableData} rowKey='item_rule_id'
                    pagination={{onChange: changePage, current: current}}/>
            </Space>
        </>
    )
}
