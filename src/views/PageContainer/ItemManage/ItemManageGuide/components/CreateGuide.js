import React, {useEffect, useState} from 'react'
import style from './CreateGuide.module.scss'
import { Steps, Space, message, Form, Input, Button, Table, Modal,Descriptions, Badge  } from 'antd';
import api from '../../../../../api/rule';
import FormArea from './forms/FormArea.js';
import FormListPlus from './forms/FormListPlus.js';
import FormTime from './forms/FormTime.js'
import FormList from './forms/FormList.js'
import FormCheckbox from './forms/FormCheckbox.js'
const {Step} = Steps
const {TextArea} = Input

export default function CreateGuide(props){
    // 各个事项指南输入项的值
    const [guideName, setGuideName] = useState('')
    const [guideCode, setGuideCode] = useState('')
    const [guideContent, setGuideContent] = useState('')
    const [guideAccord, setGuideAccord] = useState([''])
    const [guideCondition, setGuideCondition] = useState('')
    const [guideMaterial, setGuideMaterial] = useState([''])
    const [guidePlatform, setGuidePlatform] = useState('')
    const [guidePCAddress, setGuidePCAddress] = useState('')
    const [guidePEAddress, setGuidePEAddress] = useState('')
    const [guideSelfmadeAddress, setGuideSelfmadeAddress] = useState('')
    const [guideQRCode, setGuideQRCode] = useState('')
    const [guideServiceType, setGuideServiceType] = useState([])
    // 审核时限
    const [legalPeriod, setLegalPeriod] = useState('')
    const [legalType, setLegalType] = useState('1')
    const [promisedPeriod, setPromisedPeriod] = useState('')
    const [promisedType, setPromisedType] = useState('1')
    // FormListPlus需要处理的电话和地址，有公用的tag
    const [guideWindow, setGuideWindow] = useState([''])
    const [guidePhone, setGuidePhone] = useState([''])
    const [guideAddress, setGuideAddress] = useState([''])
    // 判断指南输入状态
    const [stepStatus, setStepStatus] = useState(['process', 'wait', 'wait', 'wait'])
    const [current, setCurrent] = useState(0);

    // 处理各个FormArea输入框的状态更新
    // 事项基本信息
    const handleGuideNameChange = (e)=>{
        setGuideName(e.target.value)
    }
    const handleGuideCodeChange = (e)=>{
        setGuideCode(e.target.value)
    }
    const handleGuideContentChange = (e)=>{
        setGuideContent(e.target.value)
    }
    // 资格审核信息
    const handleGuideConditionChange = (e)=>{
        setGuideCondition(e.target.value)
    }
    const handleGuideMaterialChange = (e)=>{
        setGuideMaterial(e.target.value)
    }
    // 业务咨询信息
    const handleGuidePlatformChange = (e)=>{
        setGuidePlatform(e.target.value)
    }
    const handleGuidePCAddressChange = (e)=>{
        setGuidePCAddress(e.target.value)
    }
    const handleGuidePEAddressChange = (e)=>{
        setGuidePEAddress(e.target.value)
    }
    // 业务办理信息
    const handleGuideSelfmadeAddressChange = (e)=>{
        setGuideSelfmadeAddress(e.target.value)
    }
    const handleGuideQRCodeChange = (e)=>{
        setGuideQRCode(e.target.value)
    }

    // 每一步的输入内容
    const steps = [
        {
            title: '事项基本信息',
            content: 
            <Space className={style.form} direction='vertical' size={15} style={{width: '100%'}}>
                <FormArea handleChange={handleGuideNameChange} formName='事项名称' value={guideName}/>
                <FormArea handleChange={handleGuideCodeChange} formName='事项代码' value={guideCode}/>
                <FormArea handleChange={handleGuideContentChange} formName='事项内容' value={guideContent}/>
                <FormList setData={setGuideAccord} addBtn='添加政策依据' formName='政策依据' value={guideAccord}/>
            </Space>
        },
        {
            title: '资格审核信息',
            content: 
            <Space className={style.form} direction='vertical' size={15} style={{width: '100%'}}>
                <FormArea handleChange={handleGuideConditionChange} formName='申办所需审核条件' value={guideCondition}/>
                <FormList setData={setGuideMaterial} addBtn='添加申办材料' formName='申办材料' value={guideMaterial}/>
                <FormTime formName='审核时限' legalPeriod={legalPeriod} legalType={legalType} promisedPeriod={promisedPeriod} promisedType={promisedType}
                    setLegalPeriod={setLegalPeriod} setLegalType={setLegalType} setPromisedPeriod={setPromisedPeriod} setPromisedType={setPromisedType}/>
            </Space>
        },
        {
            title: '业务咨询信息',
            content: 
            <Space className={style.form} direction='vertical' size={15} style={{width: '100%'}}>
                <FormListPlus addBtn='添加电话' formName='咨询电话' value={guidePhone} guideWindow={guideWindow} other={guideAddress}
                    setOther={setGuideAddress} setData={setGuidePhone} setGuideWindow={setGuideWindow}/>
                <FormArea handleChange={handleGuidePlatformChange} formName='咨询平台' value={guidePlatform}/>
                <FormArea handleChange={handleGuidePCAddressChange} formName='网办PC端' value={guidePCAddress}/>
                <FormArea handleChange={handleGuidePEAddressChange} formName='网办移动端' value={guidePEAddress}/>
            </Space>
        },
        {
            title: '业务办理信息',
            content: 
            <Space className={style.form} direction='vertical' size={15} style={{width: '100%'}}>
                <FormArea handleChange={handleGuideSelfmadeAddressChange} formName='自助终端' value={guideSelfmadeAddress}/>
                <FormListPlus addBtn='添加地址' formName='办事大厅地址' value={guideAddress} other={guidePhone} guideWindow={guideWindow}
                    setOther={setGuidePhone} setData={setGuideAddress} setGuideWindow={setGuideWindow}/>
                <FormArea handleChange={handleGuideQRCodeChange} formName='二维码' value={guideQRCode}/>
                <FormCheckbox setData={setGuideServiceType} formName='服务对象类型' value={guideServiceType}/>
            </Space>
        }
    ]

    // 按钮
    const handleCancel = ()=>{
        props.setPageType(1)
    }

    // 判断处理是否有未输入的内容
    const handleCreate = ()=>{
        // TODO: 进行输入检测
        let data = {
            task_code: guideCode,
            task_name: guideName,
            wsyy: guidePCAddress,
            service_object_type: guideServiceType,
            conditions: guideCondition,
            legal_period: parseInt(legalPeriod),
            legal_period_type: legalType,
            promised_period: parseInt(promisedPeriod),
            promised_period_type: promisedType,
            apply_content: guideContent,
            mobile_applt_website: guidePEAddress,
            zxpt: guidePlatform,
            qr_code: guideQRCode
        }
        // 政策依据处理
        let legalBasis = []
        for (let i = 0; i < guideAccord.length; i++){
            legalBasis.push({
                'name': guideAccord[i]
            })
        }
        data['legal_basis'] = legalBasis
        // 申办材料处理
        let submitDocuments = []
        for (let i = 0; i < guideMaterial.length; i++){
            submitDocuments.push({
                'materials_name': guideMaterial[i]
            })
        }
        data['submit_documents'] = submitDocuments
        // 把窗口地址和联系电话组合在一起提交
        let windows = []
        for (let i = 0; i < guideWindow.length; i++){
            windows.push({
                'name': guideWindow[i],
                'address': guideAddress[i],
                'phone': guidePhone[i]
            })
        }
        data['windows'] = windows
        console.log(data)

        api.CreateItemGuide(data).then(response=>{
            props.showSuccess()
            props.setPageType(1)
        }).catch(error=>{
            props.showError()
            props.setPageType(1)
        })

        /*let emptyArea = []
        if (guideName === '') emptyArea.push('事项名称')
        if (guideCode === '') emptyArea.push('事项编码')
        if (guideContent === '') emptyArea.push('事项内容')
        if (guideAccord === '') emptyArea.push('政策依据')
        if (guideCondition === '') emptyArea.push('申办所需资格条件')
        if (guideMaterial === '') emptyArea.push('申办材料')
        if (guideTimeLimit === '') emptyArea.push('审核时限')
        if (guidePhone === '') emptyArea.push('咨询电话')
        if (guidePlatform === '') emptyArea.push('咨询平台')
        if (guidePCAddress === '') emptyArea.push('网办PC端')
        if (guidePEAddress === '') emptyArea.push('网办移动端')
        if (guideSelfmadeAddress === '') emptyArea.push('自助终端')
        if (guideAddress === '')  emptyArea.push('办事大厅地址')
        if (guideQRCode === '') emptyArea.push('二维码')

        if (emptyArea.length === 0){
            showConfirmCreate()
        }
        else{
            showEnterFull(emptyArea)
        }*/
    }

    const nextStep = ()=>{
      setCurrent(current + 1);
    };
  
    const prevStep = ()=>{
      setCurrent(current - 1);
    };

    const handleCurrentChange = (current)=>{
        setCurrent(current)
    }
    
    // api调用
    const createItemGuide = ()=>{
        let data = {
            guideName, guideCode, guideContent, guideAccord,
            guideCondition, guideMaterial, guideTimeLimit,
            guidePhone, guidePlatform, guidePCAddress, guidePEAddress,
            guideSelfmadeAddress, guideAddress, guideQRCode
        }
        console.log(data)
    }

    // 点击创建后根据表单是否填写完毕触发不同函数
    const showEnterFull = (emptyArea)=>{
        let str = ''
        for (let i = 0; i < emptyArea.length; i++){
            str = str + '      · ' + emptyArea[i] + '\n'
        }
        Modal.error({
            title: '未输入完毕',
            content: '本表单仍有以下内容未填写：\n' + str + '请填写完毕后再创建！',
            centered: true,
            style: {whiteSpace: 'pre'}
        })
    }

    const showConfirmCreate = ()=>{
        Modal.confirm({
            title: '确认创建',
            content: '确认创建《' + guideName + '》吗？',
            centered: true,
            onOk: createItemGuide
        })
    }

    // 翻页时进行每个步骤的输入是否完成
    useEffect(function(){
        let tempStatus = ['', '', '', '']
        // 事项基本信息
        if (guideName !== '' && guideCode !== '' && guideContent !== '' && guideAccord.length !== 0){
            tempStatus[0] = 'finish'
            for (let i = 0; i < guideAccord.length; i++){
                if (guideAccord[i] === ''){
                    tempStatus[0] = 'wait'
                    break
                }
            }
        }
        else{
            tempStatus[0] = 'wait'
        }
        // 资格审核信息
        if (guideCondition !== '' && guideMaterial !== ''){
            if (legalType === '0' && legalType === '0'){
                tempStatus[1] = 'wait'
            }
            else{
                if ((legalType !== '0' && legalPeriod === '') || (promisedType !== '0' && promisedPeriod === '')){
                    tempStatus[1] = 'wait'
                }
                else{
                    tempStatus[1] = 'finish'
                    for (let i = 0; i < guideMaterial.length; i++){
                        if (guideMaterial[i] === ''){
                            tempStatus[1] = 'wait'
                            break
                        }
                    }
                }
            }
        }
        else{
            tempStatus[1] = 'wait'
        }
        // 业务咨询信息
        if (guidePhone.length !== 0 && guidePlatform !== '' && guidePCAddress !== '' && guidePEAddress !== ''){
            tempStatus[2] = 'finish'
            for (let i = 0; i < guidePhone.length; i++){
                if (guidePhone[i] === '' || guideWindow[i] === ''){
                    tempStatus[2] = 'wait'
                    break
                }
            }
            
        }
        else{
            tempStatus[2] = 'wait'
        }
        // 业务办理信息
        if (guideSelfmadeAddress !== '' && guideAddress.length !== 0 && guideQRCode !== ''){
            tempStatus[3] = 'finish'
            for (let i = 0; i < guideAddress.length; i++){
                if (guideAddress[i] === '' || guideWindow[i] === ''){
                    tempStatus[3] = 'wait'
                    break
                }
            } 
        }
        else{
            tempStatus[3] = 'wait'
        }
        tempStatus[current] = 'process'
        setStepStatus(tempStatus)
    }, [current])

    useEffect(function(){
        if ('guideCode' in props.modifyContent){
            let c = props.modifyContent
            setGuideName(c.guideName)
            setGuideCode(c.guideCode)
            setGuideContent(c.guideContent)
            setGuideAccord(c.guideAccord)
            setGuideCondition(c.guideCondition)
            setGuideMaterial(c.guideMaterial)
            setGuideTimeLimit(c.guideTimeLimit)
            setGuidePhone(c.guidePhone)
            setGuidePlatform(c.guidePlatform)
            setGuidePCAddress(c.guidePCAddress)
            setGuidePEAddress(c.guidePEAddress)
            setGuideSelfmadeAddress(c.guideSelfmadeAddress)
            setGuideAddress(c.guideAddress)
            setGuideQRCode(c.guideQRCode)
        }
    }, [])

    return (
        <Space direction='vertical' size={15} style={{width: '100%'}}>
            <Steps current={current} onChange={handleCurrentChange} type="navigation"
                className={style.siteNavigationSteps} style={{width: '100%'}}>
                {steps.map((item, index) => 
                    <Step key={item.title} title={item.title} status={stepStatus[index]}/>
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
                        onClick={handleCreate}>
                        创建
                    </Button>
                }
            </div>
        </Space>
    )
}