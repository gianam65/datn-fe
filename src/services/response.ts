export type LicensePlatesResponse = {
  engine_number: string
  frame_number: string
  image_url?: string
  license_plate: string
  status: string
  id: number
  car_name: string
  car_comp: string
  check_in_time: string
  check_out_time: string
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
  correct_answer: string
  image_url?: string
  classes?: string
}

export type CarType = {
  carId: string
  frameNumber: string
  status: boolean | string
  engineNumber: string
  imageUrl?: string
}
