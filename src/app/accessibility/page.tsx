"use client"

import * as React from "react"
import Link from "next/link"
import { useAppConfig } from "@/store/useAppConfig"
import { H1, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { ArrowLeft, Contrast, Type, ZapOff } from "lucide-react"

function Toggle({
  label,
  description,
  icon: Icon,
  checked,
  onChange,
}: {
  label: string
  description: string
  icon: React.ElementType
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`w-full flex items-center gap-4 p-5 rounded-xl border text-left transition-colors cursor-pointer ${
        checked
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
          : "border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--input-bg)]"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          checked ? "bg-[var(--color-primary)] text-white" : "bg-[var(--input-bg)] text-[var(--text-secondary)]"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[var(--foreground)]">{label}</p>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">{description}</p>
      </div>
      {/* Pill toggle */}
      <div
        className={`w-12 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-[var(--color-primary)]" : "bg-[var(--input-border)]"}`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white mt-0.5 shadow transition-transform ${
            checked ? "translate-x-6 ml-0.5" : "translate-x-0.5"
          }`}
        />
      </div>
    </button>
  )
}

export default function AccessibilityPage() {
  const { highContrast, largeText, reducedMotion, toggleHighContrast, toggleLargeText, toggleReducedMotion } =
    useAppConfig()

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-12 md:py-16">
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </Link>

      <H1 className="mb-3">Accessibility</H1>
      <P className="text-[var(--text-secondary)] mb-10">
        Make the app easier to read and use.
      </P>

      <div className="space-y-4">
        <Toggle
          label="High Contrast"
          description="Increases colour contrast for better legibility."
          icon={Contrast}
          checked={highContrast}
          onChange={toggleHighContrast}
        />
        <Toggle
          label="Large Text"
          description="Increases font sizes across the application."
          icon={Type}
          checked={largeText}
          onChange={toggleLargeText}
        />
        <Toggle
          label="Reduce Motion"
          description="Minimises animations and transitions throughout the app."
          icon={ZapOff}
          checked={reducedMotion}
          onChange={toggleReducedMotion}
        />
      </div>

      <Card className="mt-10 bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-base">Keyboard help</CardTitle>
          <CardDescription>You can use the keyboard to move through the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li><kbd className="px-1.5 py-0.5 rounded border border-[var(--card-border)] font-mono text-xs">Tab</kbd> — Move between interactive elements</li>
            <li><kbd className="px-1.5 py-0.5 rounded border border-[var(--card-border)] font-mono text-xs">Space / Enter</kbd> — Activate buttons</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
