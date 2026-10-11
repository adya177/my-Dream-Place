// src/components/ThankYou.js
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 180);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-100 px-5 py-16">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        run={showMessage}
        numberOfPieces={200}
      />
      <div className="relative z-10 mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-blue-100 sm:p-12">
        <div className="space-y-5">
          <h1
            className={`text-4xl font-extrabold text-slate-900 transition duration-700 sm:text-5xl ${
              showMessage
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            🎉 Thank You! 🎉
          </h1>
          <p
            className={`text-lg leading-7 text-slate-600 transition duration-700 ${
              showMessage
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Thank you for using our service! We appreciate your support.
          </p>
          <button
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-200"
            onClick={() => navigate("/")}
          >
            Go Back Home
          </button>
        </div>
      </div>
    </main>
  );
};

export default ThankYou;
