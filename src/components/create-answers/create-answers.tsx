import './create-answers.scss'
import React, { useState } from 'react'
import NumericInput from '../numeric-input/numeric-input'
import QuestionGenerators from '../question-generators/question-generators'

interface CreateAnswersProps {
  onSetSelectedAnswers: (answers: { [key: number]: string }) => void
}

const CreateAnswers: React.FC<CreateAnswersProps> = ({
  onSetSelectedAnswers,
}) => {
  const [numberQuestions, setNumberQuestions] = useState(0)
  const [numberChoices, setNumberChoices] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string
  }>({})

  const updateSelectedAnswers = (answers: { [key: number]: string }) => {
    setSelectedAnswers(answers)
    onSetSelectedAnswers(answers)
  }

  return (
    <div className="create__answers-container">
      <div className="create__answers-inps">
        <NumericInput
          value={numberQuestions}
          onChange={setNumberQuestions}
          placeholder="Nhập số câu hỏi"
          className="create__answers-input"
        />

        <NumericInput
          value={numberChoices}
          onChange={setNumberChoices}
          placeholder="Nhập số đáp án"
          className="create__answers-input"
          maxValueEnabled
        />
      </div>
      {numberQuestions !== 0 && numberChoices !== 0 && (
        <div className="preview">
          <div className="preview__container">
            <div className="preview__title">Phiếu trả lời trắc nghiệm</div>
            <div className="preview__info">
              <div className="info__title">Phần thông tin</div>
              <div className="grade"></div>
              <div className="info__detail">
                <span>1. Họ tên thí sinh:</span>
                <span className="dot"></span>
              </div>
              <div className="info__detail">
                <span>2. Ngày sinh:</span>
                <span className="dot"></span>
              </div>
              <div className="info__detail">
                <span>3. Lớp:</span>
                <span className="dot"></span>
              </div>
              <div className="info__detail">
                <span>4. Môn thi:</span>
                <span className="dot"></span>
              </div>
              <div className="info__detail">
                <span>5. Số báo danh:</span>
                <span className="dot"></span>
              </div>
              <div className="info__detail">
                <span>6. Mã đề thi:</span>
                <span className="dot"></span>
              </div>
            </div>
            <QuestionGenerators
              numberOfQuestions={numberQuestions}
              numberOfChoices={numberChoices}
              selectedAnswers={selectedAnswers}
              onSetSelectedAnswers={updateSelectedAnswers}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateAnswers
