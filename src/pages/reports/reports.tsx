import './reports.scss'
import React, { useState, useEffect } from 'react'
import { loadingState } from '../../recoil/store/app'
import { useSetRecoilState } from 'recoil'
// import { httpGet } from '../../services/request'
import { Chart } from 'react-chartjs-2'
import { CarType } from '../../services/response'
import {
  BarElement,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)
ChartJS.register(ArcElement, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Biểu đồ thống kê xe vào, xe ra',
    },
  },
}

const FAKE_CARS: CarType[] = [...Array(20)].map(() => ({
  carId: Math.ceil(Math.random() * 99999) + '',
  frameNumber: Math.ceil(Math.random() * 10e8) + '',
  engineNumber: Math.ceil(Math.random() * 10e8) + '',
  status: [false, true]?.[Math.floor(Math.random() * 2)],
}))

const Reports: React.FC = () => {
  const [dataChart, setDataChart] = useState<number[]>([])
  const setLoading = useSetRecoilState(loadingState)

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      // const response = await httpGet('/get_cars')
      // const cars = response.data as CarType[]
      const cars = FAKE_CARS

      // Transform data to count cars by status
      const statusCounts = cars.reduce(
        (acc, car) => {
          if (car.status) {
            acc[0] += 1
          } else {
            acc[1] += 1
          }
          return acc
        },
        [0, 0], // [true count, false count]
      )

      setDataChart(statusCounts)
      setLoading(false)
    }

    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chartData = {
    labels: ['Xe vào', 'Xe ra'],
    datasets: [
      {
        label: '',
        data: dataChart,
        backgroundColor: ['#2ecc71', '#e74c3c'],
        borderColor: ['#2980b9', '#c0392b'],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="reports-container">
      <div className="reports_item">
        <Chart type="pie" data={chartData} options={options} />
      </div>
      <div className="reports_item">
        <Chart type="bar" data={chartData} options={options} />
      </div>
    </div>
  )
}

export default Reports
