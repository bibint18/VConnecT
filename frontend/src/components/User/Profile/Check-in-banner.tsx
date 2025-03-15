import { CalendarCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CheckInBanner() {
  return (
    <Card className="mb-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle>Check in</CardTitle>
          <CardDescription>
            Check in daily to maintain your streak and stay on the leaderboard! Keep your progress going and secure your
            top spot.
          </CardDescription>
        </div>
        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600">
          <CalendarCheck className="mr-2 h-4 w-4" />
          Check In
        </Button>
      </CardHeader>
    </Card>
  )
}

