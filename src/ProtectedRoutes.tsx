import { useRecoilValue } from 'recoil'
import { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { LOGIN_LINK } from './constants/constants'
import React from 'react'
import { isLoginState } from './recoil/store/app'

const ProtectedComponents = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const history = useHistory()
  const { pathname } = location
  const accessToken = useRecoilValue(isLoginState)

  useEffect(() => {
    if (accessToken) {
      if (pathname === LOGIN_LINK) {
        history.push('/')
      }
    } else {
      history.push(LOGIN_LINK)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, accessToken])

  return <>{children}</>
}

export default ProtectedComponents
