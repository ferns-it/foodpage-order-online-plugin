"use client";
import React, { useContext, useEffect } from "react";
// import { useRouter } from "next/navigation";
import LoaderComp from "../order-online-page/components/LoaderComp";
import { getLocalStorageItem } from "../_utils/ClientUtils";
import { AppContext } from "../order-online-page/context/index";
import { useAuth } from "../guest-login/context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { validationLoading, setValidationLoading } = useAuth();

  const { isUserLogged, setIsUserLogged } = useContext(AppContext);
  // const router = useRouter();

  useEffect(() => {
    const userToken = getLocalStorageItem("userToken");

    if (userToken) {
      setValidationLoading(false);
    } else {
      setValidationLoading(false);
      window.location.href = "/guest"
      // router.push("/guest");
    }
  }, [isUserLogged]);

  if (validationLoading) {
    return <LoaderComp />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
