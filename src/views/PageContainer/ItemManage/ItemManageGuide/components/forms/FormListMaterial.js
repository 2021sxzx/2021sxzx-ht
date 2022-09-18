import { Input, Button, Select } from 'antd'
import { useEffect, useState } from 'react'
import style from './FormListMaterial.module.scss'
const { TextArea } = Input
import { MinusCircleOutlined } from '@ant-design/icons'

export default function FormListMaterial(props){
    const [materials, setMaterials] = useState(props.data)
    const [pageFormatEnabled, setPageFormatEnabled] = useState([true])

    useEffect(function(){
        let enabled = []
        for (let i = 0; i < materials.length; i++){
            if (materials[i].material_form === '2'){
                enabled.push(false)
            }
            else{
                enabled.push(true)
            }
        }
        setPageFormatEnabled(enabled)
    }, [])

    const necessityOptions = [
        { value: '1', tag: '必要' },
        { value: '2', tag: '非必要' },
        { value: '3', tag: '容缺后补' }
    ]

    const typeOptions = [
        { value: '1', tag: '证件证书证明' },
        { value: '2', tag: '申请表格文书' },
        { value: '3', tag: '其他' }
    ]

    const formOptions = [
        { value: '1', tag: '纸质' },
        { value: '2', tag: '电子化' },
        { value: '3', tag: '纸质/电子化' }
    ]

    const requiredOptions = [
        { value: '0', tag: '否' },
        { value: '1', tag: '是' }
    ]

    const handleChange = (input, type, index)=>{
        let tempData = []
        let tempEnabled = []
        for (let i = 0; i < materials.length; i++){
            tempData.push(materials[i])
            tempEnabled.push(pageFormatEnabled[i])
            if (i === index){
                tempData[i][type] = input
                if (type === 'material_form'){
                    if (input === '2') tempEnabled[i] = false
                    else tempEnabled[i] = true
                }
            }
        }
        setMaterials(tempData)
        setPageFormatEnabled(tempEnabled)
        props.setData(tempData)
    }

    const handleDelete = (index)=>{
        let tempData = []
        let tempEnabled = []
        for (let i = 0; i < materials.length; i++){
            if (i === index) continue
            tempData.push(materials[i])
            tempEnabled.push(pageFormatEnabled[i])
        }
        setMaterials(tempData)
        setPageFormatEnabled(tempEnabled)
        props.setData(tempData)
    }

    return(
        <div className={style.form}>
            <div className={style.inputLabel}>
                {props.required === true &&<span style={{color: 'red'}}>*</span>}
                <span style={{marginLeft: 5}}>{props.formName}：</span>
            </div>
            <div className={style.input}>
                {
                    materials.map((item, index)=>
                        <div className={style.singleLine}>
                            <TextArea className={style.windowName} onChange={function(e){
                                handleChange(e.target.value, 'materials_name', index)
                            }} value={item.materials_name} autoSize={true} placeholder='请输入材料名称'/>
                            <div className={style.otherDatas}>
                                <div className={style.oneRow}>
                                    <div className={style.numTitle}>原件数量：</div>
                                    <TextArea className={style.shortTextArea} onChange={function(e){
                                        handleChange(e.target.value, 'origin', index)
                                    }} value={item.origin} autoSize={true} placeholder='请输入非负数作为原件数量'/>

                                    <span className={style.numTitle}>复印件数量：</span>
                                    <TextArea className={style.shortTextArea} onChange={function(e){
                                        handleChange(e.target.value, 'copy', index)
                                    }} value={item.copy} autoSize={true} placeholder='请输入非负数作为复印件数量'/>

                                    <MinusCircleOutlined className={style.delete} onClick={function(){
                                        handleDelete(index)
                                    }}/>
                                </div>

                                <div className={style.oneRow}>
                                    <div className={style.formTitle}>材料形式：</div>
                                    <Select className={style.select} value={item.material_form} onChange={function(value){
                                        handleChange(value, 'material_form', index)
                                    }}>
                                        {
                                            formOptions.map((option)=>
                                                <Option value={option.value} key={option.value}>{option.tag}</Option>)
                                        }
                                    </Select>

                                    <div className={style.pageFormatTitle}>纸质材料规格：</div>
                                    <TextArea disabled={!(pageFormatEnabled[index])} className={style.pageFormat} onChange={function(e){
                                        handleChange(e.target.value, 'page_format', index)
                                    }} value={item.page_format} autoSize={true} placeholder='请输入纸质材料规格' />
                                </div>

                                <div className={style.oneRow}>
                                    <div className={style.formTitle}>是否必要：</div>
                                    <Select className={style.select} value={item.material_necessity} onChange={function(value){
                                        handleChange(value, 'material_necessity', index)
                                    }}>
                                        {
                                            necessityOptions.map((option)=>
                                                <Option value={option.value} key={option.value}>{option.tag}</Option>)
                                        }
                                    </Select>

                                    <div className={style.formTitle}>材料类型：</div>
                                    <Select className={style.select} value={item.material_type} onChange={function(value){
                                        handleChange(value, 'material_type', index)
                                    }}>
                                        {
                                            typeOptions.map((option)=>
                                                <Option value={option.value} key={option.value}>{option.tag}</Option>)
                                        }
                                    </Select>

                                    <div className={style.formTitle}>是否免提交：</div>
                                    <Select className={style.smallSelect} value={item.submissionrequired} onChange={function(value){
                                        handleChange(value, 'submissionrequired', index)
                                    }}>
                                        {
                                            requiredOptions.map((option)=>
                                                <Option value={option.value} key={option.value}>{option.tag}</Option>)
                                        }
                                    </Select>
                                    
                                </div>
                            </div>
                        </div>
                    )
                }
                <Button className={style.addBtn} type='dashed' onClick={()=>{
                    let tempData = []
                    for (let i = 0; i < materials.length; i++){
                        tempData.push(materials[i])
                    }
                    tempData.push({
                        'materials_name': '',
                        'origin': '',
                        'copy': '',
                        'material_form': '1',
                        'material_necessity': '1',
                        'material_type': '1',
                        'page_format': '',
                        'submissionrequired': '0'
                    })
                    pageFormatEnabled.push(true)
                    setMaterials(tempData)
                    props.setData(tempData)
                }}>{props.addBtn}</Button>
            </div>
        </div>
    )
}