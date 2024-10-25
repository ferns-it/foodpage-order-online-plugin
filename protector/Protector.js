"use client";
import React, { useContext, useEffect } from "react";
import { useAuth } from "@/src/app/context/AuthContext";
import { useRouter } from "next/navigation";
import LoaderComp from "../order-online-page/components/LoaderComp";
import { getLocalStorageItem } from "@/src/app/_utils/ClientUtils";
import { AppContext } from "../order-online-page/context/index";
import { jwtDecode } from "jwt-decode";
import { removeLocalStorageItem } from "../_utils/ClientUtils";

const isTokenExpired = (jwtHeader) => {
  const { exp } = jwtHeader;

  const currentTime = Math.floor(Date.now() / 1000);

  return exp < currentTime;
};

const ProtectedRoute = ({ children }) => {
  const { validationLoading, setValidationLoading } = useAuth();

  const { isUserLogged, setIsUserLogged } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    const userToken = getLocalStorageItem("userToken");

    if (userToken) {
      const tokenData = jwtDecode(userToken, { header: true });

      const expiry = isTokenExpired(tokenData);

      if (expiry == true) {
        removeLocalStorageItem("userToken");
        router.push("/guest");
        return;
      }

      setValidationLoading(false);
    } else {
      setValidationLoading(false);
      router.push("/guest");
    }
  }, [isUserLogged, router]);

  if (validationLoading) {
    return <LoaderComp />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
