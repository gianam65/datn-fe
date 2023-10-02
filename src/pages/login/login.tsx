import './login.scss'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import useRouter from '../../hooks/useRouter'
import { HOME_PAGE_LINK } from '../../constants/constants'

const Login = () => {
  const { pushRoute } = useRouter()
  const onFinish = (values: { username: string; password: string }) => {
    const { username, password } = values

    // Stimulate login case cause BE not ready
    if (username === 'admin' && password === 'password') {
      pushRoute(HOME_PAGE_LINK)
    }
  }

  return (
    <div className="login__container">
      <div className="login__box">
        <Form name="normal_login" className="login__form" onFinish={onFinish}>
          <Form.Item
            className="login__form-item"
            name="username"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên đăng nhập!',
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>
          <Form.Item
            className="login__form-item"
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login__button">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
