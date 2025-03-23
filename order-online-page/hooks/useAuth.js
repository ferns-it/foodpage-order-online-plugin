"use client";
import { useState } from "react";
import BaseClient from "../helper/Baseclients";
import { APIEndpoints } from "../constants/APIEndpoints";

const useAuth = () => {
  const [authLoading, setAuthLoading] = useState(false);
  const [otpLoading, setOTPLaoding] = useState(false);
  const sentOTPtoUser = async (payload, { onSuccess, onFailed }) => {
    try {
      setOTPLaoding(true);
      setAuthLoading(true);
      await BaseClient.post(APIEndpoints.sendOTP, payload, {
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setAuthLoading(false);
      setOTPLaoding(false);
    }
  };
  const registerUser = async (payload, { onSuccess, onFailed }) => {
    try {
      setAuthLoading(true);
      await BaseClient.post(APIEndpoints.registerUser, payload, {
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setAuthLoading(false);
    }
  };
  const passwordResetMail = async (payload, { onSuccess, onFailed }) => {
    try {
      setAuthLoading(true);
      await BaseClient.post(APIEndpoints.passwordResetOTP, payload, {
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const userLogin = async (payload, { onSuccess, onFailed }) => {
    try {
      setAuthLoading(true);
      await BaseClient.post(APIEndpoints.userLogin, payload, {
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setAuthLoading(false);
    }
  };
  const confirmPassword = async (payload, { onSuccess, onFailed }) => {
    try {
      setAuthLoading(true);
      await BaseClient.post(APIEndpoints.resetPassword, payload, {
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setAuthLoading(false);
    }
  };
  const resetPassword = async (payload, { onSuccess, onFailed }) => {
    try {
      setAuthLoading(true);
      await BaseClient.post(APIEndpoints.resetPassword, payload, {
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const transferCartItem = async (
    payload,
    { headers, onSuccess, onFailed }
  ) => {
    try {
      setAuthLoading(true);

      await BaseClient.post(APIEndpoints.updateCartItem, payload, {
        headers: headers,
        onSuccess: onSuccess,
        onFailed: onFailed,
      });
    } finally {
      setAuthLoading(false);
    }
  };
  return {
    authLoading,
    sentOTPtoUser,
    otpLoading,
    userLogin,
    confirmPassword,
    registerUser,
    transferCartItem,
    passwordResetMail,
    resetPassword,
  };
};
export default useAuth;
