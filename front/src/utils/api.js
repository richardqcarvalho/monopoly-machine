import axios from 'axios'

const api = axios.create({
  baseURL: `http://localhost:${process.env.PORT || 4000}`,
})

export default api
