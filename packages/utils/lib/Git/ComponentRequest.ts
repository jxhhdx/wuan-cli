import axios, { AxiosResponse } from 'axios';

interface Component {
}

interface ResponseData {
  code: number;
  data: any; // Adjust the type based on the actual structure of your data
}

export const createComponent = async function (component: Component): Promise<any | null> {
  try {
    const response: AxiosResponse<ResponseData> = await axios.post(
      'http://book.youbaobao.xyz:7002/api/v1/components',
      component
    );

    const { data } = response;

    if (data.code === 0) {
      return data.data;
    } else {
      return null;
    }
  } catch (e) {
    throw e;
  }
};
