import { Input, Image, Modal } from 'antd'
import { useState } from 'react'
import api from '../../../../../../api/rule'
import style from './FormImage.module.scss'

export default function FormImage(props){
    const [data, setData] = useState(props.value === '' ? '' : (api.GetServerIP() === '/api' ? 'http://localhost:5001' : api.GetServerIP()) + props.value)
    const pattern = /^image/

    // 二维码图片处理
    const getBase64 = (img, callback)=>{
        const reader = new FileReader()
        reader.addEventListener('load', ()=>callback(reader.result))
        reader.readAsDataURL(img)
    }

    const handleChange = (e)=>{
        if (e.target.files.length === 0) return
        if (!pattern.test(e.target.files[0].type)){
            Modal.warning({
                title: '文件类型错误',
                content: '上传的文件类型错误，请上传二维码图片！',
                centered: true
            })
            return
        }
        else if (e.target.files[0].size >= (2 * 1024 * 1024)){
            Modal.warning({
                title: '图片过大',
                content: '上传的图片大小不能超过2M！',
                centered: true
            })
            return
        }
        else{
            getBase64(e.target.files[0], imageUrl=>{
                setData(imageUrl)
                props.setData(imageUrl)
            })
        } 
    }

    return(
        <div className={style.form}>
            <div className={style.inputLabel}>
                <span style={{color: 'red'}}>*</span>
                <span style={{marginLeft: 5}}>{props.formName}：</span>
            </div>
            <div className={style.input}>
                <input type='file' alt='二维码' name='QRCode' onChange={handleChange}/>
                {
                    data !== '' && pattern.test(data.type) &&
                    <img className={style.imgContainer} style={{display: data === '' ? 'none' : 'block'}} src={data} />
                }
                {
                    data !== '' && !pattern.test(data.type) &&
                    <img className={style.imgContainer} style={{display: data === '' ? 'none' : 'block'}} src={data} />
                }
                <span className={style.icon} style={{display: data === '' ? 'block' : 'none'}}>上传图片</span>
            </div>
        </div>
    )
}