"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

const AppointmentContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const time = searchParams?.get("time") ?? ""
  const barberName = searchParams?.get("barberName") ?? ""

  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState("haircut")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      alert(`Appointment confirmed with ${barberName} for ${time}.`)
      setLoading(false)
      router.push("/") // Redirect back to the homepage after submission
    }, 2000) // Simulating a loading state for 2 seconds
  }

  if (!time || !barberName) {
    return (
      <div className="container bg-secondary/20 p-4 text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Missing Appointment Information
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          It seems the appointment time or barber information is missing. Please
          go back and select a time.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="hover:bg-primary-dark mt-4 rounded-full bg-primary px-6 py-2 text-white transition-all"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-xl rounded-lg bg-secondary/20 p-6 shadow-lg">
      <h1 className="mb-6 text-center text-4xl font-bold text-primary">
        Book an Appointment
      </h1>

      <div className="mb-4">
        <h2 className="text-center text-2xl text-gray-800">
          Selected Barber: <span className="text-primary">{barberName}</span>
        </h2>
        <h3 className="text-center text-xl text-gray-600">
          Selected Time: <span className="text-primary">{time}</span>
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-lg font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="John"
            className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
            placeholder="Doe"
            className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="(555) 123-4567"
            className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">
            Service
          </label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="hover:bg-primary-dark mt-4 w-full rounded-lg bg-primary py-3 text-lg font-semibold text-white transition-all disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Booking..." : "Confirm Appointment"}
          </button>
        </div>
      </form>
    </div>
  )
}

const Appointment = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppointmentContent />
    </Suspense>
  )
}

export default Appointment
