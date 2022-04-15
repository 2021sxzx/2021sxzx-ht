import { Input, Image } from 'antd'
import { useState } from 'react'
import style from './FormImage.module.scss'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
const { TextArea } = Input

export default function FormImage(props){
    const [QRCodeLoading, setQRCodeLoading] = useState(false)
    const [data, setData] = useState(props.value)
    const [path, setPath] = useState('')

    // 二维码图片处理
    const getBase64 = (img, callback)=>{
        const reader = new FileReader()
        reader.addEventListener('load', ()=>callback(reader.result))
        reader.readAsDataURL(img)
    }

    const handleChange = (e)=>{
        getBase64(e.target.files[0], imageUrl=>{
            setData(imageUrl)
            props.setData(imageUrl)
            setPath(e.target.value)
            setQRCodeLoading(false)
        })
    }

    const uploadButton = (
        <div>
            {QRCodeLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    )

    return(
        <div className={style.form}>
            <div className={style.inputLabel}>
                <span style={{color: 'red'}}>*</span>
                <span style={{marginLeft: 5}}>{props.formName}：</span>
            </div>
            <div className={style.input}>
                <input type='file' alt='二维码' name='QRCode' onChange={handleChange}/>
                <img className={style.imgContainer} style={{display: path === '' ? 'none' : 'block'}} url={path} />
                <span className={style.icon} style={{display: path === '' ? 'block' : 'none'}}>上传图片</span>
            </div>
        </div>
    )
}