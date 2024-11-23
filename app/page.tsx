"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

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

// Availability slots (8 AM - 5 PM)
const availabilityTimes = Array.from(
  { length: 10 },
  (_, i) => `${8 + i}:00 AM`
).map((time, i) => (i === 4 ? time.replace("12:00 AM", "12:00 PM") : time))

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)

  const barbers = [
    {
      id: 1,
      name: "John's Barbershop",
      district: "Downtown",
      description: "Expert in classic and modern cuts.",
      image: "/barber.JPG",
      availability: [
        true,
        false,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        false,
      ], // Represents availability for 8 AM to 5 PM
    },
    {
      id: 3,
      name: "Sarah's Studio",
      district: "Uptown",
      description: "Specializing in fades and beard grooming.",
      image: "/barber.JPG",
      availability: [
        false,
        true,
        true,
        false,
        true,
        true,
        true,
        false,
        false,
        true,
      ], // Availability for 8 AM to 5 PM
    },
    {
      id: 2,
      name: "Mike's Grooming",
      district: "Midtown",
      description: "Precision cuts and luxury experience.",
      image: "/barber.JPG",
      availability: [
        true,
        true,
        true,
        true,
        false,
        false,
        true,
        false,
        false,
        false,
      ], // Availability for 8 AM to 5 PM
    },
  ]

  // Filter barbers based on the selected district
  const filteredBarbers = selectedDistrict
    ? barbers.filter((barber) => barber.district === selectedDistrict)
    : barbers

  return (
    <>
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
      <section className="flex flex-col items-center justify-center gap-4 bg-secondary/40">
        <img
          src="Screenshot_processed.png"
          className="size-64 rounded-full border border-foreground p-3 "
          alt="Hero Logo"
        />
        <h1 className="text-7xl font-bold">ScissorHands</h1>
      </section>
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
            <DropdownMenuItem onClick={() => setSelectedDistrict("Downtown")}>
              Downtown
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedDistrict("Uptown")}>
              Uptown
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedDistrict("Midtown")}>
              Midtown
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <section className="grid grid-cols-3 justify-center gap-4 p-4">
        {filteredBarbers.map((barber, index) => (
          <CardItem key={barber.id} barber={barber} />
        ))}
      </section>
    </>
  )
}

const CardItem = ({
  barber,
}: {
  barber: {
    name: string
    district: string
    description: string
    image: string
    availability: boolean[]
  }
}) => {
  const availabilityTimes = Array.from(
    { length: 10 },
    (_, i) => `${8 + i}:00 AM`
  ).map((time, i) => (i === 4 ? time.replace("12:00 AM", "12:00 PM") : time))

  return (
    <Card>
      <CardHeader>
        <Image
          src={barber.image}
          alt={barber.name}
          width={200}
          height={200}
          className="rounded-lg"
        />
        <CardTitle>{barber.name}</CardTitle>
        <CardDescription>{barber.district}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{barber.description}</p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>Select Time</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Available Times</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availabilityTimes.map((time, index) => (
              <DropdownMenuItem key={time}>
                <Link
                  href={{
                    pathname: "/appointment",
                    query: { time, barberName: barber.name }, // Pass time and barber info
                  }}
                >
                  <Button
                    className={`${
                      barber.availability[index] ? "bg-green-500" : "bg-red-500"
                    } w-full text-white`}
                    disabled={!barber.availability[index]}
                  >
                    {time} -{" "}
                    {barber.availability[index] ? "Available" : "Not Available"}
                  </Button>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}
