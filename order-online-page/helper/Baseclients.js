"use client";
import axios from "axios";

import { getLocalStorageItem } from "../../_utils/ClientUtils";
// import jwt from ""

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

let userId = getLocalStorageItem("UserPersistent");


//Create a axios api instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    User: userId,
  },
  // withCredentials: true,
  timeout: 5 * 10000,
});

class BaseClient {
  // Get Method with optional headers and onProgress
  static async get(
    endpoint,
    payload,
    { onSuccess, onFailed, onProgress, headers }
  ) {
    try {
      const config = {
        headers: headers || {},
        params: payload,
        onDownloadProgress: (progressEvent) => {
          if (onProgress) {
            onProgress(progressEvent);
          }
        },
      };

      const data = await api.get(endpoint, config);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      if (onFailed) {
        onFailed(error);
      }
    }
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
  static async put(
    endpoint,
    payload,
    { onSuccess, onFailed, onProgress, headers }
  ) {
    await api
      .put(endpoint, payload, {
        headers: headers,
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            onProgress(progressEvent);
          }
        },
      })
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
