import { useState } from "react";

export const useOrderSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const submitOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    setOrderSuccess(false);

    try {
      // Prepare the order data with required parameters
      const formData = new FormData();
      formData.append("request_type", "save_order");
      formData.append("shop_id", "17");
      formData.append("access_token", "A#25t*4M");

      // Add order details
      formData.append("tax_less_amount", orderData.taxLessAmount.toString());
      formData.append("tax_amount", orderData.taxAmount.toString());
      formData.append(
        "total_amount",
        (orderData.taxLessAmount + orderData.taxAmount).toString()
      );
      formData.append("delivery_date", orderData.deliveryDate);
      formData.append("delivery_time", orderData.deliveryTime);
      formData.append("payment_method", orderData.paymentMethod);
      formData.append("customer_id", orderData.customerId);
      formData.append("address_id", orderData.addressId);

      // Add products
      orderData.products.forEach((product, index) => {
        formData.append(`product_id[${index}]`, product.id);
        formData.append(`product_qty[${index}]`, product.quantity.toString());
        formData.append(`product_price[${index}]`, product.price.toString());
        formData.append(`product_name[${index}]`, product.name);
        if (product.addons && product.addons.length > 0) {
          formData.append(
            `product_addons[${index}]`,
            JSON.stringify(product.addons)
          );
        }
      });

      const response = await fetch(
        "https://shopapi.aipsoft.com/app_request/get_data",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setOrderSuccess(true);
        return {
          success: true,
          orderId: "PENDING",
          message: "Order submitted successfully",
        };
      } else {
        throw new Error("Failed to submit order");
      }
    } catch (err) {
      console.error("Error submitting order:", err);
      setError("Failed to submit order. Please try again.");
      return {
        success: false,
        error: "Failed to submit order. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    submitOrder,
    loading,
    error,
    orderSuccess,
  };
};
