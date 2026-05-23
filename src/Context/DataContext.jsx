import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchAllProducts } from "../services/productService";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-fetch products when the app mounts
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchAllProducts();
        setData(products);
      } catch (err) {
        setError("Failed to load products. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
