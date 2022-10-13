import {Input} from 'antd'
import style from './FormArea.module.scss'

const {TextArea} = Input

export default function FormArea(props) {
    return (
        <>
            <div className={style.form}>
                <div className={style.inputLabel}>
                    {props.required === true && <span style={{color: 'red'}}>*</span>}
                    <span style={{marginLeft: 5}}>{props.formName}：</span>
                </div>
                <div className={style.input}>
                    <TextArea onChange={props.handleChange}
                              placeholder={'请输入' + props.formName}
                              value={props.value}
                              autoSize={true}/>
                </div>
            </div>
        </>
    )
}
