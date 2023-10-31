import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import GlobalStyles from './components/global-styles/global-styles.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GlobalStyles>
    <App />
  </GlobalStyles>,
)
