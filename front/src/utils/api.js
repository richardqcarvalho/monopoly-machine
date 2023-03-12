import axios from 'axios'
import { getURL } from '.'

const api = axios.create({
  baseURL: getURL(),
})

export default api
