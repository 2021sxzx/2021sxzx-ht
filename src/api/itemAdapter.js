import {
    detailTitle,
    standardItemGuideToDetailFormat,
    standardItemGuideToExportFormat,
    standardizingItemGuideData,
} from "./itemGuideAdapter";
import api from "./item";
import {getYMDHMS} from "../utils/TimeStamp";

/**
 * 使用装饰者模式在事项指南详情的基础上增加审核意见和事项规则，返回装饰后的事项详情的属性标题
 * @return {{
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
 *     onlineProcessingProcess: string,
 *     auditOpinions: string,
 * }}
 */
const detailTitleDecorator = () => {
    const itemDetailTitle = {}
    Object.assign(itemDetailTitle, detailTitle)
    itemDetailTitle.auditOpinions = "审核意见"
    // itemDetailTitle.itemPath = "事项规则"
    return itemDetailTitle
}

/**
 * 事项详情的属性标题
 * 如果需要使用数组格式去访问可以使用：
 * ```Object.values(itemDetailTitle)[下标]```
 * ```Object.values(itemDetailTitle)``` 等价于 ```['事项名称', '事项代码', '实施主体名称', ...]```
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
 *     taskCode: string, materials:
 *     string, applyContent: string,
 *     taskName: string,
 *     conditions: string,
 *     onlineProcessingProcess: string,
 *     auditOpinions: string,
 * }}
 */
export const itemDetailTitle = detailTitleDecorator()

/**
 * 获取事项状态表
 * @return {Promise<*[]>} （TODO:重构时，没找到接口文档，注释待完善）
 */
const getItemStatusScheme = () => {
    return new Promise((resolve, reject) => {
        api.GetItemStatusScheme({}).then(response => {
            // 获取状态表
            resolve(response.data.data)
        }).catch(error => {
            reject(error)
        })
    })
}

/**
 * 事项状态表
 * @type {Promise<*[]>}（TODO:重构时，没找到接口文档，注释待完善）
 */
export const itemStatusScheme = getItemStatusScheme()

/**
 * 获取事项列表格式的数据
 * TODO: 完善注释
 * @param data 查询事项的参数（没找到接口文档，后续重构的时候再补充）
 * @return {Promise<{
 *     total: number,
 *     items: *[],
 * }>} total 是事项的总数， items 是事项数据的数组
 */
export const getItemsDataOnTableFormat = async (data) => {
    return new Promise(async (resolve, reject) => {

        const statusScheme = await itemStatusScheme

        api.GetItems(data).then(async response => {
            let items = response.data.data.data
            for (let item of items) {
                // 规则路径生成、状态码转状态名
                item['creator_name'] = item.creator.name
                item['department_name'] = item.creator.department_name
                item['item_path'] = item['rule_path'] + item['region_path']
                item['status'] = await statusScheme[item.item_status].cn_name
            }
            resolve({
                total: response.data.data.total,
                items: items,
            })
        }).catch(error => {
            reject(error)
        })
    })
}


/**
 * 获取标准格式的带有审核意见的事项指南详情内容。
 * @param itemId {string} 事项在数据库的 _id 主码
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
 *     auditOpinions: [{
 *         userName: string,
 *         userId: string,
 *         advise: string,
 *         time: number,
 *     }]
 * }>}
 */
export const getItemGuideWithAuditOpinions = async (itemId) => {
    return new Promise((resolve, reject) => {
        api.GetItemGuideAndAuditAdvises({
            item_id: itemId
        }).then(response => {
            // 将数据处理为有序格式
            resolve(standardizingItemGuideWithAuditOpinions(response.data.data))
        }).catch(error => {
            reject(error)
        })
    })
}

/**
 * 标准化带有审核意见的事项指南详情内容
 * 使用装饰模式在原有的事项指南标准化函数中额外增加了标准化审核意见的功能
 * @param data {*} 直接从后端获取的数据。TODO: 数据类型待补充
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
 *     auditOpinions: [{
 *         userName: string,
 *         userId: string,
 *         advise: string,
 *         time: number,
 *     }]
 * }>}
 */
