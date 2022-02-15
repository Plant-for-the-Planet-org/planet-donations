import getsessionId from "./getSessionId";
import axios from "axios";

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
      config.headers["X-SESSION-ID"] = sessionId;
    }
    // sets the content type to json
    config.headers["Content-Type"] = "application/json";
    config.headers["X-ACCEPT-VERSION"] = "1.2";

    return config;
  },
  (error) => {
    console.error("Error while setting up axios request interceptor,", error);
  }
);

// Add a response interceptor which checks for error code for all the requests
// TODO: handle 401 and 403 (logout or retry)
axiosInstance.interceptors.response.use(
  undefined,
  async (err) => {
    // checkErrorCode(err);
    return Promise.reject(err);
  },
  (error: any) => {
    console.error("Error while setting up axios response interceptor", error);
  }
);

interface RequestParams {
  url: string;
  token?: any;
  data?: any;
  setshowErrorCard: Function;
  shouldQueryParamAdd?: boolean;
  tenant?: string;
}
interface ExtendedRequestParams extends RequestParams {
  method?: string | undefined;
}

export const apiRequest = async (
  extendedRequestParams: ExtendedRequestParams
): Promise<any> => {
  const {
    method = "GET",
    url,
    data = undefined,
    token = false,
    setshowErrorCard,
    shouldQueryParamAdd = true,
    tenant,
  } = extendedRequestParams;

  try {
    //  sets the options which is passed to axios to make the request
    const options = {
      method,
      url,
    };

    // if the method is either POST, PUT or DELETE and data is present then adds data property to options
    if (
      (method === "POST" || method === "PUT" || method === "DELETE") &&
      data
    ) {
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
    if (typeof Storage !== "undefined" && shouldQueryParamAdd) {
      const locale = `${
        localStorage.getItem("language")
          ? localStorage.getItem("language")
          : "en"
      }`;
      options.params = {
        tenant: tenant,
        locale,
      };
    } else if (shouldQueryParamAdd) {
      options.params = { tenant: "ten_I9TW3ncG", locale: "en" };
    }

    // returns a promise with axios instance
    return new Promise((resolve, reject) => {
      axiosInstance(options)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          if (
            JSON.parse(JSON.stringify(err)).message !==
            "Request failed with status code 303"
          ) {
            setshowErrorCard(true);
          }
          reject(err);
        });
    });
  } catch (err) {
    console.error(
      `Error while making ${method} request, ${JSON.stringify({
        url,
        token,
        err,
      })}`
    );
  }
};
