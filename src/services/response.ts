export type AnswersResponse = {
  answers: {
    answers: {
      answer_options: string[]
      question_number: number
    }[]
    id: number
    md: string
    need_re_mark: boolean
    sbd: string
    score: number
  }[]
}

export type AnswerType = {
  answers: {
    answer_options: string[]
    question_number: number
  }[]
  id: number
  md: string
  need_re_mark: boolean
  sbd: string
  score: number
}
