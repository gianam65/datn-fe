import './mark-exam.scss'
import React, { useState, useMemo, useEffect } from 'react'
import { Button, Steps } from 'antd'
import {
  FileImageOutlined,
  FileDoneOutlined,
  ReadOutlined,
} from '@ant-design/icons'
import CreateAnswers from '../../components/create-answers/create-answers'
import FileUpload from '../../components/file-upload/file-upload'
import ShowAnswers from '../../components/show-answers/show-answers'
import { AnswersResponse } from '../../services/response'
import useRouter from '../../hooks/useRouter'
import { RESULT_TEST } from '../../constants/constants'
import PhotoShoot from '../../components/photo-shoot/photo-shoot'

const steps = [
  {
    title: 'Tạo đáp án',
    icon: <FileImageOutlined />,
    needNextBtn: true,
    needExtraBtn: true,
  },
  {
    title: 'Chấm điểm',
    icon: <FileDoneOutlined />,
    needNextBtn: false,
  },
  {
    title: 'Kết quả',
    icon: <ReadOutlined />,
    needNextBtn: false,
  },
]

const MarkExam: React.FC = () => {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<AnswersResponse[]>([])
  const [isMarkByCamera, setIsMarkByCamera] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string
  }>({})
  const [selectedClass, setSelectedClass] = useState<string>('')

  useEffect(() => {
    setAnswers([])
  }, [])
  const { pushRoute } = useRouter()

  const handleMarkDoneEx = (data: AnswersResponse[]) => {
    setAnswers(data)
    setCurrent((prev) => prev + 1)
  }

  const handleSetSelectedAnswers = (answers: { [key: number]: string }) => {
    setSelectedAnswers(answers)
  }

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
    setIsMarkByCamera(false)
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
        content = (
          <CreateAnswers
            onSetSelectedAnswers={handleSetSelectedAnswers}
            onSetSelectedClass={(e) => setSelectedClass(e.target.value)}
          />
        )
        break
      case 1:
        content = isMarkByCamera ? (
          <PhotoShoot
            answers={selectedAnswers}
            onSetAnswers={handleMarkDoneEx}
            selectedClass={selectedClass}
          />
        ) : (
          <FileUpload
            answers={selectedAnswers}
            onSetAnswers={handleMarkDoneEx}
            selectedClass={selectedClass}
          />
        )
        break
      case 2:
        content = <ShowAnswers markedExam={answers} />
        break
      default:
        content = (
          <CreateAnswers
            onSetSelectedAnswers={handleSetSelectedAnswers}
            onSetSelectedClass={(e) => setSelectedClass(e.target.value)}
          />
        )
    }

    return content
  }, [current, selectedAnswers, answers, isMarkByCamera, selectedClass])

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
              setIsMarkByCamera(false)
            }}
          >
            {current === 0 ? 'Chấm bằng hình ảnh' : 'Bước tiếp'}
          </Button>
        )}
        {current < steps.length - 1 && steps[current].needExtraBtn && (
          <Button
            onClick={() => {
              next()
              setIsMarkByCamera(true)
            }}
          >
            Chấm bằng camera
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => pushRoute(RESULT_TEST)}>
            Hoàn thành
          </Button>
        )}
      </div>
    </div>
  )
}

export default MarkExam
