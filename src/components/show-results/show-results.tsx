import './show-results.scss'
import { useEffect, useState } from 'react'
import { httpGet } from '../../services/request'
import { loadingState } from '../../recoil/store/app'
import { useSetRecoilState } from 'recoil'
import { LicensePlatesResponse } from '../../services/response'
import { Table, Tag, Button, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import * as ExcelJS from 'exceljs'

type Props = {
  licensePlates?: LicensePlatesResponse[]
}

const ShowResults = ({ licensePlates = [] }: Props) => {
  const [licensePlateList, setLicensePlateList] = useState<
    LicensePlatesResponse[]
  >([])
  const setLoading = useSetRecoilState(loadingState)
  const [detailResult, setDetailResult] = useState<LicensePlatesResponse>()

  const columns: ColumnsType<LicensePlatesResponse> = [
    {
      title: 'STT',
      key: 'idx',
      render: (_, __, idx) => {
        return <span>{idx + 1}</span>
      },
    },
    {
      title: 'Biển số xe',
      dataIndex: 'license_plate',
      key: 'license_plate',
    },
    {
      title: 'Số khung',
      dataIndex: 'frame_number',
      key: 'frame_number',
    },
    {
      title: 'Số máy',
      dataIndex: 'engine_number',
      key: 'engine_number',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (data) => (
        <Tag color={data ? 'green' : 'red'}>
          {data ? 'Có trong gara' : 'Không có ở gara'}
        </Tag>
      ),
    },
    {
      title: 'Ảnh',
      render: (record) => {
        return (
          <div
            className="detail_marked"
            onClick={() => setDetailResult(record)}
          >
            Xem chi tiết
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      const response = await httpGet('/records')
      setLicensePlateList(response || [])
      setLoading(false)
    }
    getData()

    if (licensePlates?.length === 0) {
      getData()
    } else {
      setLicensePlateList(licensePlates || [])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(`Sheet 1`)

    worksheet.columns = [
      { header: 'Biển số xe', key: 'carId', width: 20 },
      { header: 'Số khung', key: 'frameNumber', width: 10 },
      { header: 'Số máy', key: 'engineNumber', width: 10 },
      { header: 'Trạng thái', key: 'status', width: 20 },
    ]

    licensePlateList.forEach((row) => {
      worksheet.addRow({
        carId: row.id,
        frameNumber: row.frame_number,
        engineNumber: row.engine_number,
        status: row.status ? 'Đang ở gara' : 'Không ở gara',
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

    const filename = `xe_trong_gara${formattedDate}.xlsx`
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="show__answers-container">
      <Button type="primary" onClick={handleExportToExcel}>
        Xuất file excel
      </Button>
      <Table
        columns={columns}
        dataSource={licensePlateList}
        rowKey={(record) => record.id}
        scroll={{ y: 'calc(100vh - 280px)', x: 'max-content' }}
      />
      <Modal
        title="Chi tiết xe"
        open={!!detailResult}
        width={'calc(100vw - 300px)'}
        onCancel={() => setDetailResult(undefined)}
        onOk={() => setDetailResult(undefined)}
        cancelText="Đóng"
      >
        <img
          src={detailResult?.image_url}
          alt=""
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      </Modal>
    </div>
  )
}

export default ShowResults
