import axios from 'axios'

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8000',
  baseURL: 'https://192.168.1.94:8000',
  httpsAgent: {
    rejectUnauthorized: false,
  },
})

const httpGet = async (url: string, params = {}) => {
  try {
    const response = await axiosInstance.get(url, { params })
    return response.data
  } catch (error) {
    console.error('GET Error:', error)
    throw error
  }
}

const httpPost = async (url: string, data = {}) => {
  try {
    const response = await axiosInstance.post(url, data)
    return response.data
  } catch (error) {
    console.error('POST Error:', error)
    throw error
  }
}

const httpPut = async (url: string, data = {}) => {
  try {
    const response = await axiosInstance.put(url, data)
    return response.data
  } catch (error) {
    console.error('PUT Error:', error)
    throw error
  }
}

const httpDelete = async (url: string) => {
  try {
    const response = await axiosInstance.delete(url)
    return response.data
  } catch (error) {
    console.error('DELETE Error:', error)
    throw error
  }
}

export { httpGet, httpPost, httpPut, httpDelete }
