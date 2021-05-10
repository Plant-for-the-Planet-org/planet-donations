import getsessionId from './getSessionId';
import axios from 'axios';

// creates and axios instance with base url
const axiosInstance = axios.create({
  baseURL: `${process.env.API_ENDPOINT}`,
});

// Add a request interceptor which adds the configuration in all the requests
axiosInstance.interceptors.request.use(
  async (config) => {
    // stores the session id present in AsyncStorage
    const sessionId = await getsessionId();

    // if there's session id then adds the same into the header
    if (sessionId) {
      config.headers['X-SESSION-ID'] = sessionId;
    }
    // sets the content type to json
    config.headers['Content-Type'] = 'application/json';

    config.headers['x-locale']= `${
      localStorage.getItem('locale')
        ? localStorage.getItem('locale')
        : 'en'
    }`

    config.headers['tenant-key']= `${
      localStorage.getItem('tenantkey')
        ? localStorage.getItem('tenantkey')
        : 'ten_I9TW3ncG'
    }`

    return config;
  },
  (error) => {
    console.error('Error while setting up axios request interceptor,', error);
  },
);

// Add a response interceptor which checks for error code for all the requests
axiosInstance.interceptors.response.use(
  undefined,
  async (err) => {
    // checkErrorCode(err);
    return Promise.reject(err);
  },
  (error: any) => {
    console.error('Error while setting up axios response interceptor', error);
  },
);

const request = async (url:string, method = 'GET', token:any = false, data:any = undefined) => {
  try {
    //  sets the options which is passed to axios to make the request
    const options = {
      method,
      url,
    };

    // if the method is either POST, PUT or DELETE and data is present then adds data property to options
    if ((method === 'POST' || method === 'PUT' || method === 'DELETE') && data) {
      options.data = data;
    }

    // if request needs to be authenticated the Authorization is added in headers.
    // if access token is not present then throws error for the same
    if (token) {
      // adds Authorization to headers in options
      options.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    // returns a promise with axios instance
    return new Promise((resolve, reject) => {
      axiosInstance(options)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  } catch (err) {
    console.error( 
      `Error while making ${method} request, ${JSON.stringify({
        url,
        token,
        err,
      })}`,
    );
  }
};

// calls the [request] function with [url]
export const getRequest = (url:string) => request(url);

// calls the [request] function with [url] and [token = true]
export const getAuthenticatedRequest = (url:string,token:any) => request(url, 'GET', token);

// calls the [request] function with [url], [data], [method = 'POST'] and [token = false]
export const postRequest = (url:string, data:any) => request(url, 'POST', false, data);

// calls the [request] function with [url], [data], [method = 'POST'] and [token = true]
export const postAuthenticatedRequest = (url:string,token:any, data:any) => request(url, 'POST', token, data);

// calls the [request] function with [url], [data], [method = 'PUT'] and [token = false]
export const putRequest = (url:string, data:any) => request(url, 'PUT', false, data);

// calls the [request] function with [url], [data], [method = 'PUT'] and [token = true]
export const putAuthenticatedRequest = (url:string,token:any, data:any) => request(url, 'PUT', token, data);

// calls the [request] function with [url], [data], [method = 'DELETE'] and [token = false]
export const deleteRequest = (url:string, data = null) => request(url, 'DELETE', false, data);

// calls the [request] function with [url], [data], [method = 'DELETE'] and [token = true]
export const deleteAuthenticatedRequest = (url:string,token:any, data = null) => request(url, 'DELETE', token, data);