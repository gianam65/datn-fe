import React, { ReactNode, useState, useEffect } from 'react'
import {
  AppstoreOutlined,
  BarChartOutlined,
  FormOutlined,
  FileDoneOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu } from 'antd'
import './default-layout.scss'
import useRouter from '../../hooks/useRouter'
import {
  HOME_PAGE_LINK,
  MARK_EXAM_LINK,
  REPORT_LINK,
  RESULT_TEST,
} from '../../constants/constants'
import { useLocation } from 'react-router-dom'
const { Content, Sider } = Layout

// eslint-disable-next-line react-refresh/only-export-components
export const ITEMS = [
  {
    key: HOME_PAGE_LINK,
    icon: <AppstoreOutlined />,
    label: 'Trang chủ',
  },
  {
    key: MARK_EXAM_LINK,
    icon: <FormOutlined />,
    label: 'Chấm điểm',
  },
  {
    key: RESULT_TEST,
    icon: <FileDoneOutlined />,
    label: 'Kết quả chấm',
  },
  {
    key: REPORT_LINK,
    icon: <BarChartOutlined />,
    label: 'Thống kê',
  },
]

type DefaultLayoutProps = {
  children: ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const { pushRoute } = useRouter()
  const [selectedKey, setSelectedKey] = useState('')
  const location = useLocation()

  useEffect(() => {
    setSelectedKey(location.pathname)
  }, [location.pathname])

  const handleNavigate: MenuProps['onClick'] = ({ key, domEvent }) => {
    domEvent.preventDefault()
    pushRoute(key)
  }

  return (
    <Layout hasSider className="default__layout">
      <Sider className="side__menu-container" collapsed={true}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={ITEMS}
          onSelect={handleNavigate}
        />
      </Sider>
      <Layout className="main__content">
        <Content className="main__content-children">{children}</Content>
      </Layout>
    </Layout>
  )
}

export default DefaultLayout
