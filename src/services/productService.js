import axios from "axios";

const PRODUCTS_API_URL =
  "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json";

/**
 * Fetches all products from the remote JSON API.
 * @returns {Promise<Array>} Array of product objects
 */
export const fetchAllProducts = async () => {
  const response = await axios.get(PRODUCTS_API_URL);
  return response.data;
};
