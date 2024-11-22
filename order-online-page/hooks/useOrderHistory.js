import React, { useState } from 'react'
import BaseClient from '../helper/Baseclients';
import { APIEndpoints } from '../constants/APIEndpoints';

const useOrderHistory=()=> {
    const [orderHistory,setOrderHistory]=useState(null);
    const [orderLoading,setOrderLoading] =useState(false);
    const [orderList,setOrderList]=useState(null)

  const fetchOrderList =async(userToken)=>{
    try{
        setOrderLoading(true);
        let headers={
            "x-user":userToken
        }
        await BaseClient.get(APIEndpoints.getOrderList,{},{
            onSuccess:(res)=>{
              
                setOrderHistory(res?.data?.data?.History)
            },
            onFailed:(err)=>{
                console.log("Error is fetched", err);
            },
            headers:headers
        })

    }
    finally{
        setOrderLoading(false);
    }
  }
  const fetchOrderDetails = async(userToken,orderId)=>{
    try{
       setOrderLoading(true);
        let headers={
            "x-user":userToken
        }
        await BaseClient.get(APIEndpoints.getOrderDetails+`/${orderId}`,{},{
            onSuccess:(res)=>{
               
                setOrderList(res?.data?.data)
            },
            onFailed:(err)=>{
                console.log("Error is fetched", err);
            },
            headers:headers
        })
    }
    finally{
        setOrderLoading(false)
    }
  }
  return{
    fetchOrderList,
    orderLoading,
    orderHistory,
    fetchOrderDetails,
    orderList
  }
}

export default useOrderHistory