import React, { useMemo, useState } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import './file-upload.scss'
import {
  PlusCircleOutlined,
  FileImageOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { Button } from 'antd'
import axios from 'axios'

interface FileUploadProps {
  answers: {
    [key: number]: string
  }
}

const acceptConfig = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
}

const FileUpload: React.FC<FileUploadProps> = ({ answers }) => {
  const [imageSrc, setImageSrc] = useState<string>('')
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: acceptConfig,
    })

  const acceptedFileItems = useMemo(() => {
    return acceptedFiles.map((file) => (
      <div key={file.name} className="selected__file-item">
        <div className="file__item-info">
          <FileImageOutlined className="info__icon" />
          <div className="info__detail">
            <span className="infor__detail-name">{file.name}</span>
            <span className="infor__detail-size">{file.size} bytes</span>
          </div>
        </div>
        <DeleteOutlined className="file__delete-icon" />
      </div>
    ))
  }, [acceptedFiles])

  const fileRejectionItems = useMemo(() => {
    return fileRejections.map(({ file, errors }: FileRejection) => (
      <div key={file.name}>
        {file.name} - {file.size} bytes
        <ul>
          {errors.map((e) => (
            <li key={e.code}>{e.message}</li>
          ))}
        </ul>
      </div>
    ))
  }, [fileRejections])

  const handleMarkExams = async () => {
    const formData = new FormData()
    formData.append('image', acceptedFiles?.[0])
    console.log('answers :>> ', answers)
    formData.append('default_result', JSON.stringify(Object.values(answers)))

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/process_image',
        formData,
      )
      const imageData = response.data.processed_image

      setImageSrc(`data:image/jpeg;base64,${imageData}`)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <section className="file__upload-container">
      <div {...getRootProps({ className: 'dropzone file__upload-inp' })}>
        <input {...getInputProps()} />
        <div className="file__upload-icon">
          <PlusCircleOutlined />
        </div>
        <span>Kéo hoặc thả ảnh vào đây để tải lên</span>
        <span>(Chỉ chấp nhận ảnh có định dạng *.jpeg hoặc *.png)</span>
      </div>
      {acceptedFileItems.length > 0 && (
        <div className="seleted__files">{acceptedFileItems}</div>
      )}
      {fileRejectionItems.length > 0 && fileRejectionItems}
      <Button
        className="mark__exam-btn"
        type="primary"
        disabled={acceptedFileItems.length === 0}
        onClick={handleMarkExams}
      >
        Bắt đầu chấm bài
      </Button>
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Processed Image"
          style={{ width: '100%', objectFit: 'cover' }}
        />
      )}
    </section>
  )
}

export default FileUpload
