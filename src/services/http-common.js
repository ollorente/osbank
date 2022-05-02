// @ts-check
import axios from 'axios'

const token = 'Bearer ' + localStorage.getItem('token') // eslint-disable-line

export default axios.create({
  baseURL: '/.netlify/functions',
  headers: {
    'Content-type': 'application/json',
    Authorization: token
  }
})
