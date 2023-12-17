import './show-answers.scss'
import React, { useEffect, useState } from 'react'
import { httpGet } from '../../services/request'
import { loadingState } from '../../recoil/store/app'
import { useSetRecoilState } from 'recoil'
import { AnswersResponse } from '../../services/response'
import { Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { generateRandomId } from '../../utils/utils'

type ShowAnswersProps = {
  markedExam?: AnswersResponse[]
}

const columns: ColumnsType<AnswersResponse> = [
  {
    title: 'Số báo danh',
    dataIndex: 'sbd',
    key: 'sbd',
  },
  {
    title: 'Mã đề',
    dataIndex: 'md',
    key: 'md',
  },
  {
    title: 'Nhãn',
    dataIndex: 'need_re_mark',
    key: 'need_re_mark',
    render: (data) => (
      <Tag color={data ? 'red' : 'green'}>
        {data ? 'Cần chấm lại' : 'Hợp lệ'}
      </Tag>
    ),
  },
  {
    title: 'Điểm',
    dataIndex: 'score',
    key: 'score',
  },
]

const ShowAnswers: React.FC<ShowAnswersProps> = ({ markedExam = [] }) => {
  const [answers, setAnswers] = useState(markedExam)
  const setLoading = useSetRecoilState(loadingState)

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      const response = await httpGet('/get_answers')
      setAnswers(response?.answers)
      setLoading(false)
    }
    if (answers.length === 0) {
      getData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="show__answers-container">
      <Table
        columns={columns}
        dataSource={answers}
        rowKey={generateRandomId()}
      />
    </div>
  )
}

export default ShowAnswers
