import {Checkbox} from 'antd'
import style from './FormCheckbox.module.scss'
import {useState} from 'react'

export default function FormCheckbox(props) {
    const [data, setData] = useState(props.value)

    const serviceType = [
        {label: '自然人', value: 1},
        {label: '企业法人', value: 2},
        {label: '事业法人', value: 3},
        {label: '社会组织法人', value: 4},
        {label: '非法人机关', value: 5},
        {label: '行政机关', value: 6},
        {label: '其他组织', value: 9}
    ]

    const handleChange = (value) => {
        setData(value)
        props.setData(value)
    }

    return (
        <div className={style.form}>
            <div className={style.inputLabel}>
                {props.required === true && <span style={{color: 'red'}}>*</span>}
                <span style={{marginLeft: 5}}>{props.formName}：</span>
            </div>
            <div className={style.input}>
                <Checkbox.Group options={serviceType} value={data} onChange={handleChange}/>
            </div>
        </div>
    )
}
