import axios from 'axios';

const BASE_URL = 'https://pre-onboarding-7th-3-2-9-api.vercel.app/';

const AxiosRequest = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

AxiosRequest.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error.response);
  }
);
AxiosRequest.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error.response);
  }
);

export default AxiosRequest;
