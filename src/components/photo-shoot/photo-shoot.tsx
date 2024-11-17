import './photo-shoot.scss'
import Camera, { FACING_MODES } from 'react-html5-camera-photo'
import React, { useState } from 'react'
import 'react-html5-camera-photo/build/css/index.css'
import ImagePreview from '../image-preview/image-preview'
import { httpPost } from '../../services/request'
import { loadingState } from '../../recoil/store/app'
import { useSetRecoilState } from 'recoil'
import { LicensePlatesResponse } from '../../services/response'
import { notification } from 'antd'
import { Button } from 'antd'

type FacingModeType = 'user' | 'environment'
type PhotoShootProps = {
  answers: {
    [key: number]: string
  }
  onSetAnswers: (data: LicensePlatesResponse[]) => void
  selectedClass: string
}

const PhotoShoot: React.FC<PhotoShootProps> = ({
  answers,
  onSetAnswers,
  selectedClass,
}) => {
  const [dataUri, setDataUri] = useState('')
  const setLoading = useSetRecoilState(loadingState)
  const [facingMode, setFacingMode] = useState<FacingModeType>(
    FACING_MODES.USER,
  )

  const handleTakePhoto = async (dataUri: string) => {
    setDataUri(dataUri)
    setLoading(true)
    const formData = new FormData()
    const base64String = dataUri.split(',')[1]
    const uint8Array = new Uint8Array(
      atob(base64String)
        .split('')
        .map((char) => char.charCodeAt(0)),
    )
    const blob = new Blob([uint8Array], { type: 'image/jpeg' })
    formData.append('image', blob)
    formData.append('default_result', JSON.stringify(Object.values(answers)))
    formData.append('mark_by_camera', 'true')
    formData.append('classes', selectedClass)

    try {
      const data: LicensePlatesResponse = await httpPost(
        '/process_image',
        formData,
      )
      setLoading(false)
      if (data.success === false) {
        notification.open({
          type: 'error',
          message: data.error_message,
        })
        return
      }
      onSetAnswers && onSetAnswers([data])
      notification.open({
        type: 'success',
        message: 'Đã chấm thành công các bài thi tải lên',
      })
    } catch (error) {
      console.log('error :>> ', error)
      setLoading(false)
    }
  }
  const toggleCamera = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === FACING_MODES.USER
        ? FACING_MODES.ENVIRONMENT
        : FACING_MODES.USER,
    )
  }

  return (
    <div className="photo__shoot-container">
      {dataUri ? (
        <ImagePreview dataUri={dataUri} />
      ) : (
        <>
          <Camera
            onTakePhotoAnimationDone={(dataUri) => handleTakePhoto(dataUri)}
            idealFacingMode={facingMode}
            // isMaxResolution
            // imageCompression={1}
          />
          <Button type="primary" onClick={toggleCamera}>
            Xoay ngược camera
          </Button>
        </>
      )}
    </div>
  )
}

export default PhotoShoot
