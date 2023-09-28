import './default-layout.scss'
import React, { ReactNode } from 'react'

type DefaultLayoutProps = {
  children: ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <div className="default__layout">{children}</div>
}

export default DefaultLayout
