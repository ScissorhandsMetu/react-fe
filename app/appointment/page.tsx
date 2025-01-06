"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

const AppointmentContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const barberId = searchParams?.get("barber_id") ?? ""
  const appointmentDateTime = searchParams?.get("appointment_date") ?? ""

  // Split appointmentDateTime into date and time
  const [appointmentDate, setAppointmentDate] = useState(
    appointmentDateTime.split(" ")[0] ?? ""
  )
  const [slotTime, setSlotTime] = useState(
    appointmentDateTime.split(" ")[1] ?? ""
  )

  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState("haircut")
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState<{
    name?: string
    surname?: string
    email?: string
    phone?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    const appointmentData = {
      barber_id: parseInt(barberId, 10),
      customer_name: `${name} ${surname}`,
      customer_email: email,
      customer_phone: phone,
      appointment_date: appointmentDate,
      slot_time: slotTime,
      service,
    }

    try {
      const response = await fetch("http://34.142.51.130:8080/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      })

      if (!response.ok) {
        const data = await response.json()
        console.error("Error creating appointment:", data)
        alert(`Failed to book appointment: ${data.message || "Unknown error"}`)
        setLoading(false)
        return
      }

      const data = await response.json()
      alert(
        `Appointment confirmed with Barber ID: ${barberId} on ${appointmentDate} at ${slotTime}. Check your email for confirmation.`
      )
      setLoading(false)
      router.push("/") // Redirect to home after successful booking
    } catch (error) {
      console.error("An error occurred:", error)
      alert("An error occurred while booking. Please try again later.")
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string
      surname?: string
      email?: string
      phone?: string
    } = {}

    if (!name.trim()) {
      newErrors.name = "Please enter a valid first name."
    }

    if (!surname.trim()) {
      newErrors.surname = "Please enter a valid last name."
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address."
    }

    if (!phone || !/^\+\d{1,15}$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number (e.g., +123456789)."
    }

    if (!appointmentDate) {
      newErrors.phone = "Appointment date is missing."
    }

    if (!slotTime) {
      newErrors.phone = "Slot time is missing."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  if (!barberId || !appointmentDateTime) {
    return (
      <div className="container bg-secondary/20 p-4 text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Missing Appointment Information
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          It seems the appointment details are incomplete. Please go back and
          select a time and barber again.
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

      <div className="mb-4 text-center">
        <h2 className="text-2xl text-gray-800">
          Barber ID: <span className="text-primary">{barberId}</span>
        </h2>
        <h3 className="text-xl text-gray-600">
          Appointment Date:{" "}
          <span className="text-primary">{appointmentDate}</span>
        </h3>
        <h3 className="text-xl text-gray-600">
          Slot Time: <span className="text-primary">{slotTime}</span>
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* First Name */}
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
            className={`mt-2 w-full rounded-lg border p-3 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-lg font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
            placeholder="Doe"
            className={`mt-2 w-full rounded-lg border p-3 ${
              errors.surname ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-lg font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className={`mt-2 w-full rounded-lg border p-3 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-lg font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="+123456789"
            className={`mt-2 w-full rounded-lg border p-3 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        {/* Service Selection */}
        <div>
          <label htmlFor="service">Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="haircut">Haircut</option>
            <option value="beard cut">Beard Cut</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-3 text-white"
        >
          {loading ? "Booking..." : "Confirm Appointment"}
        </button>
      </form>
    </div>
  )
}

const Appointment = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <AppointmentContent />
  </Suspense>
)

export default Appointment
