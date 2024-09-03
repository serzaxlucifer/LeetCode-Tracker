import axios from 'axios';

export const axiosInstance = axios.create({
  withCredentials: true, // Include cookies in cross-origin requests
});

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method:`${method}`,
    url:`${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers: null,
    params: params ? params : null,
  })
}