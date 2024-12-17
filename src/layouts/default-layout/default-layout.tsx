import React, { ReactNode, useState, useEffect } from 'react'
import {
  AppstoreOutlined,
  BarChartOutlined,
  ScanOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu } from 'antd'
import './default-layout.scss'
import useRouter from '../../hooks/useRouter'
import {
  HOME_PAGE_LINK,
  SCAN_CAR_LINK,
  REPORT_LINK,
  SCAN_RESULT,
  LOGOUT_LINK,
  HISTORY_LINK,
  // ADD_CAR_LINK,
} from '../../constants/constants'
import { useLocation } from 'react-router-dom'
import { isLoginState } from '../../recoil/store/app'
import { useSetRecoilState } from 'recoil'

const { Content, Sider } = Layout

// eslint-disable-next-line react-refresh/only-export-components
export const ITEMS = [
  {
    key: HOME_PAGE_LINK,
    icon: <AppstoreOutlined />,
    label: 'Trang chủ',
  },
  // {
  //   key: ADD_CAR_LINK,
  //   icon: <PlusCircleOutlined />,
  //   label: 'Thêm dữ liệu xe',
  // },
  {
    key: SCAN_CAR_LINK,
    icon: <ScanOutlined />,
    label: 'Quét biển số xe',
  },
  {
    key: SCAN_RESULT,
    icon: <FileDoneOutlined />,
    label: 'Biển số xe đã quét',
  },
  {
    key: HISTORY_LINK,
    icon: <HistoryOutlined />,
    label: 'Lịch sử quét',
  },
  {
    key: REPORT_LINK,
    icon: <BarChartOutlined />,
    label: 'Thống kê xe ở gara',
  },
  {
    key: LOGOUT_LINK,
    icon: <LogoutOutlined />,
    label: 'Đăng xuất',
  },
]

type DefaultLayoutProps = {
  children: ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const { pushRoute } = useRouter()
  const [selectedKey, setSelectedKey] = useState('')
  const location = useLocation()
  const setLogin = useSetRecoilState(isLoginState)

  useEffect(() => {
    setSelectedKey(location.pathname)
  }, [location.pathname])

  const handleNavigate: MenuProps['onClick'] = ({ key, domEvent }) => {
    domEvent.preventDefault()
    if (key === LOGOUT_LINK) {
      setLogin(false)
      return
    }
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
