import { publicRoutes } from './routes/routes'
import DefaultLayout from './layouts/default-layout/default-layout'
import LoginLayout from './layouts/login-layout/login-layout'
import { Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {
  return (
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
                  <Page />
                </Layout>
              )}
            />
          )
        })}
      </Switch>
    </Router>
  )
}

export default App