export const standardizingItemGuideWithAuditOpinions = (data) => {
    let detailData = standardizingItemGuideData(data)

    // 处理审核意见
    const auditOpinions = []
    if (data.audit_advises && data.audit_advises instanceof Array) {
        for (let opinion of data.audit_advises) {
            auditOpinions.push({
                userName: opinion.user_name,
                userId: opinion.user_id,
                advise: opinion.advise,
                time: opinion.time,
            })
        }
    } else {
        data.audit_advises = []
    }

    detailData.auditOpinions = auditOpinions

    return detailData
}

/**
 * 获取符合事项详情弹窗数据格式的带有审核意见的事项详情数据
 * @param itemId {string} 事项在数据库的主码 _id
 */
export const getItemGuideWithAuditOpinionsOnDetailFormat = async (itemId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 获取事项详情内容
            const detailData = {}
            Object.assign(detailData, await getItemGuideWithAuditOpinions(itemId))
            // 转化为符合事项详情展示格式的数据
            resolve(standardItemGuideWithAuditOpinionsToDetailFormat(detailData))
        } catch (err) {
            reject(err)
        }
    })
}

/**
 * 将标准化的带有审核意见的事项详情数据转化为符合事项详情展示格式的数据
 * 使用装饰模式在原有指南详情上增加了审核意见字段的处理
 * @param detailData
 * @return {{detailType: string, detailInfo: (string|JSX.Element)}[]}
 */
export const standardItemGuideWithAuditOpinionsToDetailFormat = (detailData) => {
    let tableData = standardItemGuideToDetailFormat(detailData)

    // 审核意见处理
    let auditOpinions = ''
    for (let opinion of detailData.auditOpinions) {
        auditOpinions += (getYMDHMS(opinion.time) + '：'
            + opinion.userName + '：' + opinion.advise + '\n')
    }

    tableData.push({
        'detailType': itemDetailTitle.auditOpinions,
        'detailInfo': auditOpinions,
    })

    return tableData
}

/**
 * 将标准化的带有审核意见的事项详情数据转化为符合导出格式的数据
 * 使用装饰模式在原有指南详情上增加了审核意见字段的处理
 * @param detailData {{
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
 *     auditOpinions: [{
 *         userName: string,
 *         userId: string,
 *         advise: string,
 *         time: number,
 *     }],
 * }}
 * @return {{
 *     taskName: string,
 *     taskCode: string,
 *     serviceAgentName: string,
 *     serviceAgentCode: string,
 *     applyContent: string,
 *     legalBasis: string,
 *     conditions: string,
 *     materials: string,
 *     timeLimit: string,
 *     consultingPlatform: string,
 *     PCTerminal: string,
 *     mobileTerminal: string,
 *     selfServiceTerminal: string,
 *     onlineProcessingProcess: string,
 *     offlineProcessingProcess: string,
 *     windowInfo: string,
 *     serviceObjectType: string,
 *     auditOpinions: string,
 * }}
 */
export const standardItemGuideWithAuditOpinionsToExportFormat = (detailData) => {

    let exportData = standardItemGuideToExportFormat(detailData)

    // 审核意见处理
    let auditOpinions = ''
    for (let opinion of detailData.auditOpinions) {
        auditOpinions += (getYMDHMS(opinion.time) + '：'
            + opinion.userName + '：' + opinion.advise + '\n')
    }

    exportData.auditOpinions = auditOpinions

    return exportData
}

/**
 * 获取符合事项指南导出规范的数据
 * @param itemId {string} 事项在数据库的主码 _id
 * @return {Promise<{
 *     taskName: string,
 *     taskCode: string,
 *     serviceAgentName: string,
 *     serviceAgentCode: string,
 *     applyContent: string,
 *     legalBasis: string,
 *     conditions: string,
 *     materials: string,
 *     timeLimit: string,
 *     consultingPlatform: string,
 *     PCTerminal: string,
 *     mobileTerminal: string,
 *     selfServiceTerminal: string,
 *     onlineProcessingProcess: string,
 *     offlineProcessingProcess: string,
 *     windowInfo: string,
 *     serviceObjectType: string,
 *     auditOpinions: string,
 * }>}
 */
export const getItemGuideWithAuditOpinionsOnExportFormat = async (itemId) => {
    try {
        return standardItemGuideWithAuditOpinionsToExportFormat(await getItemGuideWithAuditOpinions(itemId))
    } catch (e) {
        return e
    }
}
