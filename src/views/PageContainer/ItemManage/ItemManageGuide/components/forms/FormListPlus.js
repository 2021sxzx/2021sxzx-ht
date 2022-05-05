import { Input, Button } from 'antd'
import { useState } from 'react'
import style from './FormListPlus.module.scss'
const { TextArea } = Input
import { MinusCircleOutlined } from '@ant-design/icons'

export default function FormListPlus(props){
    const [windows, setWindows] = useState(props.data)

    const handleChange = (input, type, index)=>{
        let tempData = []
        for (let i = 0; i < windows.length; i++){
            tempData.push(windows[i])
            if (i === index){
                tempData[i][type] = input
            }
        }
        setWindows(tempData)
        props.setData(tempData)
    }

    const handleDelete = (index)=>{
        let tempData = []
        for (let i = 0; i < windows.length; i++){
            if (i === index) continue
            tempData.push(windows[i])
        }
        setWindows(tempData)
        props.setData(tempData)
    }

    return(
        <div className={style.form}>
            <div className={style.inputLabel}>
                <span style={{color: 'red'}}>*</span>
                <span style={{marginLeft: 5}}>{props.formName}：</span>
            </div>
            <div className={style.input}>
                {
                    windows.map((item, index)=>
                        <div className={style.singleLine}>
                            <TextArea className={style.windowName} onChange={function(e){
                                handleChange(e.target.value, 'name', index)
                            }} value={windows[index].name} autoSize={true} placeholder='请输入办理点名称'/>
                            <div className={style.otherDatas}>
                                <div className={style.oneRow}>
                                    <TextArea className={style.shortTextArea} onChange={function(e){
                                        handleChange(e.target.value, 'address', index)
                                    }} value={windows[index].address} autoSize={true} placeholder='请输入办理地点'/>
                                    <MinusCircleOutlined className={style.delete} onClick={function(){
                                        handleDelete(index)
                                    }}/>
                                </div>
                                <div className={style.oneRow}>
                                    <TextArea className={style.longTextArea} onChange={function(e){
                                        handleChange(e.target.value, 'phone', index)
                                    }} value={windows[index].phone} autoSize={true} placeholder='请输入咨询及投诉电话' />
                                </div>
                                <div className={style.oneRow}>
                                    <TextArea className={style.longTextArea} onChange={function(e){
                                        handleChange(e.target.value, 'office_hour', index)
                                    }} value={windows[index].office_hour} autoSize={true} placeholder='请输入咨询及投诉电话' />
                                </div>
                            </div>
                        </div>
                    )
                }
                <Button className={style.addBtn} type='dashed' onClick={()=>{
                    let tempData = []
                    for (let i = 0; i < windows.length; i++){
                        tempData.push(windows[i])
                    }
                    tempData.push({
                        'name': '',
                        'phone': '',
                        'address': '',
                        'office_hour': ''
                    })
                    setWindows(tempData)
                    props.setData(tempData)
                }}>{props.addBtn}</Button>
            </div>
        </div>
    )
}