import { useHistory } from 'react-router-dom'

const useRouter = (onSameRoute?: () => void) => {
  const history = useHistory()

  const isSameRoute = (url: string) => {
    return url && history.location.pathname === url
  }

  const pushLocation = (url: string) => {
    if (url) {
      window.location.href = url
    }
  }
  const pushBlank = (url: string) => {
    if (url) {
      window.open(url, '_blank')
    }
  }
  const pushRoute = (url: string, withParam: boolean = false) => {
    if (url) {
      const { hash, search } = history.location
      const searchHash = withParam ? `${search || ''}${hash || ''}` : ''
      history.push(`${url}${searchHash}`)
    }
  }

  const _isSameRoute = (url: string) => {
    const isSame = isSameRoute(url)
    isSame && onSameRoute && onSameRoute()
    return isSame
  }

  const pushSameRoute = (url: string) => {
    !_isSameRoute(url) && pushRoute(url)
  }

  const pushUrl = (link: { url: string; location: string; blank: boolean }) => {
    if (link) {
      const { url, location, blank } = link
      if (url) {
        if (location) return pushLocation(url)
        if (blank) return pushBlank(url)
        pushSameRoute(url)
      }
    }
  }

  return {
    pushLocation,
    pushBlank,
    pushRoute,
    pushSameRoute,
    pushUrl,
    isSameRoute,
  }
}

export default useRouter
