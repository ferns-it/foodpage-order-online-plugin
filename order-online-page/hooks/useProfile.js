"use client"
import React, { useState } from 'react'
import BaseClient from '../helper/Baseclients';
import { APIEndpoints } from '../constants/APIEndpoints';

const useProfile = () => {
    const [address, setAddress] = useState(null);
    const [addressLoading, setAddressLoading] = useState(false);

    const fetchAddressList = async (userToken) => {
        try {
            setAddressLoading(true);
            let headers = {
                "x-user": userToken
            }

            await BaseClient.get(APIEndpoints.getAddressList, {},
                {
                    onSuccess: (res) => {
                        setAddress(res?.data?.data?.list)
                        console.log(res?.data?.data?.list, "res");
                    },
                    onFailed: (err) => {
                        console.log("Error is fetched", err);
                    },
                    headers: headers
                })
        }
        finally {
            setAddressLoading(false);
        }
    }
    const addNewAddress = async (payload, { onSuccess, onFailed, headers }) => {
        try {
            setAddressLoading(true);
            await BaseClient.post(APIEndpoints.addAddress, payload, {
                headers: headers,
                onSuccess: onSuccess,
                onFailed: onFailed
            })
        }
        finally {
            setAddressLoading(false)
        }
    }
    const deleteAddress = async (id, { onSuccess, onFailed, headers }) => {
        try {
            setAddressLoading(true);
            // debugger;
            await BaseClient.delete(APIEndpoints.deleteAddressList + `/${id}`, {
                headers: headers,
                onSuccess: onSuccess,
                onFailed: onFailed
            })
        }
        finally {
            setAddressLoading(false)
        }
    }
    const fetchDefaultAddress = async (addressId, { onSuccess, onFailed, headers }) => {
        try {
            setAddressLoading(true);
            await BaseClient.put(APIEndpoints.getDefaultAddress + `/${addressId}`, {
                headers: headers,
                onSuccess: onSuccess,
                onFailed: onFailed
            })
        }
        finally {
            setAddressLoading(false);
        }
    }

    const addressDetails = async (addressId, { onSuccess, onFailed, headers }) => {
        try {
            setAddressLoading(true);
    
            await BaseClient.put(`${APIEndpoints.getDefaultAddress}/${addressId}`, null, {
                headers: headers,
                onSuccess: onSuccess,
                onFailed: onFailed
            });
        } finally {
            setAddressLoading(false);
        }
    };
    
    return {
        fetchAddressList,
        address,
        addressLoading,
        addNewAddress,
        addressDetails,
        deleteAddress,
        fetchDefaultAddress
    }
}

export default useProfile