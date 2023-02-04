import getsessionId from "./getSessionId";
import axios, { AxiosRequestConfig, Method } from "axios";
import { v4 as uuidv4 } from "uuid";
import { Dispatch, SetStateAction } from "react";

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

    // track donations requests
    if (!config.headers["Authorization"]) {
      if ((config.method == 'post' || config.method == 'put')
        && config.url?.includes('/app/donations')) {
        config.headers["TRACKING-ID"] = await hmacSha256Hex(
          process.env.TRACKING_KEY || '', JSON.stringify(config.data)
        );
      }
    }

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

async function hmacSha256Hex(trackingKey: string, message: string) {
  const enc = new TextEncoder("utf-8");
  const algorithm = { name: "HMAC", hash: "SHA-256" };
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(trackingKey),
    algorithm,
    false, ["sign", "verify"]
  );
  const hashBuffer = await crypto.subtle.sign(
    algorithm.name,
    key,
    enc.encode(message)
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer)); const hashHex = hashArray.map(
    b => b.toString(16).padStart(2, '0')
  ).join('');
  return hashHex;
}

interface RequestParams {
  url: string;
  token?: string | null;
  data?: Record<string, unknown>;
  setshowErrorCard: Dispatch<SetStateAction<boolean>>;
  shouldQueryParamAdd?: boolean;
  tenant?: string;
  headers?: { [k: string]: string }; // additional headers
  addIdempotencyKeyHeader?: boolean;
  locale?: string;
}
interface ExtendedRequestParams extends RequestParams {
  method?: Method | undefined;
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
    headers = {},
    addIdempotencyKeyHeader = false,
    locale,
  } = extendedRequestParams;

  try {
    //  sets the options which is passed to axios to make the request
    const options: AxiosRequestConfig = {
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

    // append all the additional headers to the request
    options.headers = {
      ...options.headers,
      ...(addIdempotencyKeyHeader && { "IDEMPOTENCY-KEY": uuidv4() }),
      ...headers,
    };

    if (typeof Storage !== "undefined" && shouldQueryParamAdd) {
      const l = locale
        ? locale
        : `${localStorage.getItem("language")
          ? localStorage.getItem("language")
          : "en"
        }`;
      options.params = {
        tenant: tenant,
        locale: l,
      };
    } else if (shouldQueryParamAdd) {
      options.params = {
        tenant: "ten_I9TW3ncG",
        locale: locale ? locale : "en",
      };
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
