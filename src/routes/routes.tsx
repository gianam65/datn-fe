import Home from '../pages/home-page/home-page'
import MarkExam from '../pages/mark-exam/mark-exam'
import Login from '../pages/login/login'
import Reports from '../pages/reports/reports'
import config from '../config'
import ShowResults from '../components/show-results/show-results'
import AddDataPage from '../pages/add-data/add-data'
import React from 'react'

type RoutesType = {
  path: string
  component: React.FC
  layout?: boolean | null
  isLogin?: boolean
}

const publicRoutes: RoutesType[] = [
  { path: config.routes.home, component: Home },
  { path: config.routes.mark_exam, component: MarkExam },
  { path: config.routes.reports, component: Reports },
  { path: config.routes.login, component: Login, isLogin: true },
  { path: config.routes.result, component: ShowResults },
  { path: config.routes.add_data, component: AddDataPage },
]

const privateRoutes: RoutesType[] = []

export { publicRoutes, privateRoutes }
