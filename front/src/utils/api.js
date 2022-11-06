import axios from 'axios'

const api = axios.create({
  baseURL:
    process.env.NODE_ENV == 'development'
      ? 'http://192.168.15.9:4000'
      : 'https://monopoly-machine.herokuapp.com',
})

export default api
