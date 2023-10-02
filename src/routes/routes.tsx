import Home from '../pages/home-page/home-page'
import MarkExam from '../pages/mark-exam/mark-exam'
import Login from '../pages/login/login'
import config from '../config'
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
  { path: config.routes.login, component: Login, isLogin: true },
]

const privateRoutes: RoutesType[] = []

export { publicRoutes, privateRoutes }
