import React from 'react'
import './global-styles.scss'

type GlobalStylesProps = {
  children: React.ReactNode
}

const GlobalStyles: React.FC<GlobalStylesProps> = ({ children }) => {
  return children
}

export default GlobalStyles
