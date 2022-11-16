import {Input, Select} from 'antd'
import {useState} from 'react'
import style from './FormTime.module.scss'
export default function FormTime(props) {
    const [legalDisable, setLegalDisable] = useState(props.legalType === '0')
    const [promisedDisable, setPromisedDisable] = useState(props.promisedType === '0')
    const [legalPeriod, setLegalPeriod] = useState(props.legalPeriod)
    const [legalType, setLegalType] = useState(props.legalType)
    const [promisedPeriod, setPromisedPeriod] = useState(props.promisedPeriod)
    const [promisedType, setPromisedType] = useState(props.promisedType)

    const selectOptions = [
        {
            value: '0',
            tag: '无'
        },
        {
            value: '1',
            tag: '个工作日'
        },
        {
            value: '2',
            tag: '个自然日'
        }
    ]

    const handleLegalTypeChange = (value) => {
        if (value === '0') {
            setLegalDisable(true)
        } else {
            setLegalDisable(false)
        }
        setLegalType(value)
        props.setLegalType(value)
    }

    const handlePromisedTypeChange = (value) => {
        if (value === '0') {
            setPromisedDisable(true)
        } else {
            setPromisedDisable(false)
        }
        setPromisedType(value)
        props.setPromisedType(value)
    }

    const handleLegalPeriodChange = (e) => {
        let value = e.target.value
        setLegalPeriod(value)
        props.setLegalPeriod(value)
    }

    const handlePromisedPeriodChange = (e) => {
        let value = e.target.value
        setPromisedPeriod(value)
        props.setPromisedPeriod(value)
    }

    return (
        <div className={style.form}>
            <div className={style.inputLabel}>
                {props.required === true && <span style={{color: 'red'}}>*</span>}
                <span className={style.formName}>{props.formName}：</span>
            </div>
            <div className={style.input}>
                <div className={style.timeItem}>
                    <span className={style.timeLabel}>法定办结时限：</span>
                    <Input disabled={legalDisable}
                              className={style.textArea}
                              placeholder='请输入正整数作为法定办结时限'
                              onChange={handleLegalPeriodChange}
                              value={legalPeriod}
                              autoSize={true}
                              maxLength={props.maxLength}
                              type={'number'}
                              min={0}
                              max={1024}
                    />
                    <Select className={style.select} defaultValue={legalType} onChange={handleLegalTypeChange}>
                        {
                            selectOptions.map((option) =>
                                <Option value={option.value} key={option.value}>{option.tag}</Option>)
                        }
                    </Select>
                </div>
                <div className={style.timeItem}>
                    <span className={style.timeLabel}>承诺办结时限：</span>
                    <Input disabled={promisedDisable}
                              className={style.textArea}
                              placeholder='请输入正整数作为承诺办结时限'
                              onChange={handlePromisedPeriodChange}
                              value={promisedPeriod}
                              autoSize={true}
                              maxLength={props.maxLength}
                              type={'number'}
                              min={0}
                              max={1024}
                    />
                    <Select className={style.select} defaultValue={promisedType} onChange={handlePromisedTypeChange}>
                        {
                            selectOptions.map((option) =>
                                <Option value={option.value} key={option.value}>{option.tag}</Option>)
                        }
                    </Select>
                </div>
            </div>
        </div>
    )
}
