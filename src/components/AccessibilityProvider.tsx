"use client"

import * as React from "react"
import { useAppConfig } from "@/store/useAppConfig"

/**
 * Reads accessibility settings from the Zustand store and syncs them
 * as data-attributes on <body> so pure CSS handles the visual changes.
 * This avoids SSR hydration mismatches by being a client-only leaf.
 */
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { highContrast, largeText, reducedMotion } = useAppConfig()

  React.useEffect(() => {
    const body = document.body
    body.dataset.highContrast = String(highContrast)
    body.dataset.largeText = String(largeText)
    body.dataset.reducedMotion = String(reducedMotion)
  }, [highContrast, largeText, reducedMotion])

  return <>{children}</>
}
