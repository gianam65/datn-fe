import { publicRoutes } from './routes/routes'
import DefaultLayout from './layouts/default-layout/default-layout'
import { Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Switch>
        {publicRoutes.map((route, index) => {
          const Layout = route.layout === null ? Fragment : DefaultLayout
          const Page = route.component

          return (
            <Route
              key={index}
              path={route.path}
              component={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          )
        })}
      </Switch>
    </Router>
  )
}

export default App
