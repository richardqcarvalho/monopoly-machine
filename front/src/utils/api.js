import axios from 'axios'

const api = axios.create({
  baseURL:
    process.env.NODE_ENV == 'development'
      ? 'http://localhost:4000'
      : 'https://monopoly-machine.herokuapp.com',
})

export default api
