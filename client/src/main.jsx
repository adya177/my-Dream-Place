import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/UserContext.jsx";
import { SearchProvider } from "./context/Serach.jsx";
import { CartProvider } from "./context/Cart.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { BookingProvider } from "./context/Booking.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 45_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Load your Stripe public key
const stripePromise = loadStripe(
  "pk_test_51NmvjYSJMmMS2PKYPTmToXg9wC1zicQF8uOorOJ0BcYOioztEhncFCsEE3NfcBEjr7XqJhzCldWd0RfK0tUHZ3mW00ISvW0iwa"
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthProvider>
          <BookingProvider>
            <Elements stripe={stripePromise}>
              <CartProvider>
                <SearchProvider>
                  <BrowserRouter>
                    <App />
                    <Toaster position="bottom-right" toastOptions={{ duration: 3200, style: { background: "#18181b", color: "#fafafa", border: "1px solid rgba(255,255,255,.12)", borderRadius: "14px", boxShadow: "0 12px 36px rgba(0,0,0,.35)" } }} />
                  </BrowserRouter>
                </SearchProvider>
              </CartProvider>
            </Elements>
          </BookingProvider>
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
