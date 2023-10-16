import './side-menu.scss'
import React from 'react'
import {
  BarChartOutlined,
  FormOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import {
  HOME_PAGE_LINK,
  MARK_EXAM_LINK,
  REPORT_LINK,
} from '../../constants/constants'
import useRouter from '../../hooks/useRouter'

const { Sider } = Layout

type SideMenuProps = {
  collapsed: boolean
}

const SideMenu: React.FC<SideMenuProps> = ({ collapsed }) => {
  const { pushRoute } = useRouter()
  const handleNavigate: MenuProps['onClick'] = ({ key }) => {
    pushRoute(key)
  }
  return (
    <div className="side__menu-container">
      <Sider
        className="side__menu-list"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={handleNavigate}
          items={[
            {
              key: HOME_PAGE_LINK,
              icon: <AppstoreOutlined />,
              label: 'Dash board',
            },
            {
              key: MARK_EXAM_LINK,
              icon: <FormOutlined />,
              label: 'Score the test',
            },
            {
              key: REPORT_LINK,
              icon: <BarChartOutlined />,
              label: 'Reports',
            },
          ]}
        />
      </Sider>
    </div>
  )
}

export default SideMenu
