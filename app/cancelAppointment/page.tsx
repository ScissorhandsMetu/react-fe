"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"

const CancelAppointmentPage = () => {
  const router = useRouter()
  const [appointmentId, setAppointmentId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCancelAppointment = async () => {
    if (!appointmentId) {
      setError("Please enter a valid Appointment ID.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        "http://34.142.51.130:8080/appointments/cancel",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appointment_id: parseInt(appointmentId, 10) }),
        }
      )

      if (response.ok) {
        alert("Appointment canceled successfully.")
        router.push("/") // Redirect to the main page
      } else {
        const data = await response.json()
        setError(data.message || "Failed to cancel the appointment.")
      }
    } catch (error) {
      console.error("Error canceling appointment:", error)
      setError("An error occurred. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md rounded-lg bg-gray-100 p-6 shadow-lg">
      <h1 className="mb-4 text-center text-2xl font-bold text-gray-800">
        Cancel Appointment
      </h1>
      <div className="mb-4">
        <label
          htmlFor="appointmentId"
          className="block font-medium text-gray-700"
        >
          Appointment ID
        </label>
        <input
          id="appointmentId"
          type="text"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
          className="mt-2 w-full rounded-lg border p-3"
          placeholder="Enter your Appointment ID"
        />
      </div>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <Button
        onClick={handleCancelAppointment}
        disabled={loading}
        className={`w-full rounded-lg p-3 text-white ${
          loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {loading ? "Cancelling..." : "Cancel Appointment"}
      </Button>
    </div>
  )
}

export default CancelAppointmentPage
