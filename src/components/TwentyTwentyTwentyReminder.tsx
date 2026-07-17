"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Bell, BellOff, Clock } from "lucide-react"

/**
 * 20-20-20 Reminder Component.
 * Requests Notification permission and schedules periodic Web Notifications.
 * Falls back to an in-app toast if Notifications are unavailable.
 */
export function TwentyTwentyTwentyReminder() {
  const [enabled, setEnabled] = React.useState(false)
  const [showInApp, setShowInApp] = React.useState(false)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const sendNotification = React.useCallback(() => {
    if (typeof window === "undefined") return
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("VisionCheck AI — Eye Break", {
        body: "Look at something 20 feet away for 20 seconds. Rest your eyes! 👁️",
        icon: "/favicon.ico",
        tag: "20-20-20",
      })
    } else {
      setShowInApp(true)
      setTimeout(() => setShowInApp(false), 8000)
    }
  }, [])

  const toggleReminder = async () => {
    if (enabled) {
      // Disable
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
      setEnabled(false)
      return
    }

    // Enable — request permission first
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }

    // Start 20-minute interval
    intervalRef.current = setInterval(sendNotification, 20 * 60 * 1000)
    setEnabled(true)
    // Fire an immediate one so user confirms it's working
    sendNotification()
  }

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="relative">
      <Button
        variant={enabled ? "default" : "secondary"}
        size="sm"
        onClick={toggleReminder}
        className="gap-2"
        aria-label={enabled ? "Disable 20-20-20 eye break reminders" : "Enable 20-20-20 eye break reminders"}
      >
        {enabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
        <span className="hidden sm:inline">
          {enabled ? "Reminders On" : "20-20-20 Reminder"}
        </span>
        <Clock className="w-3 h-3 opacity-60 hidden sm:inline" />
      </Button>

      {/* In-app toast fallback */}
      {showInApp && (
        <div className="absolute bottom-full right-0 mb-2 w-72 p-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl text-sm z-50">
          <p className="font-semibold mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--color-primary)]" />
            Eye Break Time!
          </p>
          <p className="text-[var(--text-secondary)]">
            Look at something 20 feet away for 20 seconds to rest your eyes.
          </p>
        </div>
      )}
    </div>
  )
}
