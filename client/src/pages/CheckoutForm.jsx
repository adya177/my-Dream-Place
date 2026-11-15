import { useState } from "react";
import PropTypes from "prop-types";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

const CheckoutForm = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      toast.error("Payment is not ready yet. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        `${import.meta.env.VITE_PAYMENT_SECRET}`,
        { payment_method: { card: elements.getElement(CardElement) } }
      );
      if (error) toast.error("Payment failed. Please check your card details.");
      else if (paymentIntent?.status === "succeeded") toast.success("Payment successful!");
      else toast.error("Payment could not be confirmed. Please try again.");
    } catch {
      toast.error("Payment failed unexpectedly. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="border p-4 rounded-lg mb-4" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Processing..." : `Pay $${total}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
CheckoutForm.propTypes = { total: PropTypes.number.isRequired };
