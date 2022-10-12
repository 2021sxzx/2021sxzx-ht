import api from "./itemGuide";
import {Tabs} from "antd";
import React from "react";

const {TabPane} = Tabs

export const serviceType = {
    '1': '自然人',
    '2': '企业法人',
    '3': '事业法人',
    '4': '社会组织法人',
    '5': '非法人企业',
    '6': '行政机关',
    '9': '其他组织'
}

export const necessityType = {
    '1': '必要',
    '2': '非必要',
    '3': '容缺后补'
}

export const typesType = {
    '1': '证件证书证明',
    '2': '申请表格文书',
    '3': '其他'
}

export const formType = {
    '1': '纸质',
    '2': '电子化',
    '3': '纸质/电子化'
}

export const requiredType = {
    '0': '否',
    '1': '是'
}

export const guideStatus = {
    0: '未绑定',
    1: '已绑定',
}

/** 事项详情的属性标题
 * 如果需要使用数组格式去访问可以使用：
 * ```Object.values(detailTitle)[下标]```
 * ```Object.values(detailTitle)``` 等价于 ```['事项名称', '事项代码', '实施主体名称', ...]```
 * @type {{
 *     selfServiceTerminal: string,
 *     PCTerminal: string,
 *     offlineProcessingProcess: string,
 *     windowInfo: string,
 *     mobileTerminal: string,
 *     consultingPlatform: string,
 *     serviceAgentName: string,
 *     legalBasis: string,
 *     timeLimit: string,
 *     serviceObjectType: string,
 *     serviceAgentCode: string,
 *     taskCode: string,
 *     materials: string,
 *     applyContent: string,
 *     taskName: string,
 *     conditions: string,
 *     onlineProcessingProcess: string
 * }}
 */
export const detailTitle = {
    taskName: '事项名称', // 0（索引，下标）
    taskCode: '事项代码', // 1
    serviceAgentName: '实施主体名称', // 2
    serviceAgentCode: '实施主体编码', // 3
    applyContent: '事项内容', // 4
    legalBasis: '政策依据', // 5
    conditions: '申办所需审核条件', // 6
    materials: '申办所需材料', // 7
    timeLimit: '审核时限', // 8
    consultingPlatform: '咨询平台', // 9
    PCTerminal: '网办PC端', // 10
    mobileTerminal: '网办移动端', // 11
    selfServiceTerminal: '自助终端', // 12
    onlineProcessingProcess: '网上办理流程', // 13
    offlineProcessingProcess: '线下办理流程', // 14
    windowInfo: '办理点信息', // 15
    serviceObjectType: '服务对象类型', // 16
}

/**
 * 获取指定格式的事项详情内容
 * @param taskCode {string} 事项编码
 * @return {Promise<{
 *     taskName: string,
 *     taskCode: string,
 *     serviceAgentName: string,
 *     serviceAgentCode: string,
 *     applyContent: string,
 *     legalBasis: string,
 *     conditions: string,
 *     materials: [{
 *         materialName: string,
 *         materialDetail: string,
 *     }],
 *     timeLimit: string,
 *     consultingPlatform: string,
 *     PCTerminal: string,
 *     mobileTerminal: string,
 *     selfServiceTerminal: string,
 *     onlineProcessingProcess: string,
 *     offlineProcessingProcess: string,
 *     windowInfo: [{
 *         windowName: string,
 *         windowDetail: string,
 *     }],
 *     serviceObjectType: string,
 * }>}
 */
