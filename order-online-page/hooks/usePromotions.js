import { useState } from "react";
import axios from "axios";
import { APIEndpoints } from "../constants/APIEndpoints";

const usePromotions = () => {
  const [promotionList, setPromotionList] = useState(null);
  const [promotionLoading, setPromotionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllPromotions = async () => {
    try {
      setPromotionLoading(true);
      setError(null);

      const baseUrl = "https://shopadmin.vgrex.com/";
    
      if (!baseUrl) throw new Error("API Base URL is not defined. Check your .env file.");
      const apiUrl = `${baseUrl}${APIEndpoints.fetchPromotions}`;
      const response = await axios.get(apiUrl);
  
      setPromotionList(response?.data?.data);
    } catch (err) {
      console.error("Error fetching promotion list:", err);
      setError(err.message);
    } finally {
      setPromotionLoading(false);
    }
  };

  return {
    promotionList,
    promotionLoading,
    error,
    fetchAllPromotions,
  };
};

export default usePromotions;
