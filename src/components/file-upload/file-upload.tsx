import React, { useMemo, useState } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import './file-upload.scss'
import {
  PlusCircleOutlined,
  FileImageOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { Button } from 'antd'
import { loadingState } from '../../recoil/store/app'
import { useSetRecoilState } from 'recoil'
import { notification } from 'antd'
import { httpPost } from '../../services/request'
import { AnswersResponse } from '../../services/response'

interface FileUploadProps {
  answers: {
    [key: number]: string
  }
  onSetAnswers: (data: AnswersResponse[]) => void
  selectedClass: string
}

const acceptConfig = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
}

const FileUpload: React.FC<FileUploadProps> = ({
  answers,
  onSetAnswers,
  selectedClass,
}) => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])
  const setLoading = useSetRecoilState(loadingState)

  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    accept: acceptConfig,
    onDrop: (files) => setAcceptedFiles(files),
  })

  const handleDeselectFiles = (file: File) => {
    setAcceptedFiles((prevFiles) => prevFiles.filter((f) => f !== file))
  }

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
        <DeleteOutlined
          className="file__delete-icon"
          onClick={() => handleDeselectFiles(file)}
        />
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
    try {
      setLoading(true)
      const promises = acceptedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append('image', file)
        formData.append(
          'default_result',
          JSON.stringify(Object.values(answers)),
        )
        formData.append('classes', selectedClass)
        // formData.append('mark_by_camera', 'True')

        const data: AnswersResponse = await httpPost('/process_image', formData)
        return data
      })
      const response: AnswersResponse[] = await Promise.all(promises)
      if (response) {
        const isContainFaslyExam = response.findIndex(
          (r) => r.success === false,
        )
        if (isContainFaslyExam === -1) {
          onSetAnswers && onSetAnswers(response)
          notification.open({
            type: 'success',
            message: 'Đã chấm thành công các bài thi tải lên',
          })
        } else {
          notification.open({
            type: 'error',
            message: response[isContainFaslyExam].error_message,
          })
        }
      }
      setLoading(false)
    } catch (error) {
      notification.open({
        type: 'error',
        message: 'Có lỗi xảy ra, vui lòng thử lại sau',
      })
    } finally {
      setLoading(false)
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
    </section>
  )
}

export default FileUpload
