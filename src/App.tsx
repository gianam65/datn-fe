import { publicRoutes } from './routes/routes'
import DefaultLayout from './layouts/default-layout/default-layout'
import LoginLayout from './layouts/login-layout/login-layout'
import { Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import ProtectedComponents from './ProtectedRoutes'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0984e3',
        },
      }}
    >
      <Router>
        <Switch>
          {publicRoutes.map((route, index) => {
            const Layout =
              route.layout === null
                ? Fragment
                : route.isLogin
                  ? LoginLayout
                  : DefaultLayout
            const Page = route.component
            return (
              <Route
                key={index}
                path={route.path}
                exact
                render={() => (
                  <Layout>
                    <ProtectedComponents>
                      <Page />
                    </ProtectedComponents>
                  </Layout>
                )}
              />
            )
          })}
        </Switch>
      </Router>
    </ConfigProvider>
  )
}

export default App
