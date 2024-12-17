import './mark-exam.scss'
import React, { useState, useMemo, useEffect } from 'react'
import { Button, Steps } from 'antd'
import { FileDoneOutlined, ReadOutlined } from '@ant-design/icons'
import FileUpload from '../../components/file-upload/file-upload'
import ShowAnswers from '../../components/show-results/show-results'
import { LicensePlatesResponse } from '../../services/response'
import useRouter from '../../hooks/useRouter'
import { SCAN_RESULT } from '../../constants/constants'

const steps = [
  {
    title: 'Quét biển số xe',
    icon: <FileDoneOutlined />,
    needNextBtn: false,
  },
  {
    title: 'Kết quả quét',
    icon: <ReadOutlined />,
    needNextBtn: false,
  },
]

const MarkExam: React.FC = () => {
  const [current, setCurrent] = useState(0)
  const [licensePlate, setLicensePlate] = useState<LicensePlatesResponse[]>([])

  useEffect(() => {
    setLicensePlate([])
  }, [])
  const { pushRoute } = useRouter()

  const handleScanLicense = (data: LicensePlatesResponse[]) => {
    setLicensePlate(data)
    setCurrent((prev) => prev + 1)
  }

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const items = useMemo(() => {
    return steps.map((item) => ({
      key: item.title,
      title: item.title,
      icon: item.icon,
    }))
  }, [])

  const renderContent = useMemo(() => {
    let content = null
    switch (current) {
      case 0:
        content = <FileUpload onSetData={handleScanLicense} />
        break
      case 1:
        content = <ShowAnswers licensePlates={licensePlate} />
        break
      default:
        content = <FileUpload onSetData={handleScanLicense} />
    }

    return content
  }, [current, licensePlate])

  return (
    <div className="mark__exam-container">
      <Steps size="small" current={current} items={items} />
      <div className="mark__exam-content">{renderContent}</div>
      <div className="mark__steps-box">
        {current > 0 && <Button onClick={() => prev()}>Quay lại</Button>}
        {current < steps.length - 1 && steps[current].needNextBtn && (
          <Button
            type="primary"
            onClick={() => {
              next()
            }}
          >
            {current === 0 && 'Bước tiếp'}
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => pushRoute(SCAN_RESULT)}>
            Hoàn thành
          </Button>
        )}
      </div>
    </div>
  )
}

export default MarkExam
