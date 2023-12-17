import './photo-shoot.scss'
import Camera, { FACING_MODES } from 'react-html5-camera-photo'
import React, { useState } from 'react'
import 'react-html5-camera-photo/build/css/index.css'
import ImagePreview from '../image-preview/image-preview'
import { httpPost } from '../../services/request'
// import { loadingState } from '../../recoil/store/app'
// import { useSetRecoilState } from 'recoil'
import { AnswersResponse } from '../../services/response'

type FacingModeType = 'user' | 'environment'
const PhotoShoot: React.FC = () => {
  const [dataUri, setDataUri] = useState('')
  // const setLoading = useSetRecoilState(loadingState)
  const [facingMode, setFacingMode] = useState<FacingModeType>(
    FACING_MODES.USER,
  )

  const handleTakePhoto = async (dataUri: string) => {
    setDataUri(dataUri)
    // setLoading(true)
    const formData = new FormData()
    formData.append('image', dataUri)
    formData.append(
      'default_result',
      JSON.stringify(Object.values(['A', 'B', 'C', 'D'])),
    )

    const data: AnswersResponse = await httpPost('/process_image', formData)
    console.log('data :>> ', data)
    // setLoading(false)
  }
  const toggleCamera = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === FACING_MODES.USER
        ? FACING_MODES.ENVIRONMENT
        : FACING_MODES.USER,
    )
  }

  return dataUri ? (
    <ImagePreview dataUri={dataUri} />
  ) : (
    <>
      <Camera
        onTakePhotoAnimationDone={(dataUri) => handleTakePhoto(dataUri)}
        idealFacingMode={facingMode}
        // isMaxResolution
        // imageCompression={1}
      />
      <button onClick={toggleCamera}>Toggle Camera</button>
    </>
  )
}

export default PhotoShoot
