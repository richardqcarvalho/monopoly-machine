import axios from 'axios'

const api = axios.create({
  baseURL: 'https://monopoly-machine.herokuapp.com',
})

export default api
