import { Input } from 'antd'
import style from './FormArea.module.scss'
const { TextArea } = Input

export default function FormArea(props){
    return(
        <div className={style.form}>
            <div className={style.inputLabel}>
                <span style={{color: 'red'}}>*</span>
                <span style={{marginLeft: 5}}>{props.formName}：</span>
            </div>
            <TextArea className={style.textArea} onChange={props.handleChange} value={props.value} autoSize={true}/>
        </div>
    )
}