import './mark-exam.scss'
import React, { useState, useMemo } from 'react'
import { Button, message, Steps } from 'antd'
import {
  FileImageOutlined,
  FileDoneOutlined,
  ReadOutlined,
} from '@ant-design/icons'
import CreateAnswers from '../../components/create-answers/create-answers'
import FileUpload from '../../components/file-upload/file-upload'

const steps = [
  {
    title: 'Tạo đáp án',
    content: <CreateAnswers />,
    icon: <FileImageOutlined />,
    needNextBtn: true,
  },
  {
    title: 'Chấm điểm',
    content: <FileUpload />,
    icon: <FileDoneOutlined />,
    needNextBtn: false,
  },
  {
    title: 'Kết quả',
    content: 'Last-content',
    icon: <ReadOutlined />,
    needNextBtn: false,
  },
]

const MarkExam: React.FC = () => {
  const [current, setCurrent] = useState(0)

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

  return (
    <div className="mark__exam-container">
      <Steps size="small" current={current} items={items} />
      <div className="mark__exam-content">{steps[current].content}</div>
      <div className="mark__steps-box">
        {current > 0 && <Button onClick={() => prev()}>Quay lại</Button>}
        {current < steps.length - 1 && steps[current].needNextBtn && (
          <Button type="primary" onClick={() => next()}>
            Bước tiếp
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success('Hoàn thành chấm bài!')}
          >
            Hoàn thành
          </Button>
        )}
      </div>
    </div>
  )
}

export default MarkExam
