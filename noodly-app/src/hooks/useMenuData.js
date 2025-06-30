import { useState, useEffect } from "react";

export const useMenuData = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("0");

  const API_URL = "https://shopapi.aipsoft.com/app_request/get_data"; // Replace with your actual backend URL

  const fetchCategories = async () => {
    try {
      const requestData = {
        request_type: "category",
        language: "english",
        shop_id: "17",
        access_token: "A#25t*4M",
        page_number: "1",
        item_per_page: "10",
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log("Category response:", data);

      if (data.response_code === "1") {
        const rawCategories = data.response_data[1];
        const cleanCategories = rawCategories.map((cat) => ({
          id: cat.category_id,
          name: cat.category_name_eng || cat.category_name,
          image: cat.category_img_thumb || "",
        }));
        setCategories(cleanCategories);
      } else {
        setError("Could not load categories.");
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      setError(`Failed to load categories: ${err.message}`);
    }
  };

  const fetchProducts = async (categoryId = "0") => {
    try {
      const requestData = {
        request_type: "product",
        language: "english",
        shop_id: "17",
        category_id: categoryId,
        sub_category_id: "0",
        access_token: "A#25t*4M",
        page_number: 1,
        item_per_page: 30,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log("Product response:", data);

      if (data.response_code === "1") {
        const rawProducts = data.response_data[1];
        const cleanProducts = rawProducts.map((prod) => ({
          id: prod.product_id,
          name: prod.product_name_eng || prod.product_name,
          image: prod.product_img_thumb,
          price: parseFloat(prod.price) || 0,
        }));
        setProducts(cleanProducts);
      } else {
        setError("Could not load products.");
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setError(`Failed to load products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  return {
    products,
    categories,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
  };
};
