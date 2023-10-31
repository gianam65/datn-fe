import React, { useMemo } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import './file-upload.scss'
import {
  PlusCircleOutlined,
  FileImageOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { Button } from 'antd'

interface FileUploadProps {}

const acceptConfig = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
}

const FileUpload: React.FC<FileUploadProps> = () => {
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
      >
        Bắt đầu chấm bài
      </Button>
    </section>
  )
}

export default FileUpload
