import axios from 'axios';
import qs from 'qs';
const backend = axios.create({
  baseURL: 'http://kurino.top',
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
