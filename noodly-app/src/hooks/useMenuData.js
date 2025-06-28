import { useState, useEffect } from "react";

export const useMenuData = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("0");
  // Cache products by category
  const [productCache, setProductCache] = useState({});

  const API_URL = "/app_request/get_data";

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
          Origin: window.location.origin,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.response_code === "1") {
        const categoriesArray = data.response_data[1];
        if (Array.isArray(categoriesArray)) {
          const formattedCategories = categoriesArray.map((category) => ({
            id: category.category_id,
            name: category.category_name_eng || category.category_name,
            image: category.category_img_thumb || null,
            description: category.category_description || "",
          }));
          setCategories(formattedCategories);
        } else {
          console.warn("No categories found in response data");
          setCategories([]);
        }
      } else {
        throw new Error(data.response_text || "Unknown API error");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again later.");
      setCategories([]);
    }
  };

  const fetchProducts = async (categoryId = "0") => {
    // If we have cached products for this category, use them immediately
    if (productCache[categoryId]) {
      setProducts(productCache[categoryId]);
    }

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
          Origin: window.location.origin,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.response_code === "1") {
        const productsArray = data.response_data[1];
        if (Array.isArray(productsArray)) {
          const formattedProducts = productsArray.map((product) => ({
            id: product.product_id,
            name: product.product_name_eng || product.product_name,
            image: product.product_img_thumb,
            price: parseFloat(product.price) || 0,
            discountedPrice: parseFloat(product.discounted_price) || 0,
            discountPercentage: parseFloat(product.disc_percentage) || 0,
            customizable: product.customisable === "1",
            description: product.unit_description || "",
            category_id: product.category_id || categoryId,
          }));
          // Update cache and state
          setProductCache((prev) => ({
            ...prev,
            [categoryId]: formattedProducts,
          }));
          setProducts(formattedProducts);
        } else {
          console.warn("No products found in response data");
          setProducts([]);
        }
      } else {
        throw new Error(data.response_text || "Unknown API error");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
      if (!productCache[categoryId]) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when selected category changes
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
