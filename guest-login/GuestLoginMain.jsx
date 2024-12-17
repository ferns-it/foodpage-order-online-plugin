import React, { Fragment } from "react";
import OrderSummaryCheckout from "../order-online-page/components/OrderSummaryCheckout";
import LoaderComp from "../order-online-page/components/LoaderComp";
import ProtectedRoute from "../protector/Protector";
import { useAuth, AuthProvider } from "./context/AuthContext";

function PageContent() {
  const { validationLoading, user } = useAuth();

  return (
    <ProtectedRoute>
      {!validationLoading && user ? (
        <Fragment>
          <div className="checkout_section">
            <OrderSummaryCheckout />
          </div>
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
