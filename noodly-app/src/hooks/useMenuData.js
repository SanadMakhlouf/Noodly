import { useState, useEffect } from "react";

export const useMenuData = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for fallback
  const mockProducts = [
    {
      id: "101",
      name: "KOREAN NOODLES",
      image: "/images/korean.jpg",
      price: 35,
      description: "CHILI KOREAN SAUCE, NOODLY SPECIAL SPICES, PEPPERS.",
    },
    {
      id: "102",
      name: "SPICY KOREAN",
      image: "/images/spicy-korean.jpg",
      price: 38,
      description: "EXTRA HOT CHILI SAUCE, SPECIAL SPICES, VEGETABLES.",
    },
    {
      id: "103",
      name: "MILD KOREAN",
      image: "/images/mild-korean.jpg",
      price: 32,
      description: "MILD KOREAN SAUCE WITH VEGETABLES.",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = "https://shopapi.aipsoft.com/app_request/get_data";
        const requestData = {
          request_type: "product",
          language: "english",
          shop_id: "17",
          category_id: "0",
          sub_category_id: "0",
          access_token: "A#25t*4M",
          page_number: 1,
          item_per_page: 30,
        };

        console.log("Request URL:", url);
        console.log("Request Data:", requestData);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.response_code === "1") {
          // The products are in the second element (index 1) of response_data array
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
            }));
            setProducts(formattedProducts);
          } else {
            console.warn("No products found in response data");
            setProducts([]);
          }
        } else {
          throw new Error(data.response_text || "Unknown API error");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
        setLoading(false);

        // fallback to mock
        console.log("Using mock data as fallback");
        setProducts(mockProducts);
      }
    };

    fetchData();
  }, []);

  return { products, loading, error };
};
