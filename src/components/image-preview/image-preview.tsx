import React from 'react'
import './image-preview.scss'

interface ImagePreviewProps {
  dataUri: string
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ dataUri }) => {
  return (
    <div className="image__preview-container">
      <img src={dataUri} alt="" />
    </div>
  )
}

export default ImagePreview
