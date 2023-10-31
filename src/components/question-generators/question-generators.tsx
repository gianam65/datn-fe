import React, { useMemo, useState } from 'react'
import RadioInput from '../radio-input/radio-input'
import './question-generators.scss'

interface QuestionGeneratorsProps {
  numberOfQuestions: number
  numberOfChoices: number
}

const QuestionGenerators: React.FC<QuestionGeneratorsProps> = ({
  numberOfQuestions,
  numberOfChoices,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number
  }>({})
  const provideQuestions = useMemo(() => {
    let questions: number[] = []

    for (let i = 0; i < numberOfQuestions; i++) {
      questions = [...questions, i + 1]
    }
    return questions
  }, [numberOfQuestions])

  const handleAnswersQuestion = (index: number, value: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [index]: value,
    }))
  }
  console.log('selectedAnswers :>> ', selectedAnswers)

  return (
    <div className="question__generator-container">
      {provideQuestions.map((pQ, idx) => (
        <div className="question" key={idx}>
          <span className="question__number">{pQ}.</span>
          <RadioInput
            className="question__choice"
            numberOfOptions={numberOfChoices}
            onRadioChange={(value: number) => handleAnswersQuestion(idx, value)}
          />
        </div>
      ))}
    </div>
  )
}

export default QuestionGenerators
