import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import style from './FormUser.module.scss'
import PrincipleModal from './PrincipleModal.js'

export default function FormUser(props){
    const [choosingPrinciple, setChoosingPrinciple] = useState(false)

    return(
        <>
            <PrincipleModal setPrinciple={props.setPrinciple} setPrincipleId={props.setPrincipleId} showError={props.showError}
                choosingPrinciple={choosingPrinciple} setChoosingPrinciple={setChoosingPrinciple} />
            <div className={style.form}>
                <div className={style.inputLabel}>
                    <span style={{color: 'red'}}>*</span>
                    <span style={{marginLeft: 5}}>{props.formName}：</span>
                </div>
                <div className={style.input}>
                    <div className={style.name}>{props.value}</div>
                    <Button type='primary' onClick={function(){
                        setChoosingPrinciple(true)
                    }}>选择负责人</Button>
                </div>
            </div>
        </>
    )
}