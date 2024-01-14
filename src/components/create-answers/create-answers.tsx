import './create-answers.scss'
import React, { useState } from 'react'
import NumericInput from '../numeric-input/numeric-input'
import QuestionGenerators from '../question-generators/question-generators'
import { Button } from 'antd'
import * as ExcelJS from 'exceljs'
interface CreateAnswersProps {
  onSetSelectedAnswers: (answers: { [key: number]: string }) => void
}

type ExcelDataType = {
  question: number | undefined
  answers: string | undefined
}

const CreateAnswers: React.FC<CreateAnswersProps> = ({
  onSetSelectedAnswers,
}) => {
  const [numberQuestions, setNumberQuestions] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string
  }>({})

  const updateSelectedAnswers = (answers: { [key: number]: string }) => {
    setSelectedAnswers(answers)
    onSetSelectedAnswers(answers)
  }
  const readFileAsBuffer = (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as ArrayBuffer
        const uint8Array = new Uint8Array(result)
        resolve(uint8Array)
      }
      reader.onerror = (error) => {
        reject(error)
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const handleCreateAnswerWithFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const buffer = await readFileAsBuffer(file)
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(buffer.buffer)

        const worksheet = workbook.worksheets[0]

        const data: ExcelDataType[] = []
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber > 1) {
            const rowData = {
              question: (row.getCell(1).value as number) - 1,
              answers: row.getCell(2).value as string,
            }
            data.push(rowData)
          }
        })

        const formattedData: { [key: number]: string } = {}
        data.forEach((item) => {
          if (item.question !== undefined) {
            formattedData[item.question] = item.answers || ''
          }
        })

        updateSelectedAnswers(formattedData)
        setNumberQuestions(data.length)
      } catch (error) {
        console.log('error :>> ', error)
      }
    }
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
        <Button
          type="primary"
          className="import__excel-btn"
          onChange={handleCreateAnswerWithFile}
        >
          Nhập điểm bằng file excel
          <input type="file" accept=".xlsx, .xls" />
        </Button>
      </div>
      {numberQuestions !== 0 && (
        <div className="preview">
          <div className="preview__container">
            <div className="preview__title">Phiếu trả lời trắc nghiệm</div>
            <div className="preview__info">
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
