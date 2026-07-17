"use client"

import * as React from "react"
import Link from "next/link"
import { useVisionHistory } from "@/store/useVisionHistory"
import { H1, H2, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { ArrowLeft, Trash2, CalendarDays, CheckCircle2, AlertCircle } from "lucide-react"

function ScoreBadge({ score }: { score: number }) {
  const color =
    score > 80
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      : score > 50
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
      {score}/100
    </span>
  )
}

export default function HistoryPage() {
  const { history, clearHistory } = useVisionHistory()

  const handleClear = () => {
    if (window.confirm("Are you sure you want to delete all vision history? This cannot be undone.")) {
      clearHistory()
    }
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 md:py-16">
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>
      </Link>

      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <H1 className="mb-2">Your history</H1>
          <P className="text-[var(--text-secondary)]">
            Your past screenings stay on this device.
          </P>
        </div>
        {history.length > 0 && (
          <Button variant="danger" size="sm" onClick={handleClear} className="gap-2 shrink-0">
            <Trash2 className="w-4 h-4" /> Clear All
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--input-bg)] flex items-center justify-center mb-6">
            <CalendarDays className="w-8 h-8 text-[var(--text-secondary)]" />
          </div>
          <H2 className="mb-3 text-xl">No history yet</H2>
          <P className="text-[var(--text-secondary)] mb-8 max-w-sm">
            Finish a screening to see it here.
          </P>
          <Link href="/">
            <Button size="lg">Take a Screening</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => {
            const date = new Date(entry.date)
            const formattedDate = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
            const { recommendationLevel, visionScore, acuityEstimate } = entry.results

            return (
              <Card key={entry.id} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      {recommendationLevel === "Low" ? (
                        <CheckCircle2 className="w-5 h-5 text-[var(--color-success)] shrink-0" />
                      ) : (
                        <AlertCircle
                          className={`w-5 h-5 shrink-0 ${
                            recommendationLevel === "High"
                              ? "text-[var(--color-danger)]"
                              : "text-[var(--color-warning)]"
                          }`}
                        />
                      )}
                      <CardTitle className="text-base">{formattedDate}</CardTitle>
                    </div>
                    <ScoreBadge score={visionScore} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-[var(--text-secondary)] block mb-1">Screening note</span>
                      <span className="font-semibold">{acuityEstimate}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)] block mb-1">Next step</span>
                      <span
                        className={`font-semibold ${
                          recommendationLevel === "Low"
                            ? "text-[var(--color-success)]"
                            : recommendationLevel === "Medium"
                            ? "text-[var(--color-warning)]"
                            : "text-[var(--color-danger)]"
                        }`}
                      >
                        {recommendationLevel}
                      </span>
                    </div>
                    {entry.results.detailedScores.distance !== null && (
                      <div>
                        <span className="text-[var(--text-secondary)] block mb-1">Distance</span>
                        <span className="font-semibold">{entry.results.detailedScores.distance}/100</span>
                      </div>
                    )}
                    {entry.results.detailedScores.near !== null && (
                      <div>
                        <span className="text-[var(--text-secondary)] block mb-1">Reading</span>
                        <span className="font-semibold">{entry.results.detailedScores.near}/100</span>
                      </div>
                    )}
                  </div>

                  {entry.results.insights.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[var(--card-border)]">
                      <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider mb-2">
                        Key Insights
                      </p>
                      <ul className="space-y-1">
                        {entry.results.insights.slice(0, 2).map((insight, i) => (
                          <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2">
                            <span className="shrink-0">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                        {entry.results.insights.length > 2 && (
                          <li className="text-xs text-[var(--text-secondary)] italic">
                            +{entry.results.insights.length - 2} more insights
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