export const getDetailData = async (taskCode) => {
    return new Promise((resolve, reject) => {
        api.GetItemGuide({
            task_code: taskCode
        }).then(response => {
            // 将数据处理为有序格式
            const data = response.data.data

            // 政策依据数组处理
            let legalBasis = ''
            if (data.legal_basis) {
                for (let i = 0; i < data.legal_basis.length; i++) {
                    legalBasis += ((i + 1) + '.' + data.legal_basis[i].name + '\n')
                }
            }

            // 申办材料数组处理
            const materials = []

            if (data.submit_documents && data.submit_documents.length > 0) {
                data.submit_documents.forEach((item) => {
                    if (item.materials_name) {
                        materials.push({
                            materialName: item.materials_name,
                            materialDetail: `原件数量：${item.origin}\n` +
                                `复印件数量：${item.copy}\n` +
                                (item.material_form ? `材料形式：${formType[item.material_form]}\n` : '') +
                                (item.page_format ? `纸质材料规格：${item.page_format}\n` : '') +
                                (item.material_necessity ? `是否必要：${necessityType[item.material_necessity]}\n` : '') +
                                (item.material_type ? `材料类型：${typesType[item.material_type]}\n` : '') +
                                (item.submissionrequired ? `是否免提交：${requiredType[item.submissionrequired]}\n` : ''),
                        })
                    }
                })
            }

            // 审核时限格式处理
            let timeLimit = ''
            if (data.legal_period_type) {
                timeLimit += ('法定办结时限：' + data.legal_period + '个' +
                    (data.legal_period_type === '1' ? '工作日' : '自然日'))
            }
            if (data.promised_period_type) {
                if (timeLimit !== '') timeLimit += '\n'
                timeLimit += ('承诺办结时限：' + data.promised_period + '个' +
                    (data.promised_period_type === '1' ? '工作日' : '自然日'))
            }

            //办理点信息
            const windowInfo = []

            if (data.windows && data.windows.length > 0) {
                data.windows.forEach((item) => {
                    if (item.name) {
                        windowInfo.push({
                            windowName: item.name,
                            windowDetail: `办理地点：${item.address}\n\n` +
                                `咨询及投诉电话：${item.phone}\n\n` +
                                `办公时间：${item.office_hour}\n\n`
                        })
                    }
                })
            }

            // 服务对象类型数组处理
            const type = data.service_object_type.split(',')
            let serviceObjectType = ''
            for (let i = 0; i < type.length; i++) {
                if (serviceObjectType !== '') serviceObjectType += '、'
                serviceObjectType += serviceType[type[i]]
            }

            // 事项详情数据
            const detailData = {
                taskName: data.task_name ? data.task_name : '', // '事项名称', 0
                taskCode: data.task_code ? data.task_code : '', // '事项代码', 1
                serviceAgentName: data.service_agent_name ? data.service_agent_name : '', // '实施主体名称', 2
                serviceAgentCode: data.service_agent_code ? data.service_agent_code : '', // '实施主体编码', 3
                applyContent: data.apply_content ? data.apply_content : '', // '事项内容', 4
                legalBasis: legalBasis, // '政策依据', 5
                conditions: data.conditions ? data.conditions : '',// '申办所需审核条件', 6
                materials: materials, // '申办所需材料', 7
                timeLimit: timeLimit, // '审核时限', 8
                consultingPlatform: data.zxpt ? data.zxpt : '', // '咨询平台', 9
                PCTerminal: data.wsyy ? data.wsyy : '', // '网办PC端', 10
                mobileTerminal: data.mobile_applt_website ? data.mobile_applt_website : '', // '网办移动端', 11
                selfServiceTerminal: data.zzzd ? data.zzzd : '', // '自助终端', 12
                onlineProcessingProcess: data.wsbllc ? data.wsbllc : '', // '网上办理流程', 13
                offlineProcessingProcess: data.ckbllc ? data.ckbllc : '', // '线下办理流程', 14
                windowInfo: windowInfo, // '办理点信息', 15
                serviceObjectType: serviceObjectType, // '服务对象类型', 16
            }

            resolve(detailData)
        }).catch(error => {
            reject(error)
        })
    })
}

/**
 * 根据事项编码获取符合事项详情表格的数据规范的数据
 * @param {string} taskCode 事项编码
 * @return {Promise<[{
 *     detailType: string,
 *     detailInfo: (string|JSX.Element),
 * }]>} 规范的事项详情数据
 */
export const getGuideDetail = async (taskCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 获取事项详情内容
            const detailData = {}
            Object.assign(detailData, await getDetailData(taskCode))

            // 将 detailData 中的申办材料数组 materials 变成我们想要展示的格式。
            let materials = <></>
            if (detailData.materials.length > 0) {
                materials = (
                    <Tabs
                        defaultActiveKey="0"
                        tabPosition="left"
                        style={{
                            overflow: 'auto',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {
                            detailData.materials.map((item, index) => (
                                <TabPane
                                    tab={<div style={{
                                        width: '350px',
                                        overflow: "auto",
                                        wordBreak: 'break-all',
                                        wordWrap: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                        textAlign: 'left',
                                    }}>{item.materialName}</div>}
                                    key={index}
                                >
                                    {item.materialDetail}
                                </TabPane>
                            ))
                        }
                    </Tabs>
                )
            }

            detailData.materials = materials


            // 将 detailData 中的办理点信息数组 windowInfo 变成我们想要展示的格式。
            let windowInfo = <></>
            if (detailData.windowInfo.length > 0) {
                windowInfo = (
                    <Tabs defaultActiveKey="0" tabPosition="left" style={{whiteSpace: 'pre-wrap'}}>
                        {
                            detailData.windowInfo.map((item, index) => (
                                <TabPane
                                    tab={(
                                        <div style={{
                                            width: '200px',
                                            overflow: "auto",
                                            wordBreak: 'break-all',
                                            wordWrap: 'break-word',
                                            whiteSpace: 'pre-wrap',
                                            textAlign: 'left',
                                        }}>
                                            {item.windowName}
                                        </div>
                                    )}
                                    key={index}>
                                    {item.windowDetail}
                                </TabPane>
                            ))
                        }
                    </Tabs>
                )
            }

            detailData.windowInfo = windowInfo

            // 事项详情表格规范的数据
            const tableData = []

            // 构造为事项详情表格所需要的格式：
            for (let i in Object.values(detailTitle)) {
                tableData.push({
                    detailType: Object.values(detailTitle)[i],
                    detailInfo: Object.values(detailData)[i],
                })
            }

            resolve(tableData)
        } catch (err) {
            reject(err)
        }
    })
}

/**
 *
 * @param data
 * @return {Promise<{
 *     total: number,
 *     guides: *[],
 * }>}
 */
export const getGuideTableData = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await api.GetItemGuides(data)
            let guides = response.data.data.data

            for (let guide of guides) {
                if (guide.creator) {
                    guide['creator_name'] = guide.creator.name
                    guide['department_name'] = guide.creator.department_name
                }
                guide['status'] = guide.task_status ? guideStatus[guide.task_status] : guideStatus[0]
            }

            resolve({
                total: response.data.data.total,
                guides: guides,
            })
        } catch (err) {
            reject(err)
        }
    })

}
