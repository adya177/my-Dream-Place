import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { FaRegCalendarAlt, FaRegMoneyBillAlt, FaUserAlt } from "react-icons/fa";

const AllTrip = () => {
  const [bookingList, setAllBookingList] = useState([]);

  const getAllTrip = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/booking/get-all-bookings`
    );
    setAllBookingList(response.data.bookings);
  };

  useEffect(() => {
    getAllTrip();
  }, []);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 lg:flex-row lg:px-8">
      <Navbar />
      <section className="min-w-0 flex-1 p-2 sm:p-5"><p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-600">Workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Guest bookings</h1><p className="mb-7 mt-2 text-slate-600">Review stay reservations and payment status.</p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {bookingList.map((booking) => (
          <div
            key={booking._id}
            className="max-w-sm rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="p-4">
              <h2 className="text-lg font-bold text-slate-900">
                {booking.post?.title || "Stay reservation"}
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                <FaRegCalendarAlt className="inline-block mr-2" />
                {new Date(booking.bookingDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                <FaRegMoneyBillAlt className="inline-block mr-2" />
                Payment Status: {booking.paymentStatus}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                <FaUserAlt className="inline-block mr-2" />
                Guest: {booking.user?.name || "Account holder"}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Status:{" "}
                <span
                  className={`${
                    booking.status === "pending"
                      ? "text-yellow-500"
                      : "text-green-500"
                  } font-bold`}
                >
                  {booking.status}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
      </section>
    </main>
  );
};

export default AllTrip;
