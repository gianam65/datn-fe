import './reports.scss'
import React, { useState, useEffect } from 'react'
import { loadingState } from '../../recoil/store/app'
import { useSetRecoilState } from 'recoil'
import { httpGet } from '../../services/request'
import { AnswersResponse } from '../../services/response'
import { Chart } from 'react-chartjs-2'
import {
  BarElement,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineController,
  BarController,
  ChartOptions,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const options: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Biểu đồ điểm',
    },
  },
  elements: {
    bar: {
      backgroundColor: '#3498db',
      borderColor: '#2980b9',
      borderWidth: 1,
    },
  },
}

const Reports: React.FC = () => {
  const [dataChart, setDataChart] = useState<number[]>([])
  const setLoading = useSetRecoilState(loadingState)

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      const response: AnswersResponse = await httpGet('/get_answers')
      const scores: number[] = response.answers?.map((answer) => answer.score)
      setDataChart(scores)
      setLoading(false)
    }

    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chartData = {
    labels: dataChart.map((_, index) => (index + 1).toString()),
    datasets: [
      {
        label: 'Điểm',
        data: dataChart,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
      },
    ],
  }
  console.log('chartData :>> ', chartData)

  return (
    <div className="reports-container">
      <Chart type="bar" data={chartData} options={options} />
    </div>
  )
}

export default Reports
