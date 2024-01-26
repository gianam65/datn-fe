import './show-answers.scss'
import React, { useEffect, useState } from 'react'
import { httpGet } from '../../services/request'
import { loadingState } from '../../recoil/store/app'
import { useSetRecoilState } from 'recoil'
import { AnswersResponse, AnswerType } from '../../services/response'
import { Table, Tag, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import * as ExcelJS from 'exceljs'

type ShowAnswersProps = {
  markedExam?: AnswersResponse[]
}

const columns: ColumnsType<AnswerType> = [
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

const ShowAnswers: React.FC<ShowAnswersProps> = ({ markedExam }) => {
  const [answers, setAnswers] = useState<AnswerType[]>([])
  const setLoading = useSetRecoilState(loadingState)

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      const response = await httpGet('/get_answers')
      setAnswers(response?.answers || [])
      setLoading(false)
    }
    // if (answers.length === 0) {
    //   getData()
    // }
    if (answers.length === 0 && !markedExam) {
      getData()
    } else if (markedExam) {
      setAnswers(markedExam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(`Sheet 1`)

    worksheet.columns = [
      { header: 'Số báo danh', key: 'sbd', width: 20 },
      { header: 'Mã đề', key: 'md', width: 10 },
      { header: 'Nhãn', key: 'need_re_mark', width: 20 },
      { header: 'Điểm', key: 'score', width: 20 },
    ]

    answers.forEach((row) => {
      worksheet.addRow({
        md: row.md,
        sbd: row.sbd,
        score: row.score,
        need_re_mark: row.need_re_mark ? 'Cần chấm lại' : 'Hợp lệ',
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = URL.createObjectURL(blob)

    const today = new Date()
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }

    const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(
      today,
    )

    const filename = `ket_qua_thi_${formattedDate}.xlsx`
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const mapAnswersBeforeRender = (answers: AnswerType[]) => {
    return answers
      .map((an) => ({
        ...an,
        md: an.md ? an.md : '001',
        sbd: an.sbd ? an.sbd : '111111',
      }))
      .reverse()
  }

  return (
    <div className="show__answers-container">
      <Button type="primary" onClick={handleExportToExcel}>
        Xuất file excel
      </Button>
      <Table
        columns={columns}
        dataSource={mapAnswersBeforeRender(answers)}
        rowKey={(record) => record.id}
        scroll={{ y: 'calc(100vh - 250px)', x: 'max-content' }}
      />
    </div>
  )
}

export default ShowAnswers
