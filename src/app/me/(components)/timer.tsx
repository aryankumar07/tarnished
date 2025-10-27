'use client'
import { useEffect, useState } from "react"

function calculateAge(birthDate: Date) {
  const now = new Date()
  let years = now.getFullYear() - birthDate.getFullYear()
  let months = now.getMonth() - birthDate.getMonth()
  let days = now.getDate() - birthDate.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  return { years, months, days }
}

export default function AgeTimer() {
  const birthDate = new Date("2002-12-31")
  const [age, setAge] = useState(calculateAge(birthDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setAge(calculateAge(birthDate))
    }, 1000 * 60 * 60 * 24) // update daily
    return () => clearInterval(interval)
  }, [birthDate])

  return (
    <div className="flex flex-col justify-center items-center p-1">
      <div className="text-orange">
        Wondering for
      </div>
      <p className="font-extralight text-orange underline">
        {age.years}Y : {age.months}M : {age.days}D
      </p>
    </div>
  )
}
