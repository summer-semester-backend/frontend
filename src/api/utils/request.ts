import axios from 'axios';
const mockUrl = 'http://127.0.0.1:4523/m1/1374970-0-default';
const url = 'http://43.138.77.8:8000/api/';
const wsurl = 'http://43.138.77.8:8001/';
const backend = axios.create({
  baseURL: url,
});

backend.interceptors.request.use((config) => {
  config.headers = {
    Authorization: localStorage.getItem('token') || '',
    'Content-Type': 'application/json',
  };
  return config;
});

export { backend, wsurl };
