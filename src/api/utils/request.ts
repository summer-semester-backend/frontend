import axios from 'axios';
import qs from 'qs';
const mockUrl = 'http://127.0.0.1:4523/m1/1374970-0-default';
const url = 'http://kurino.top/api';
const backend = axios.create({
  baseURL: url,
});

backend.interceptors.request.use((config) => {
  config.headers = {
    Authorization: localStorage.getItem('token') || '',
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  config.data = qs.stringify(config.data);
  return config;
});

export { backend };
