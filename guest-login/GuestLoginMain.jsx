"use client";
import React, { Fragment } from "react";
import OrderSummaryCheckout from "../order-online-page/components/OrderSummaryCheckout";
import LoaderComp from "../order-online-page/components/LoaderComp";
import ProtectedRoute from "../protector/Protector";
import { AuthProvider, useAuth } from "./context/AuthContext";

function PageContent() {
  const { validationLoading, user } = useAuth();

  return (
    <ProtectedRoute>
      {!validationLoading && user ? (
        <Fragment>
          <main>
            <div className="relative img-cont-1">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  background: "#d0b879",
                }}
              >
                <div className="absolute inset-0 bg-black/50" />
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center img-cont-1 text-center text-white px-4"></div>
            </div>
            <div className="checkout_section">
              <OrderSummaryCheckout />
            </div>
          </main>
        </Fragment>
      ) : (
        <LoaderComp />
      )}
    </ProtectedRoute>
  );
}

function GuestLoginMain() {
  return (
    <Fragment>
      <AuthProvider>
        <PageContent />
      </AuthProvider>
    </Fragment>
  );
}
export default GuestLoginMain;
