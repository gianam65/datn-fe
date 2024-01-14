import React, { useMemo } from 'react'
import RadioInput from '../radio-input/radio-input'
import './question-generators.scss'

interface QuestionGeneratorsProps {
  numberOfQuestions: number
  selectedAnswers: { [key: number]: string }
  onSetSelectedAnswers: (answers: { [key: number]: string }) => void
}

const QuestionGenerators: React.FC<QuestionGeneratorsProps> = ({
  numberOfQuestions,
  selectedAnswers,
  onSetSelectedAnswers,
}) => {
  const provideQuestions = useMemo(() => {
    let questions: number[] = []

    for (let i = 0; i < numberOfQuestions; i++) {
      questions = [...questions, i + 1]
    }
    return questions
  }, [numberOfQuestions])

  const handleAnswersQuestion = (index: number, value: string) => {
    const updatedAnswers = { ...selectedAnswers, [index]: value }
    onSetSelectedAnswers(updatedAnswers)
  }

  return (
    <div className="question__generator-container">
      {provideQuestions.map((pQ, idx) => (
        <div className="question" key={idx}>
          <span className="question__number">{pQ}.</span>
          <RadioInput
            checkedValue={selectedAnswers[idx] || ''}
            className="question__choice"
            onRadioChange={(value: string) => handleAnswersQuestion(idx, value)}
          />
        </div>
      ))}
    </div>
  )
}

export default QuestionGenerators
