import React, {useEffect, useState} from 'react'
import style from './CreateGuide.module.scss'
import {Steps, Space, Button, Modal, message} from 'antd'
import api from '../../../../../api/rule'
import guideApi from '../../../../../api/itemGuide'
import FormArea from './forms/FormArea.js'
import FormUser from './forms/FormUser.js'
import FormListPlus from './forms/FormListPlus.js'
import FormListMaterial from './forms/FormListMaterial.js'
import FormTime from './forms/FormTime.js'
import FormList from './forms/FormList.js'
import FormCheckbox from './forms/FormCheckbox.js'

const {Step} = Steps

export default function CreateGuide(props) {
    // 各个事项指南输入项的值
    const isUpdating = 'guideCode' in props.modifyContent
    const [buttonLoading, setButtonLoading] = useState(false)
    const [principle, setPrinciple] =
        useState(isUpdating ? props.modifyContent.principle : '')
    const [principleId, setPrincipleId] =
        useState(isUpdating ? props.modifyContent.principleId : props.userId)
    const [guideName, setGuideName] =
        useState(isUpdating ? props.modifyContent.guideName : '')
    const [guideCode, setGuideCode] =
        useState(isUpdating ? props.modifyContent.guideCode : '')
    const [serviceAgentName, setServiceAgentName] =
        useState(isUpdating ? props.modifyContent.serviceAgentName : '')
    const [serviceAgentCode, setServiceAgentCode] =
        useState(isUpdating ? props.modifyContent.serviceAgentCode : '')
    const [guideContent, setGuideContent] =
        useState(isUpdating ? props.modifyContent.guideContent : '')
    const [guideAccord, setGuideAccord] =
        useState(isUpdating ? props.modifyContent.guideAccord : [''])
    const [guideCondition, setGuideCondition] =
        useState(isUpdating ? props.modifyContent.guideCondition : '')
    const [guideMaterial, setGuideMaterial] =
        useState(isUpdating ? props.modifyContent.guideMaterial : [{
            'materials_name': '',
            'origin': '',
            'copy': '',
            'material_form': '1',
            'material_necessity': '1',
            'material_type': '1',
            'page_format': '',
            'submissionrequired': '0'
        }])
    const [guidePlatform, setGuidePlatform] =
        useState(isUpdating ? props.modifyContent.guidePlatform : '')
    const [guidePCAddress, setGuidePCAddress] =
        useState(isUpdating ? props.modifyContent.guidePCAddress : '')
    const [guidePEAddress, setGuidePEAddress] =
        useState(isUpdating ? props.modifyContent.guidePEAddress : '')
    const [guideSelfmadeAddress, setGuideSelfmadeAddress] =
        useState(isUpdating ? props.modifyContent.guideSelfmadeAddress : '')
    const [guideOnlineProcess, setGuideOnlineProcess] =
        useState(isUpdating ? props.modifyContent.guideOnlineProcess : '')
    const [guideOfflineProcess, setGuideOfflineProcess] =
        useState(isUpdating ? props.modifyContent.guideOfflineProcess : '')
    // const [guideQRCode, setGuideQRCode] =
    //     useState(isUpdating ? props.modifyContent.guideQRCode : '')
    const [guideServiceType, setGuideServiceType] =
        useState(isUpdating ? props.modifyContent.guideServiceType : [])
    // 审核时限
    const [legalPeriod, setLegalPeriod] =
        useState(isUpdating ? props.modifyContent.legalPeriod : '')
    const [legalType, setLegalType] =
        useState(isUpdating ? props.modifyContent.legalType : '1')
    const [promisedPeriod, setPromisedPeriod] =
        useState(isUpdating ? props.modifyContent.promisedPeriod : '')
    const [promisedType, setPromisedType] =
        useState(isUpdating ? props.modifyContent.promisedType : '1')
    // 办理点信息
    const [guideWindows, setGuideWindows] =
        useState(isUpdating ? props.modifyContent.guideWindows : [{
            'name': '',
            'phone': '',
            'address': '',
            'office_hour': ''
        }])
    // 判断指南输入状态
    const [stepStatus, setStepStatus] = useState(['process', 'wait', 'wait', 'wait'])
    const [current, setCurrent] = useState(0)

    useEffect(function () {
        // 新建时，默认负责人为账号本人
        if (isUpdating || principleId === '' || principle !== '') return
        api.GetUserNameById({
            user_id: props.userId
        }).then(response => {
            setPrinciple(response.data.data.user_name)
        }).catch(error => {
            props.showError('获取用户信息失败，请稍后重试。' + error.message)
        })
    }, [principleId])

    // 处理各个FormArea输入框的状态更新
    // 事项基本信息
    const handleGuideNameChange = (e) => {
        setGuideName(e.target.value)
    }
    const handleGuideCodeChange = (e) => {
        setGuideCode(e.target.value)
    }
    const handleServiceAgentName = (e) => {
        setServiceAgentName(e.target.value)
    }
    const handleServiceAgentCode = (e) => {
        setServiceAgentCode(e.target.value)
    }
    const handleGuideContentChange = (e) => {
        setGuideContent(e.target.value)
    }
    // 资格审核信息
    const handleGuideConditionChange = (e) => {
        setGuideCondition(e.target.value)
    }
    // 业务咨询信息
    const handleGuidePlatformChange = (e) => {
        setGuidePlatform(e.target.value)
    }
    const handleGuidePCAddressChange = (e) => {
        setGuidePCAddress(e.target.value)
    }
    const handleGuidePEAddressChange = (e) => {
        setGuidePEAddress(e.target.value)
    }
    // 业务办理信息
    const handleGuideSelfmadeAddressChange = (e) => {
        setGuideSelfmadeAddress(e.target.value)
    }
    const handleGuideOnlineProcessChange = (e) => {
        setGuideOnlineProcess(e.target.value)
    }
    const handleGuideOfflineProcessChange = (e) => {
        setGuideOfflineProcess(e.target.value)
    }
    // const handleGuideQRCodeChange = (e)=>{
    //     setGuideQRCode(e.target.value)
    // }


    // 每一步的输入内容
    const steps = [
        {
            title: '事项基本信息',
            content:
                <Space className={style.form} direction='vertical' size={15} style={{width: '95%'}}>
                    <FormUser setPrinciple={setPrinciple}
                              setPrincipleId={setPrincipleId}
                              formName='负责人'
                              value={principle}
                              showError={props.showError}
                              maxLength={64}
                    />
                    <FormArea handleChange={handleGuideNameChange}
                              formName='事项名称'
                              value={guideName}
                              required={true}
                              maxLength={128}
                    />
                    <FormArea handleChange={handleGuideCodeChange}
                              formName='事项代码'
                              value={guideCode}
                              required={true}
                              maxLength={64}
                    />
                    <FormArea handleChange={handleServiceAgentName}
                              formName='实施主体名称'
                              value={serviceAgentName}
                              required={true}
                              maxLength={64}
                    />
                    <FormArea handleChange={handleServiceAgentCode}
                              formName='实施主体编码'
                              value={serviceAgentCode}
                              required={true}
                              maxLength={64}
                    />
                    <FormArea handleChange={handleGuideContentChange}
                              formName='事项内容'
                              value={guideContent}
                              maxLength={2048}
                    />
                    <FormList setData={setGuideAccord}
                              addBtn='添加政策依据'
                              formName='政策依据'
                              value={guideAccord}
                              maxLength={256}
                    />
                </Space>
        },
        {
            title: '资格审核信息',
            content:
                <Space className={style.form} direction='vertical' size={15} style={{width: '95%'}}>
                    <FormArea handleChange={handleGuideConditionChange}
                              formName='申办所需审核条件'
                              value={guideCondition}
                              maxLength={1024}
                    />
                    <FormListMaterial addBtn='添加申办所需材料'
                                      formName='申办所需材料'
                                      data={guideMaterial}
                                      setData={setGuideMaterial}
                                      maxLength={1024}
                    />
                    <FormTime formName='审核时限'
                              legalPeriod={legalPeriod}
                              legalType={legalType}
                              promisedPeriod={promisedPeriod}
                              promisedType={promisedType}
                              setLegalPeriod={setLegalPeriod}
                              setLegalType={setLegalType}
                              setPromisedPeriod={setPromisedPeriod}
                              setPromisedType={setPromisedType}
                              maxLength={64}
                    />
                </Space>
        },
        {
            title: '业务咨询信息',
            content:
                <Space className={style.form}
                       direction='vertical'
                       size={15}
                       style={{width: '95%'}}>
                    <FormArea handleChange={handleGuidePlatformChange}
                              formName='咨询平台'
                              value={guidePlatform}
                              maxLength={1024}
                    />
                    <FormArea handleChange={handleGuidePCAddressChange}
                              formName='网办PC端'
                              value={guidePCAddress}
                              maxLength={1024}
                    />
                    <FormArea handleChange={handleGuidePEAddressChange}
                              formName='网办移动端'
                              value={guidePEAddress}
                              maxLength={1024}
                    />
                </Space>
        },
        {
            title: '业务办理信息',
            content:
                <Space className={style.form} direction='vertical' size={15} style={{width: '95%'}}>
                    <FormArea handleChange={handleGuideSelfmadeAddressChange}
                              formName='自助终端'
                              value={guideSelfmadeAddress}
                              maxLength={1024}
                    />
                    <FormArea handleChange={handleGuideOnlineProcessChange}
                              formName='网上办理流程'
                              value={guideOnlineProcess}
                              maxLength={2048}
                    />
                    <FormArea handleChange={handleGuideOfflineProcessChange}
                              formName='线下办理流程'
                              value={guideOfflineProcess}
                              maxLength={2048}
                    />
                    <FormListPlus addBtn='添加办理点'
                                  formName='办理点信息'
                                  data={guideWindows}
                                  setData={setGuideWindows}
                                  required={true}
                                  maxLength={256}
                    />
                    {/*<FormImage setImageUpdated={setImageUpdated} setData={setGuideQRCode} handleChange={handleGuideQRCodeChange} formName='二维码' value={guideQRCode}/>*/}
                    <FormCheckbox setData={setGuideServiceType}
                                  formName='服务对象类型'
                                  value={guideServiceType}
                                  required={true}
                                  maxLength={128}
                    />
                </Space>
        }
    ]

    // 按钮
    const handleCancel = () => {
        props.setPageType(1)
    }

    // 判断处理是否有未输入的内容
    const handleChange = () => {
        let emptyArea = []
        let notNum = false
        let notGood = false
        if (guideName === '') emptyArea.push('事项名称')
        if (guideCode === '') emptyArea.push('事项编码')
        if (serviceAgentName === '') emptyArea.push('实施主体名称')
        if (serviceAgentCode === '') emptyArea.push('实施主体编码')
        // if (guideContent === '') emptyArea.push('事项内容')
        // 政策依据数组处理
        // if (guideAccord.length === 0) {
        //     emptyArea.push('政策依据')
        // } else {
        //     for (let i = 0; i < guideAccord.length; i++) {
        //         if (guideAccord[i] === '') {
        //             emptyArea.push('政策依据')
        //             break
        //         }
        //     }
        // }
        // if (guideCondition === '') emptyArea.push('申办所需资格条件')
        // 所需申办材料数组处理
        // if (guideMaterial.length === 0) {
        //     emptyArea.push('申办所需材料')
        // } else {
        //     for (let i = 0; i < guideMaterial.length; i++) {
        //         let empty = false
        //         let origin = -1
        //         let copy = -1
        //         for (let key in guideMaterial[i]) {
        //             if (guideMaterial[i][key] === '') {
        //                 // 只有当非电子版时需要检测page_format
        //                 if (key === 'page_format' && guideMaterial[i].material_form === '2') continue
        //                 empty = true
        //                 break
        //             } else {
        //                 if (key === 'origin') {
        //                     origin = parseInt(guideMaterial[i][key])
        //                 }
        //                 if (key === 'copy') {
        //                     copy = parseInt(guideMaterial[i][key])
        //                 }
        //             }
        //         }
        //         if (isNaN(origin) || isNaN(copy) || origin < 0 || copy < 0) {
        //             notGood = true
        //         }
        //         if (empty) {
        //             emptyArea.push('申办所需材料')
        //             break
        //         }
        //     }
        // }
        // 申办时限数据处理
        // if (legalType !== '0' || promisedType !== '0') {
        //     if ((legalType !== '0' && legalPeriod === '') || (promisedType !== '0' && promisedPeriod === '')) {
        //         emptyArea.push('申办时限')
        //     } else {
        //         let legal = 0
        //         let promised = 0
        //         if (legalType !== '0') {
        //             legal = parseInt(legalPeriod)
        //         }
        //         if (promisedType !== '0') {
        //             promised = parseInt(promisedPeriod)
        //         }
        //         if (isNaN(legal) || isNaN(promised) || (legalType !== '0' && legal <= 0) || (promisedType !== '0' && promised <= 0)) {
        //             notNum = true
        //         }
        //     }
        // } else {
        //     emptyArea.push('申办时限')
        // }
        // if (guidePlatform === '') emptyArea.push('咨询平台')
        // if (guidePCAddress === '') emptyArea.push('网办PC端')
        // if (guidePEAddress === '') emptyArea.push('网办移动端')
        // if (guideSelfmadeAddress === '') emptyArea.push('自助终端')
        if (guideWindows.length === 0) {
            emptyArea.push('办理点信息')
        } else {
            let empty = false
            for (let i = 0; i < guideWindows.length; i++) {
                for (let key in guideWindows[i]) {
                    if (guideWindows[i][key] === '') {
                        empty = true
                        break
                    }
                }


            }
            // console.log("empty:",empty)
            if (empty) {
                emptyArea.push('办理点信息')
            }
        }
        // if (guideOnlineProcess === '') emptyArea.push('网上办理流程')
        // if (guideOfflineProcess === '') emptyArea.push('线下办理流程')
        // if (guideQRCode === '') emptyArea.push('二维码')
        if (guideServiceType.length === 0) emptyArea.push('服务对象类型')
        if (emptyArea.length === 0 && !notNum && !notGood) {
            showConfirm()
        } else {
            showEnterFull(emptyArea, notNum, notGood)
        }
    }

    // 点击创建后根据表单是否填写完毕触发不同函数
    // 未完成提示
    const showEnterFull = (emptyArea, notNum, notGood) => {
        let empties = ''
        if (emptyArea.length !== 0) {
            for (let i = 0; i < emptyArea.length; i++) {
                empties = empties + '      · ' + emptyArea[i] + '\n'
            }
            empties = '本表单仍有以下内容未填写：\n' + empties + '请填写完毕后再创建！'
        }
        if (notNum) {
            if (empties !== '') empties += '\n'
            empties += '申办时限处的输入必须是正整数，请进行修改！'
        }
        if (notGood) {
            if (empties !== '') empties += '\n'
            empties += '申办所需材料处的材料份数必须是非负数，请进行修改！'
        }

        Modal.error({
            title: '输入错误',
            content: empties,
            centered: true,
            style: {whiteSpace: 'pre'}
        })
    }

    // 确认窗口
    const showConfirm = () => {
        Modal.confirm({
            title: isUpdating ? '确认修改' : '确认创建',
            content: isUpdating ?
                ('确认将《' + props.modifyContent.guideName + '》修改为《' + guideName + '》吗？') :
                ('确认创建《' + guideName + '》吗？'),
            centered: true,
            onOk: function () {
                dataProcessing()
            }
        })
    }

    const inj_judge = (str) => {
        let inj_str = ['delete', 'and', 'exec', 'insert', 'update', 'count', 'master', 'select',
            'char', 'declare', 'or', '|', 'delete', 'not', '/*', '*/', 'find']
        for (let i = 0; i < inj_str.length; i++) {
            if (str.indexOf(inj_str[i]) >= 0) {
                return true
            }
        }
        return false
    }

    const showInlegal = () => {
        Modal.warning({
            centered: true,
            title: '非法输入',
            content: '输入信息中有非法输入内容，请检查输入！'
        })
        setButtonLoading(false)
    }

    // 数据预处理
    const dataProcessing = () => {
        let data = {}
        setButtonLoading(true)
        if (inj_judge(guideName) || inj_judge(guidePCAddress) || inj_judge(guideCondition)
            || inj_judge(guideContent) || inj_judge(serviceAgentName) || inj_judge(serviceAgentCode) || inj_judge(guidePEAddress) || inj_judge(guidePlatform)
            || inj_judge(guideSelfmadeAddress) || inj_judge(guideOfflineProcess) || inj_judge(guideOnlineProcess)) {
            showInlegal()
            return
        } else {
            data = {
                user_id: principleId,
                task_name: guideName,
                service_agent_name: serviceAgentName,
                service_agent_code: serviceAgentCode,
                wsyy: guidePCAddress,
                service_object_type: guideServiceType,
                conditions: guideCondition,
                legal_period: parseInt(legalPeriod),
                legal_period_type: legalType === '0' ? null : legalType,
                promised_period: parseInt(promisedPeriod),
                promised_period_type: promisedType === '0' ? null : promisedType,
                apply_content: guideContent,
                mobile_applt_website: guidePEAddress,
                zxpt: guidePlatform,
                zzzd: guideSelfmadeAddress,
                //windows: guideWindows,
                ckbllc: guideOfflineProcess,
                wsbllc: guideOnlineProcess
            }
        }

        // 只在图片上传完成后处理二维码图片
        // if (imageUpdated){
        //     data['qr_code'] = guideQRCode
        // }
        // 办理点信息处理
        let tempWindows = []
        for (let i = 0; i < guideWindows.length; i++) {
            let tempWindow = {}
            for (let key in guideWindows[i]) {
                if (inj_judge(guideWindows[i][key])) {
                    showInlegal()
                    return
                }
                tempWindow[key] = guideWindows[i][key]
            }
            tempWindows.push(tempWindow)
        }
        data['windows'] = tempWindows
        // 政策依据处理
        let legalBasis = []
        for (let i = 0; i < guideAccord.length; i++) {
            if (inj_judge(guideAccord[i])) {
                showInlegal()
                return
            }
            legalBasis.push({
                'name': guideAccord[i]
            })
        }
        data['legal_basis'] = legalBasis
        // 所需申办材料处理
        let tempMaterials = []
        for (let i = 0; i < guideMaterial.length; i++) {
            let tempMaterial = {}
            for (let key in guideMaterial[i]) {
                if (key !== 'origin' && key !== 'copy' && inj_judge(guideMaterial[i][key])) {
                    showInlegal()
                    return
                }
                // 若没有page_format则跳过
                if (key === 'page_format' && guideMaterial[i].material_form === '2') continue
                tempMaterial[key] = guideMaterial[i][key]
            }
            tempMaterials.push(tempMaterial)
        }
        data['submit_documents'] = tempMaterials
        // 指南编码处理
        if (inj_judge(guideCode)) {
            showInlegal()
            return
        }
        if (isUpdating) {
            data['task_code'] = props.modifyId
            data['new_task_code'] = guideCode
            if (props.modifyId !== guideCode) {
                guideApi.GetItemGuides({
                    task_code: guideCode
                }).then(response => {
                    if (response.data.data.length === 0) {
                        updateItemGuide(data)
                    } else {
                        Modal.warning({
                            title: '已有指南',
                            content: '该指南编码已存在，请重新输入！',
                            centered: true
                        })
                        setButtonLoading(false)
                    }
                }).catch(error => {
                    message.error('获取事项指南详情信息失败，请稍后重试。' + error.message)
                })
            } else {
                updateItemGuide(data)
            }
        } else {
            data['task_code'] = guideCode
            guideApi.GetItemGuides({
                task_code: guideCode
            }).then(response => {
                if (response.data.data.length === 0) {
                    createItemGuide(data)
                } else {
                    Modal.warning({
                        title: '已有指南',
                        content: '该指南编码已存在，请重新输入！',
                        centered: true
                    })
                    setButtonLoading(false)
                }
            }).catch(error => {
                message.error('获取事项指南详情信息失败，请稍后重试。' + error.message)
            })
        }
    }

    // api调用
    const createItemGuide = (data) => {
        guideApi.CreateItemGuide(data).then(() => {
            props.showSuccess()
            props.setPageType(1)
        }).catch(error => {
            props.showError('创建指南失败，请稍后尝试。' + error.message)
        })
    }

    const updateItemGuide = (data) => {
        guideApi.updateItemGuide(data).then(() => {
            props.showSuccess()
            props.setPageType(1)
        }).catch(error => {
            props.showError('编辑指南失败，请稍后尝试。' + error.message)
        })
    }

    // 翻页时进行每个步骤的输入是否完成
    useEffect(function () {
        let tempStatus = ['', '', '', '']
        // 事项基本信息
        if (guideName !== '' && guideCode !== '' && serviceAgentName !== '' && serviceAgentCode !== '') {
            tempStatus[0] = 'finish'
            for (let i = 0; i < guideAccord.length; i++) {
                if (guideAccord[i] === '') {
                    tempStatus[0] = 'wait'
                    break
                }
            }
        } else {
            tempStatus[0] = 'wait'
        }
        // 资格审核信息
        tempStatus[1] = 'finish'
        for (let i = 0; i < guideMaterial.length; i++) {
            for (let key in guideMaterial[i]) {
                if (guideMaterial[i][key] === '' && !(key === 'page_format' && guideMaterial[i].material_form === '2')) {
                    tempStatus[1] = 'wait'
                }
            }
        }
        // if (guideCondition !== '' && guideMaterial !== '') {
        //     if (legalType === '0' && legalType === '0') {
        //         tempStatus[1] = 'wait'
        //     } else {
        //         if ((legalType !== '0' && legalPeriod === '') || (promisedType !== '0' && promisedPeriod === '')) {
        //             tempStatus[1] = 'wait'
        //         } else {
        //             tempStatus[1] = 'finish'
        //             for (let i = 0; i < guideMaterial.length; i++) {
        //                 for (let key in guideMaterial[i]) {
        //                     if (guideMaterial[i][key] === '') {
        //                         if (key === 'page_format' && guideMaterial[i].material_form === '2') continue
        //                         else tempStatus[1] = 'wait'
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // } else {
        //     tempStatus[1] = 'wait'
        // }
        // 业务咨询信息
        tempStatus[2] = 'finish'
        // if (guidePlatform !== '' && guidePCAddress !== '' && guidePEAddress !== '') {
        //     tempStatus[2] = 'finish'
        // } else {
        //     tempStatus[2] = 'wait'
        // }
        // 业务办理信息
        if (guideWindows && guideServiceType && guideWindows.length !== 0 && guideServiceType.length !== 0) {
            tempStatus[3] = 'finish'
            for (let i = 0; i < guideWindows.length; i++) {
                for (let key in guideWindows[i]) {
                    if (guideWindows[i].key === '') {
                        tempStatus[3] = 'wait'
                    }
                }
            }
        } else {
            tempStatus[3] = 'wait'
        }
        // if (guideSelfmadeAddress !== '' && guideOnlineProcess !== '' && guideOfflineProcess !== '' && guideWindows.length !== 0/* && guideQRCode !== ''*/) {
        //     tempStatus[3] = 'finish'
        //     for (let i = 0; i < guideWindows.length; i++) {
        //         for (let key in guideWindows[i]) {
        //             if (guideWindows[i].key === '') {
        //                 tempStatus[3] = 'wait'
        //             }
        //         }
        //     }
        // } else {
        //     tempStatus[3] = 'wait'
        // }
        tempStatus[current] = 'process'
        setStepStatus(tempStatus)
    }, [current])

    const nextStep = () => {
        setCurrent(current + 1);
    };

    const prevStep = () => {
        setCurrent(current - 1);
    };

    const handleCurrentChange = (current) => {
        setCurrent(current)
    }

    return (
        <Space direction='vertical' size={15} style={{width: '100%'}}>
            <Steps current={current} onChange={handleCurrentChange} type="navigation"
                   className={style.siteNavigationSteps} style={{width: '100%'}}>
                {steps.map((item, index) =>
                    <Step key={item.title} title={item.title} style={{width: '95%'}} status={stepStatus[index]}/>
                )}
            </Steps>
            <div className={style.stepsContent}>
                {steps[current].content}
            </div>

            <div className={style.buttons}>
                <Button type='default' size='middle' className={style.button}
                        onClick={handleCancel}>
                    取消
                </Button>
                {
                    current > 0 &&
                    <Button type='primary' size='middle' className={style.button}
                            onClick={prevStep}>
                        上一步
                    </Button>
                }
                {
                    current !== steps.length - 1 &&
                    <Button type='primary' size='middle' className={style.button}
                            onClick={nextStep}>
                        下一步
                    </Button>
                }
                {
                    <Button type='primary' size='middle' className={style.button}
                            onClick={handleChange} loading={buttonLoading}>
                        {isUpdating ? '修改' : '创建'}
                    </Button>
                }
            </div>
        </Space>
    )
}
