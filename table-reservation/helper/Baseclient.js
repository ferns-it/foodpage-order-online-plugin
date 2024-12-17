"use client";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getUserId = () => {
  let storedUserId;
  if (typeof window !== "undefined") {
    storedUserId = window.localStorage.getItem("UserPersistent");
  } else {
    storedUserId = null;
  }
  return storedUserId;
};

let userId = getUserId();

//Create a axios api instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    User: userId,
  },
  // withCredentials: true,
  timeout: 10000,
});

//Interceptor for handle the response
// api.interceptors.response.use(
//   function (response) {
//     let errorResponse = { message: "Someting Went Wrong", error: true };
//     if (
//       response.data != null &&
//       response.data.error != null &&
//       response.data.error === false
//     ) {
//       return response.data;
//     }

//     return Promise.reject(errorResponse);
//   },
//   function (res) {
//     let errorResponse = { message: "Someting Went Wrong", error: true };
//     if (res != null && res.response != null && res.response.data != null) {
//       errorResponse = res.response.data;
//     }
//     return Promise.reject(errorResponse);
//   }
// );

class BaseClient {
  //Get Method
  static async get(endpoint, payload, { onSuccess, onFailed }) {
    await api
      .get(endpoint, payload)
      .then((data) => onSuccess && onSuccess(data))
      .catch((error) => onFailed && onFailed(error));
  }

  //Post Method
  static async post(
    endpoint,
    payload,
    { onSuccess, onFailed, onProgress, headers }
  ) {
    if (headers != null && Object.keys(headers).length != 0) {
      await api
        .post(endpoint, payload, {
          headers: headers,
          onUploadProgress: (progressEvent) => {
            if (onProgress) {
              onProgress(progressEvent);
            }
          },
        })
        .then((data) => onSuccess && onSuccess(data))
        .catch((error) => onFailed && onFailed(error));
      return;
    }

    await api
      .post(endpoint, payload, {
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            onProgress(progressEvent);
          }
        },
      })
      .then((data) => onSuccess && onSuccess(data))
      .catch((error) => onFailed && onFailed(error));
  }

  //Put Method
  static async put(endpoint, payload, { onSuccess, onFailed }) {
    await api
      .put(endpoint, payload)
      .then((data) => onSuccess && onSuccess(data))
      .catch((error) => onFailed && onFailed(error));
  }

  //Delete Method
  static async delete(endpoint, { onSuccess, onFailed, headers, onProgress }) {
    try {
      const response = await api.delete(endpoint, {
        headers: headers || {},
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            onProgress(progressEvent);
          }
        },
      });
      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      if (onFailed) onFailed(error);
    }
  }
}

export default BaseClient;
