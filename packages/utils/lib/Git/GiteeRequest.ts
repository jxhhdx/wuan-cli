import axios, { AxiosInstance, AxiosResponse } from 'axios';

const BASE_URL = 'https://gitee.com/api/v5';

class GithubRequest {
  private token: string;
  private service: AxiosInstance;

  constructor(token: string) {
    this.token = token;
    this.service = axios.create({
      baseURL: BASE_URL,
      timeout: 5000,
    });
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      (error) => {
        if (error.response && error.response.data) {
          return error.response;
        } else {
          return Promise.reject(error);
        }
      },
    );
  }

  get(url: string, params?: any, headers?: any) {
    return this.service({
      url,
      params: {
        ...params,
        access_token: this.token,
      },
      method: 'get',
      headers,
    });
  }

  post(url: string, data?: any, headers?: any) {
    return this.service({
      url,
      params: {
        access_token: this.token,
      },
      data,
      method: 'post',
      headers,
    });
  }
}

export = GithubRequest;
