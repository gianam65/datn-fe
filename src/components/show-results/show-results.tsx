import './show-results.scss'
import { useEffect, useState } from 'react'
import { httpDelete, httpGet } from '../../services/request'
import { loadingState } from '../../recoil/store/app'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { LicensePlatesResponse } from '../../services/response'
import { Table, Button, Modal, notification } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import * as ExcelJS from 'exceljs'
import { DeleteOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import type { SearchProps } from 'antd/es/input/Search'
import { scannedPlateState } from '../../recoil/store/app'

const { Search } = Input

type Props = {
  licensePlates?: LicensePlatesResponse[]
}

const ShowResults = ({ licensePlates = [] }: Props) => {
  const [licensePlateList, setLicensePlateList] = useState<
    LicensePlatesResponse[]
  >([])
  const setLoading = useSetRecoilState(loadingState)
  const [detailResult, setDetailResult] = useState<LicensePlatesResponse>()
  const [searchValue, setSearchValue] = useState<string>('')
  const [scannedPlate, setScannedPlate] = useRecoilState(scannedPlateState)

  useEffect(() => {
    return () => {
      if (scannedPlate) {
        setScannedPlate('')
      }
    }
  }, [scannedPlate, setScannedPlate])

  const onSearch: SearchProps['onSearch'] = (value) => {
    const textSearch = value?.toLowerCase() || ''
    setSearchValue(textSearch)
  }

  const procedureDataSource = () => {
    if (!searchValue) return licensePlateList
    return licensePlateList.filter(
      (item) =>
        item.license_plate
          ?.toLocaleLowerCase()
          ?.indexOf(searchValue.toLowerCase()) >= 0,
    )
  }

  const columns: ColumnsType<LicensePlatesResponse> = [
    {
      title: 'STT',
      key: 'idx',
      render: (record, __, idx) => {
        return (
          <span className={record?.highlight ? 'highlight' : ''}>
            {idx + 1}
          </span>
        )
      },
    },
    {
      title: 'Biển số xe',
      key: 'license_plate',
      render: (record) => (
        <span className={record?.highlight ? 'highlight' : ''}>
          {record?.license_plate}
        </span>
      ),
    },
    {
      title: 'Ngày vào',
      dataIndex: 'check_in_time',
      key: 'check_in_time',
      render: (data) => {
        const date = new Date(data)

        const formattedDate = new Intl.DateTimeFormat('en-GB').format(date)
        return <span>{formattedDate}</span>
      },
    },
    {
      title: 'Ngày ra',
      dataIndex: 'check_out_time',
      key: 'check_out_time',
      render: (data) => {
        if (!data) return '--'
        const date = new Date(data)

        const formattedDate = new Intl.DateTimeFormat('en-GB').format(date)
        return <span>{formattedDate}</span>
      },
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
    {
      title: 'Hành động',
      render: (record) => {
        return (
          <div
            className="delete__icon"
            onClick={() => handleDeleteRecord(record)}
          >
            <DeleteOutlined />
          </div>
        )
      },
    },
  ]

  const getData = async () => {
    try {
      setLoading(true)
      const response = await httpGet('/records')
      setLicensePlateList(response || [])
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (licensePlates?.length === 0) {
      getData()
    } else {
      setLicensePlateList(licensePlates || [])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDeleteRecord = async (data: LicensePlatesResponse) => {
    try {
      setLoading(true)
      const response = await httpDelete(`/record/${data.id}`)
      setLoading(false)
      if (response?.message) {
        await getData()
        notification.success({ message: response.message || '' })
      } else {
        notification.error({ message: 'Có lỗi xảy ra, vui lòng thử lại sau!' })
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(`Sheet 1`)

    worksheet.columns = [
      { header: 'Biển số xe', key: 'carId', width: 20 },
      { header: 'Ngày vào', key: 'check_in_time', width: 10 },
      { header: 'Ngày ra', key: 'check_out_time', width: 10 },
    ]

    licensePlateList.forEach((row) => {
      worksheet.addRow({
        carId: row.id,
        check_in_time: row.check_in_time,
        check_out_time: row.check_out_time,
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
      <div className="show__answer_top">
        <Button type="primary" onClick={handleExportToExcel}>
          Xuất file excel
        </Button>
        <Search
          placeholder="Tìm kiếm"
          onSearch={onSearch}
          enterButton
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value?.toLowerCase())}
        />
      </div>
      <Table
        columns={columns}
        dataSource={procedureDataSource()}
        rowKey={(record) => record.id}
        scroll={{ y: 'calc(100vh - 280px)', x: 1000 }}
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
