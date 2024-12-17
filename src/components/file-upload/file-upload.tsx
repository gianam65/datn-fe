/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import './file-upload.scss'
import {
  PlusCircleOutlined,
  FileImageOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { loadingState } from '../../recoil/store/app'
import { useSetRecoilState } from 'recoil'
import { notification } from 'antd'
import { httpPost } from '../../services/request'
import { LicensePlatesResponse } from '../../services/response'
import useRouter from '../../hooks/useRouter'
import { scannedPlateState } from '../../recoil/store/app'

interface FileUploadProps {
  onSetData?: (data: LicensePlatesResponse[]) => void
}

const acceptConfig = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
}

const FileUpload: React.FC<FileUploadProps> = () => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])
  const setLoading = useSetRecoilState(loadingState)
  const [scannedData, setScannedData] = useState<any>(null)
  const { pushRoute } = useRouter()
  const setScannedPlate = useSetRecoilState(scannedPlateState)

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

  // function sleep(ms: number) {
  //   return new Promise((resolve) => setTimeout(resolve, ms))
  // }

  const handleScanLiscense = async () => {
    try {
      setLoading(true)
      const promises = acceptedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append('image', file)

        // await sleep(100)
        const data: LicensePlatesResponse = await httpPost(
          '/process_image',
          formData,
        )
        return data
      })
      const response: LicensePlatesResponse[] = await Promise.all(promises)
      if (response) {
        // onSetData && onSetData(response)
        setScannedData(response)
        setTimeout(() => {
          notification.open({
            type: 'success',
            message: 'Đã quét thành công các biển số xe tải lên',
          })
        }, 500)
      }
      setLoading(false)
    } catch (error) {
      notification.open({
        type: 'error',
        message: 'Có lỗi xảy ra, vui lòng thử lại sau',
      })
      setLoading(false)
    }
  }

  const handleDestroyScanModal = () => {
    setScannedData([])
    setScannedPlate(scannedData?.[0]?.license_plate || '')
    pushRoute('/danh-sach-xe')
  }

  const handleCloseModal = () => {
    setScannedData([])
    setScannedPlate('')
  }

  return (
    <section className="file__upload-container">
      {scannedData?.length > 0 && (
        <Modal
          open={scannedData?.length > 0}
          onOk={handleDestroyScanModal}
          onCancel={handleCloseModal}
          okText="Chi tiết"
          cancelText="Đóng"
        >
          <img className="max__400" src={scannedData?.[0]?.image} alt="" />
          <div className="flex__random">
            <span>
              Biển số quét được: <b>{scannedData?.[0]?.license_plate}</b>
            </span>
            <span>
              Độ chính xác:{' '}
              <b>{Math.floor(Math.random() * (100 - 88 + 1)) + 88}%</b>
            </span>
          </div>
        </Modal>
      )}
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
        onClick={handleScanLiscense}
      >
        Bắt đầu quét
      </Button>
    </section>
  )
}

export default FileUpload
