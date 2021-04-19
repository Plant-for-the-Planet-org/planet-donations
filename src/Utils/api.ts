import getsessionId from './getSessionId';
import axios from 'axios';
import { getSession } from 'next-auth/client';


// export async function getRequest(){
//   try {
//     const response = await axios.get('https://your.site/api/v1/bla/ble/bli');
//     // Success 🎉
//     console.log(response);
// } catch (error) {
//     // Error 😨
//     if (error.response) {
//         /*
//          * The request was made and the server responded with a
//          * status code that falls out of the range of 2xx
//          */
//         console.log(error.response.data);
//         console.log(error.response.status);
//         console.log(error.response.headers);
//     } else if (error.request) {
//         /*
//          * The request was made but no response was received, `error.request`
//          * is an instance of XMLHttpRequest in the browser and an instance
//          * of http.ClientRequest in Node.js
//          */
//         console.log(error.request);
//     } else {
//         // Something happened in setting up the request and triggered an Error
//         console.log('Error', error.message);
//     }
//     console.log(error);
// }
// }


// creates and axios instance with base url
const axiosInstance = axios.create({
  baseURL: `${process.env.API_ENDPOINT}`,
});

// Add a request interceptor which adds the configuration in all the requests
axiosInstance.interceptors.request.use(
  async (config) => {
    // stores the session id present in AsyncStorage
    let sessionId = await getsessionId();

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

const request = async (url:string, method:string = 'GET', isAuthenticated:boolean = false, data:any = undefined) => {
  try {
    //  sets the options which is passed to axios to make the request
    let options = {
      method,
      url,
    };

    // if the method is either POST, PUT or DELETE and data is present then adds data property to options
    if ((method === 'POST' || method === 'PUT' || method === 'DELETE') && data) {
      options.data = data;
    }

    // if request needs to be authenticated the Authorization is added in headers.
    // if access token is not present then throws error for the same
    if (isAuthenticated) {
      const session = await getSession();
      const accessToken = session.accessToken;
      if (!accessToken) {
        throw new Error('Access token is not available.');
      }

      // adds Authorization to headers in options
      options.headers = {
        Authorization: `OAuth ${accessToken}`,
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
        isAuthenticated,
        err,
      })}`,
    );
  }
};

// calls the [request] function with [url]
export const getRequest = (url:string) => request(url);

// calls the [request] function with [url] and [isAuthenticated = true]
export const getAuthenticatedRequest = (url:string) => request(url, 'GET', true);

// calls the [request] function with [url], [data], [method = 'POST'] and [isAuthenticated = false]
export const postRequest = (url:string, data:any) => request(url, 'POST', false, data);

// calls the [request] function with [url], [data], [method = 'POST'] and [isAuthenticated = true]
export const postAuthenticatedRequest = (url:string, data:any) => request(url, 'POST', true, data);

// calls the [request] function with [url], [data], [method = 'PUT'] and [isAuthenticated = false]
export const putRequest = (url:string, data:any) => request(url, 'PUT', false, data);

// calls the [request] function with [url], [data], [method = 'PUT'] and [isAuthenticated = true]
export const putAuthenticatedRequest = (url:string, data:any) => request(url, 'PUT', true, data);

// calls the [request] function with [url], [data], [method = 'DELETE'] and [isAuthenticated = false]
export const deleteRequest = (url:string, data = null) => request(url, 'DELETE', false, data);

// calls the [request] function with [url], [data], [method = 'DELETE'] and [isAuthenticated = true]
export const deleteAuthenticatedRequest = (url:string, data = null) => request(url, 'DELETE', true, data);