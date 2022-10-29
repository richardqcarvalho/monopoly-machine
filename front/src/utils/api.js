import axios from 'axios'

const api = axios.create({
  baseURL:
    process.env.NODE_ENV == 'development'
      ? 'http://10.0.0.175:4000'
      : 'https://monopoly-machine.herokuapp.com',
})

export default api
