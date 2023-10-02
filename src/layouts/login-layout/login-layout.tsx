import './login-layout.scss'
import React from 'react'

type LoginLayoutProps = {
  children: React.ReactNode
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return <div className="login__layout-wrapper">{children}</div>
}

export default LoginLayout
