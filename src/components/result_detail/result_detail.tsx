import React from 'react'
import './result_detail.scss'
import { AnswerType } from '../../services/response'

interface Block {
  id: number
  ans: string
  wrongIdx?: number[]
}

const Block: React.FC<{
  id: number
  ans: string | { answer_options: string[]; question_number: number }
  wrongIdx?: number[]
}> = ({ id, ans, wrongIdx }) => {
  const answer =
    ans && typeof ans !== 'string' ? ans.answer_options.join(' ') : ans
  return (
    <div
      key={id}
      className={`block block-${id}`}
      style={{
        color: wrongIdx
          ? wrongIdx.includes(id - 1)
            ? 'red'
            : 'green'
          : 'none',
      }}
    >
      {id}. {answer}
    </div>
  )
}

const Columns: React.FC<{ data: string[]; indices?: number[] }> = ({
  data,
  indices,
}) => {
  const dataSource = data && typeof data !== 'string' ? data : JSON.parse(data)
  const columns = Array.from({ length: 4 }, (_, columnIndex) =>
    dataSource
      .slice(columnIndex * 30, (columnIndex + 1) * 30)
      .map((value: string, blockIndex: number) => ({
        id: columnIndex * 30 + blockIndex + 1,
        ans: value,
      })),
  )

  return (
    <div className="columns-container">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className={`column column-${columnIndex + 1}`}>
          {column.map((block: Block) => (
            <>
              <Block
                key={block.id}
                id={block.id}
                ans={block.ans}
                wrongIdx={indices}
              />
              {block.id % 5 === 0 && <br />}
            </>
          ))}
        </div>
      ))}
    </div>
  )
}

const ResultDetail: React.FC<{ data: AnswerType | undefined }> = ({ data }) => {
  const formatDataBeforeRender = () => {
    if (!data) return { correct_answer: [], answers: [] }
    if (data.answers && !Array.isArray(data.answers)) {
      return {
        ...data,
        answers: Object.values(data.answers).map((d) =>
          Array.isArray(d) ? d.join(' ') : '',
        ),
        correct_answer: JSON.parse(data.correct_answer),
      }
    }
    return {
      ...data,
      answers: data.answers.map((d) => d.answer_options.join(' ')),
      correct_answer: JSON.parse(data.correct_answer),
    }
  }

  function findArrayDifference<T>(
    arr1: T[],
    arr2: T[],
  ): { difference: T[]; indices: number[] } {
    const difference: T[] = []
    const indices: number[] = []

    arr1.forEach((value, index) => {
      if (arr2[index] !== value) {
        difference.push(value)
        indices.push(index)
      }
    })

    return { difference, indices }
  }
  const { indices } = findArrayDifference(
    formatDataBeforeRender()?.answers,
    formatDataBeforeRender()?.correct_answer,
  )

  return (
    <div className="result__detail">
      <div className="result__img">
        <div className="ans__title">Ảnh đã tải lên</div>
        <img src={data?.image_url} alt="" />
      </div>
      <div className="answer__section">
        <div className="correct_answer">
          <span className="ans__title">Đáp án đúng</span>
          <Columns data={formatDataBeforeRender()?.correct_answer || []} />
        </div>
        <div className="selected__answer">
          <span className="ans__title">Đáp án đã chọn</span>
          <Columns
            data={formatDataBeforeRender()?.answers || []}
            indices={indices}
          />
        </div>
      </div>
    </div>
  )
}

export default ResultDetail
