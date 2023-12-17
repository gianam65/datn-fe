import { atom } from 'recoil'
import { STORE } from '../../constants/store'

export const loadingState = atom({
  key: STORE.APP.LOADING,
  default: false,
})

export const pageErrorMessageState = atom({
  key: STORE.APP.ERROR_MESSAGE,
  default: '',
})
