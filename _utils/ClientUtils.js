export const isClient = typeof window !== "undefined";

export const getSessionStorageItem = (key) => {
  if (isClient) {
    return sessionStorage.getItem(key);
  }
  return null;
};

export const setSessionStorageItem = (key, value) => {
  if (isClient) {
    sessionStorage.setItem(key, value);
  }
};

export const removeSessionStorageItem = (key) => {
  if (isClient) {
    sessionStorage.removeItem(key);
  }
};

export const removeLocalStorageItem = (key) => {
  if (isClient) {
    const value = localStorage.getItem(key);
    if (value) {
      localStorage.removeItem(key);
    }
  }
};

export const getLocalStorageItem = (key) => {
  if (isClient) {
    return localStorage.getItem(key);
  }
  return null;
};

export const setLocalStorageItem = (key, value) => {
  if (isClient) {
    localStorage.setItem(key, value);
  }
};

export const redirectToLocation = (url) => {
  if (isClient) {
    window.location.href = url;
  }
};

export const reloadCurrentPage = () => {
  if (isClient) {
    window.location.reload();
  }
};
