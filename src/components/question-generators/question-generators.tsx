import React, { useMemo } from 'react'
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
  const provideQuestions = useMemo(() => {
    let questions: number[] = []

    for (let i = 0; i < numberOfQuestions; i++) {
      questions = [...questions, i + 1]
    }
    return questions
  }, [numberOfQuestions])

  return (
    <div className="question__generator-container">
      {provideQuestions.map((pQ) => (
        <div className="question">
          <span className="question__number">{pQ}</span>{' '}
          <RadioInput
            className="question__choice"
            numberOfOptions={numberOfChoices}
          />
        </div>
      ))}
    </div>
  )
}

export default QuestionGenerators
