/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Select, notification } from 'antd'
import './add-data.scss'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Button, Upload } from 'antd'
import { useState } from 'react'
import { UploadChangeParam } from 'antd/lib/upload'
import { httpPost } from '../../services/request'
import { useSetRecoilState } from 'recoil'
import { loadingState } from '../../recoil/store/app'
import useRouter from '../../hooks/useRouter'

const { TextArea } = Input

const props: UploadProps = {
  name: 'file',
  maxCount: 1,
  progress: {
    strokeColor: {
      '0%': '#108ee9',
      '100%': '#87d068',
    },
    strokeWidth: 3,
    format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
  },
}

const AddDataPage = () => {
  const { pushRoute } = useRouter()
  const setLoading = useSetRecoilState(loadingState)
  const [imgUrl, setImgUrl] = useState('')
  const [formData, setFormData] = useState({
    tenXe: '',
    hangXe: '',
    bienSoXe: '',
    soKhung: '',
    soMay: '',
    trangThai: 'Có trong gara',
    anh: null,
  })

  const [formErrors, setFormErrors] = useState({
    tenXe: false,
    hangXe: false,
    bienSoXe: false,
    soKhung: false,
    soMay: false,
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement> | string,
    fieldName: string,
  ) => {
    setFormData({
      ...formData,
      [fieldName]: typeof e === 'string' ? e : e.target.value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      trangThai: value,
    })
  }

  const handleFileChange = async (info: UploadChangeParam) => {
    if (info.file.status === 'removed') {
      setImgUrl('')
      return
    }
    const formData = new FormData()
    formData.append('image', info.file?.originFileObj as any)

    try {
      setLoading(true)
      const response = await httpPost('/upload', formData)
      setLoading(false)
      handleInputChange(response?.image || '', 'anh')
      setImgUrl(response?.image || '')
    } catch (error) {
      notification.error({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau!' })
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors: { [key in keyof typeof formData]?: boolean } = {}
    let isValid = true

    for (const key in formData) {
      if (!formData[key as keyof typeof formData]) {
        errors[key as keyof typeof formData] = true
        isValid = false
      } else {
        errors[key as keyof typeof formData] = false
      }
    }

    setFormErrors(errors as any)
    return isValid
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true)
        const response = await httpPost('/record', formData)
        setLoading(false)
        if (!response?.id) {
          notification.error({ message: 'Có lỗi xảy ra, vui lòng thử lại sau' })
          return
        }
        setFormData({
          tenXe: '',
          hangXe: '',
          bienSoXe: '',
          soKhung: '',
          soMay: '',
          trangThai: 'Có trong gara',
          anh: null,
        })
        setImgUrl('')
        notification.success({ message: 'Thêm dữ liệu thành công!' })
        setTimeout(() => {
          pushRoute('/danh-sach-xe')
        }, 500)
      } catch (error) {
        notification.error({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau!' })
        setLoading(false)
      }
    } else {
      console.log('Vui lòng nhập đầy đủ thông tin')
    }
  }
  return (
    <div className="add__data-container">
      <div className="add__data-item">
        <span>Hãng xe</span>
        <TextArea
          placeholder="Vui lòng nhập thông tin"
          autoSize
          value={formData.hangXe}
          onChange={(e) => handleInputChange(e, 'hangXe')}
        />
        {formErrors.hangXe && (
          <span className="error-message">Vui lòng nhập thông tin</span>
        )}
      </div>

      <div className="add__data-item">
        <span>Tên xe</span>
        <TextArea
          placeholder="Vui lòng nhập thông tin"
          autoSize
          value={formData.tenXe}
          onChange={(e) => handleInputChange(e, 'tenXe')}
        />
        {formErrors.tenXe && (
          <span className="error-message">Vui lòng nhập thông tin</span>
        )}
      </div>

      <div className="add__data-item">
        <span>Biển số xe</span>
        <TextArea
          placeholder="Vui lòng nhập thông tin"
          autoSize
          value={formData.bienSoXe}
          onChange={(e) => handleInputChange(e, 'bienSoXe')}
        />
        {formErrors.bienSoXe && (
          <span className="error-message">Vui lòng nhập thông tin</span>
        )}
      </div>

      <div className="add__data-item">
        <span>Số khung</span>
        <TextArea
          placeholder="Vui lòng nhập thông tin"
          autoSize
          value={formData.soKhung}
          onChange={(e) => handleInputChange(e, 'soKhung')}
        />
        {formErrors.soKhung && (
          <span className="error-message">Vui lòng nhập thông tin</span>
        )}
      </div>

      <div className="add__data-item">
        <span>Số máy</span>
        <TextArea
          placeholder="Vui lòng nhập thông tin"
          autoSize
          value={formData.soMay}
          onChange={(e) => handleInputChange(e, 'soMay')}
        />
        {formErrors.soMay && (
          <span className="error-message">Vui lòng nhập thông tin</span>
        )}
      </div>

      <div className="add__data-item">
        <span>Trạng thái</span>
        <Select
          defaultValue={formData.trangThai}
          onChange={handleSelectChange}
          options={[
            { value: 'Có trong gara', label: 'Có trong gara' },
            { value: 'Không có ở gara', label: 'Không có ở gara' },
          ]}
        />
      </div>

      <div className="add__data-item">
        <span>Ảnh</span>
        <Upload {...props} onChange={handleFileChange}>
          <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
        </Upload>
        {imgUrl && (
          <img src={imgUrl} className="uploaded__img" alt="Uploaded Image" />
        )}
      </div>

      <div className="add__data-item">
        <Button type="primary" onClick={handleSubmit}>
          Thêm thông tin
        </Button>
      </div>
    </div>
  )
}

export default AddDataPage
