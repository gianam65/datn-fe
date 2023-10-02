import './default-layout.scss'
import React, { ReactNode, useState } from 'react'
import SideMenu from '../../components/side-menu/side-menu'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout, Button } from 'antd'

const { Header, Content } = Layout

type DefaultLayoutProps = {
  children: ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="default__layout">
      {/* <div className="container">
        <div className="side__menu">
          <SideMenu />
        </div>
        <div className="main__content">{children}</div>
      </div> */}
      <Layout className="container">
        <SideMenu collapsed={collapsed} />
        <Layout>
          <Header>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                background: '#FFF',
              }}
            />
          </Header>
          <Content className="main__content">{children}</Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default DefaultLayout
