import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh_token = localStorage.getItem('refresh_token')
      
      if (refresh_token) {
        const res = await axios.post('http://localhost:3000/auth/refresh', { refresh_token })
        localStorage.setItem('token', res.data.access_token)
        
        // retry original request
        error.config.headers.Authorization = `Bearer ${res.data.access_token}`
        return axios(error.config)
      }
    }
    return Promise.reject(error)
  }
)

export default api