import { AxiosRequestConfig } from 'axios';
import request from '../request';

interface Params {
  // Define the properties of your 'params' object
  // Adjust these based on the actual structure of your params object
  // For example:
  // key: string;
  // value: string;
}

export default function fetchProjectOSS(params: Params): Promise<any> {
  const config: AxiosRequestConfig = {
    url: '/project/oss',
    params,
  };

  return request(config);
}
