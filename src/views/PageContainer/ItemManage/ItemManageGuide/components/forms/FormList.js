import { Input, Button } from 'antd'
import { useState } from 'react'
import style from './FormList.module.scss'
const { TextArea } = Input
import { MinusCircleOutlined } from '@ant-design/icons'

export default function FormListPlus(props){
    const [data, setData] = useState(props.value)
    
    const handleChange = (input, index)=>{
        let tempData = []
        for (let i = 0; i < data.length; i++){
            tempData.push(data[i])
        }
        tempData[index] = input
        setData(tempData)
        props.setData(tempData)
    }

    const handleDelete = (index)=>{
        let tempData = []
        for (let i = 0; i < data.length; i++){
            if (i === index) continue
            tempData.push(data[i])
        }
        setData(tempData)
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
                    data.map((item, index)=>
                        <div className={style.singleLine}>
                            <TextArea className={style.textarea} onChange={function(e){
                                handleChange(e.target.value, index)
                            }} value={data[index]} autoSize={true} placeholder={'请输入' + props.formName}/>
                            <MinusCircleOutlined className={style.delete} onClick={function(){
                                handleDelete(index)
                            }}/>
                        </div>
                    )
                }
                <Button className={style.addBtn} type='dashed' onClick={()=>{
                    let tempData = []
                    for (let i = 0; i < data.length; i++){
                        tempData.push(data[i])
                    }
                    tempData.push('')
                    setData(tempData)
                    props.setData(tempData)
                }}>{props.addBtn}</Button>
            </div>
        </div>
    )
}