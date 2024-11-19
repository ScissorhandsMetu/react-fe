// app/appointment/page.tsx

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const Appointment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const time = searchParams?.get("time") ?? "";
  const barberName = searchParams?.get("barberName") ?? "";

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("haircut");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert(`Appointment confirmed with ${barberName} for ${time}.`);
      setLoading(false);
      router.push("/"); // Redirect back to the homepage after submission
    }, 2000); // Simulating a loading state for 2 seconds
  };

  if (!time || !barberName) {
    return (
      <div className="container p-4 text-center">
        <h1 className="text-3xl font-bold text-red-500">Missing Appointment Information</h1>
        <p className="mt-2 text-lg">It seems the appointment time or barber information is missing. Please go back and select a time.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container p-6 mx-auto max-w-xl bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Book an Appointment</h1>

      <div className="mb-4">
        <h2 className="text-2xl text-center text-gray-800">Selected Barber: <span className="text-blue-500">{barberName}</span></h2>
        <h3 className="text-xl text-center text-gray-600">Selected Time: <span className="text-blue-500">{time}</span></h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="John"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
            placeholder="Doe"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="(555) 123-4567"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="haircut">Haircut</option>
            <option value="beard cut">Beard Cut</option>
            <option value="hair wash">Hair Wash</option>
            <option value="facial care">Facial Care</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-3 mt-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all"
            disabled={loading}
          >
            {loading ? "Booking..." : "Confirm Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Appointment;
