import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import GlobalStyles from './components/global-styles/global-styles.tsx'
import Loading from './components/loading/loading.tsx'
import { RecoilRoot } from 'recoil'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    <GlobalStyles>
      <Loading />
      <App />
    </GlobalStyles>
  </RecoilRoot>,
)
