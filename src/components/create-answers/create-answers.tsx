import './create-answers.scss'
import React, { useState } from 'react'
import NumericInput from '../numeric-input/numeric-input'
import QuestionGenerators from '../question-generators/question-generators'

const CreateAnswers: React.FC = () => {
  const [numberQuestions, setNumberQuestions] = useState(0)
  const [numberChoices, setNumberChoices] = useState(0)

  console.log('numberQuestions :>> ', numberQuestions)

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
      <QuestionGenerators
        numberOfQuestions={numberQuestions}
        numberOfChoices={numberChoices}
      />
    </div>
  )
}

export default CreateAnswers
