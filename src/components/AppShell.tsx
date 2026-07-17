"use client"

import * as React from "react"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="w-full border-t border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-6 text-center mt-auto">
        <div className="max-w-4xl mx-auto text-sm text-[var(--text-secondary)]">
          This is a screening guide for awareness and education, not a diagnosis.
        </div>
      </footer>
    </>
  )
}
