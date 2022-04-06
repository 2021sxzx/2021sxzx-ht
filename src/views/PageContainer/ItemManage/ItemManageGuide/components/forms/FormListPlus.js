import { Input, Button } from 'antd'
import { useState, useEffect } from 'react'
import style from './FormListPlus.module.scss'
const { TextArea } = Input
import { MinusCircleOutlined } from '@ant-design/icons';

export default function FormListPlus(props){
    const [window, setWindow] = useState(props.guideWindow)
    const [data, setData] = useState(props.value)

    const handleChange = (input, type, index)=>{
        if (type === 'data'){
            let tempData = []
            for (let i = 0; i < data.length; i++){
                tempData.push(data[i])
            }
            tempData[index] = input
            setData(tempData)
            props.setData(tempData)
        }
        else{
            let tempWindow = []
            for (let i = 0; i < window.length; i++){
                tempWindow.push(window[i])
            }
            tempWindow[index] = input
            setWindow(tempWindow)
            props.setGuideWindow(tempWindow)
        }
    }

    const handleDelete = (index)=>{
        let tempData = []
        let tempWindow = []
        let tempOther = []
        for (let i = 0; i < data.length; i++){
            if (i === index) continue
            tempData.push(data[i])
            tempWindow.push(window[i])
            tempOther.push(props.other[i])
        }
        setData(tempData)
        setWindow(tempWindow)
        props.setGuideWindow(tempWindow)
        props.setData(tempData)
        props.setOther(tempOther)
    }

    return(
        <div className={style.form}>
            <div className={style.inputLabel}>
                <span style={{color: 'red'}}>*</span>
                <span style={{marginLeft: 5}}>{props.formName}：</span>
            </div>
            <div className={style.input}>
                {
                    window.map((item, index)=>
                        <div className={style.singleLine}>
                            <TextArea className={style.textarea1} onChange={function(e){
                                handleChange(e.target.value, 'window', index)
                            }} value={window[index]} autoSize={true} placeholder='请输入办理点名称'/>
                            <TextArea className={style.textarea2} onChange={function(e){
                                handleChange(e.target.value, 'data', index)
                            }} value={data[index]} autoSize={true} placeholder={'请输入' + props.formName}/>
                            <MinusCircleOutlined className={style.delete} onClick={function(){
                                handleDelete(index)
                            }}/>
                        </div>
                    )
                }
                <Button className={style.addBtn} type='dashed' onClick={()=>{
                    let tempData = []
                    let tempWindow = []
                    let tempOther = []
                    for (let i = 0; i < data.length; i++){
                        tempData.push(data[i])
                        tempWindow.push(window[i])
                        tempOther.push(props.other[i])
                    }
                    tempData.push('')
                    tempWindow.push('')
                    tempOther.push('')
                    setData(tempData)
                    setWindow(tempWindow)
                    props.setGuideWindow(tempWindow)
                    props.setData(tempData)
                    props.setOther(tempOther)
                }}>{props.addBtn}</Button>
            </div>
        </div>
    )
}