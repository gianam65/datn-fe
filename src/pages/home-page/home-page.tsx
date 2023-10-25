import './home-page.scss'
import React from 'react'
import { Card } from 'antd'
import { ITEMS } from '../../layouts/default-layout/default-layout'
import useRouter from '../../hooks/useRouter'

const HomePage: React.FC = () => {
  const { pushRoute } = useRouter()

  const handleRedirectToSelectedCard = (url: string) => {
    if (!url) return
    pushRoute(url)
  }

  return (
    <div className="home__page-container">
      {ITEMS.map((item) => (
        <Card
          key={item.key}
          className="home__page-item"
          onClick={() => handleRedirectToSelectedCard(item.key)}
        >
          <div className="card__icon">{item.icon}</div>
          <span className="card__title">{item.label}</span>
        </Card>
      ))}
    </div>
  )
}

export default HomePage
