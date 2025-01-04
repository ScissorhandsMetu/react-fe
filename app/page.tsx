"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define TypeScript interfaces
interface Appointment {
  date: string // Appointment date (ISO string format)
  slotTime: string // Appointment time (HH:mm:ss)
}

interface Barber {
  id: number
  name: string
  district: string
  description: string
  image: string
  appointments: Appointment[]
}

interface District {
  id: number
  name: string
}

export default function Home() {
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)

  useEffect(() => {
    // Fetch Barbers
    async function fetchBarbers() {
      try {
        const response = await fetch("http://34.142.51.130:8080/barbers")
        const data = await response.json()
        setBarbers(data)
      } catch (error) {
        console.error("Error fetching barbers:", error)
      }
    }

    // Fetch Districts
    async function fetchDistricts() {
      try {
        const response = await fetch("http://34.142.51.130:8080/districts")
        const data = await response.json()
        setDistricts(data)
      } catch (error) {
        console.error("Error fetching districts:", error)
      }
    }

    fetchBarbers()
    fetchDistricts()
  }, [])

  const filteredBarbers = selectedDistrict
    ? barbers.filter((barber) => barber.district === selectedDistrict)
    : barbers

  return (
    <>
      {/* Navbar */}
      <nav className="flex items-center gap-8 bg-secondary p-4">
        <div className="flex items-center gap-4">
          <img
            src="Screenshot_processed.png"
            className="size-12 rounded-full"
            alt="Logo"
          />
          <h1>ScissorHands</h1>
        </div>
        <Button>Contact Us</Button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-4 bg-secondary/40">
        <img
          src="Screenshot_processed.png"
          className="size-64 rounded-full border border-foreground p-3 "
          alt="Hero Logo"
        />
        <h1 className="text-7xl font-bold">ScissorHands</h1>
      </section>

      {/* District Filter */}
      <div className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>Select District</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by District</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSelectedDistrict(null)}>
              All
            </DropdownMenuItem>
            {districts.map((district) => (
              <DropdownMenuItem
                key={district.id}
                onClick={() => setSelectedDistrict(district.name)}
              >
                {district.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Barber Cards */}
      <section className="grid grid-cols-3 justify-center gap-4 p-4">
        {filteredBarbers.map((barber) => (
          <CardItem key={barber.id} barber={barber} />
        ))}
      </section>
    </>
  )
}

// 🛠️ CardItem Component
const CardItem = ({ barber }: { barber: Barber }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const router = useRouter()

  // Generate future dates (next 7 days)
  const futureDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date.toISOString().split("T")[0]
  })

  // Generate available times (8:00 AM to 5:00 PM in one-hour slots)
  const availableTimes = Array.from({ length: 10 }, (_, i) => {
    const hour = 8 + i
    return `${hour.toString().padStart(2, "0")}:00:00`
  })

  const getFilteredTimes = () => {
    if (!selectedDate) return []

    return availableTimes.map((time) => {
      const isUnavailable = (barber.appointments || []).some((appointment) => {
        const appointmentDate = appointment.date.split("T")[0]
        const appointmentTime = appointment.slotTime
        return appointmentDate === selectedDate && appointmentTime === time
      })
      return { time, isUnavailable }
    })
  }

  const filteredTimes = getFilteredTimes()

  const handleAppointment = () => {
    if (selectedDate && selectedTime) {
      router.push(
        `/appointment?barber_id=${barber.id}&appointment_date=${encodeURIComponent(
          `${selectedDate} ${selectedTime}`
        )}`
      )
    }
  }

  return (
    <Card className="rounded-lg border border-gray-300 p-6 shadow-lg">
      <CardHeader className="flex flex-col items-center space-y-4">
        <Image
          src={barber.image}
          alt={barber.name}
          width={180}
          height={180}
          className="rounded-full border border-gray-200 shadow-md"
        />
        <CardTitle className="text-lg font-semibold text-gray-800">
          {barber.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {barber.district}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Date Selection */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="w-full bg-black text-white">
              {selectedDate || "Select Date"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {futureDates.map((date) => (
              <DropdownMenuItem key={date}>
                <Button onClick={() => setSelectedDate(date)}>{date}</Button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Time Selection */}
        {selectedDate && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="w-full bg-black text-white">
                {selectedTime || "Select Time"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {filteredTimes.map(({ time, isUnavailable }) => (
                <DropdownMenuItem key={time}>
                  <Button
                    disabled={isUnavailable}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time} {isUnavailable ? "(Unavailable)" : ""}
                  </Button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Appointment Button */}
        <Button
          disabled={!selectedDate || !selectedTime}
          onClick={handleAppointment}
          className="mt-4 w-full bg-black text-white"
        >
          Book Appointment
        </Button>
      </CardContent>
    </Card>
  )
}
