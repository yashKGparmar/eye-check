"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { H1, P } from "@/components/ui/Typography"
import { Eye } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--card-bg)]">
          <Eye className="h-9 w-9 text-[var(--color-primary)]" />
        </div>

        <H1 className="mb-4 text-4xl sm:text-5xl">VisionCheck</H1>
        <P className="mb-8 text-lg text-[var(--text-secondary)]">
          A quick, simple screening to help you decide whether an eye exam may be worthwhile. It takes about 2–3 minutes and does not measure eyeglass power or provide a prescription.
        </P>

        <Button size="lg" onClick={() => router.push("/test")} className="px-10">
          Start Screening
        </Button>

        <P className="mt-6 text-sm text-[var(--text-secondary)]">
          This is a screening tool for education and awareness, not a diagnosis.
        </P>
      </div>
    </div>
  )
}
