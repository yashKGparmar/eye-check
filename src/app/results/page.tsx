"use client"

import * as React from "react"
import { useVisionTest } from "@/store/useVisionTest"
import { useVisionHistory } from "@/store/useVisionHistory"
import { analyzeResults } from "@/lib/scoringEngine"
import { H1, P } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { Download, RotateCcw, Share } from "lucide-react"
import { useRouter } from "next/navigation"

function getStatusLabel(level: "Low" | "Medium" | "High") {
  switch (level) {
    case "High":
      return "A professional eye exam may be worth arranging"
    case "Medium":
      return "A follow-up check may be helpful"
    default:
      return "This screening did not raise obvious concerns"
  }
}

function getFindingLabel(value: string | number | null | undefined, fallback: string) {
  if (value === null || value === undefined) return fallback
  if (typeof value === "number") {
    if (value > 50) return "Worth discussing at an exam"
    if (value > 0) return "No obvious concern from this check"
    return "No obvious concern from this check"
  }
  return value
}

export default function ResultsPage() {
  const { environment, scores, questionnaire, resetTest, setTestComplete, isTestComplete } = useVisionTest()
  const { addEntry } = useVisionHistory()
  const router = useRouter()
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false)
  const [shareStatus, setShareStatus] = React.useState<"idle" | "copied" | "error">("idle")
  const [pdfStatus, setPdfStatus] = React.useState<"idle" | "error">("idle")

  const results = React.useMemo(() => analyzeResults(environment, scores, questionnaire), [environment, scores, questionnaire])

  React.useEffect(() => {
    if (!isTestComplete) {
      setTestComplete(true)
      addEntry({
        environment,
        scores,
        questionnaire,
        results,
      })
    }
  }, [addEntry, environment, isTestComplete, questionnaire, results, scores, setTestComplete])

  const handleRetake = () => {
    resetTest()
    router.push("/test")
  }

  const handleDownloadPdf = async () => {
    const element = document.getElementById("report-content")
    if (!element) return

    setIsGeneratingPdf(true)
    setPdfStatus("idle")
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ])
      const canvas = await html2canvas(element, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save("visioncheck-report.pdf")
    } catch {
      setPdfStatus("error")
      window.setTimeout(() => setPdfStatus("idle"), 3000)
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleShare = async () => {
    const shareText = `Vision screening result: ${results.visionScore}/100. ${results.recommendationLevel.toLowerCase()} priority.`
    const shareUrl = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({
          title: "VisionCheck Result",
          text: shareText,
          url: shareUrl,
        })
        return
      }

      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      setShareStatus("copied")
      window.setTimeout(() => setShareStatus("idle"), 2500)
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      setShareStatus("error")
      window.setTimeout(() => setShareStatus("idle"), 2500)
    }
  }

  const recommendationMessage =
    results.recommendationLevel === "High"
      ? "A professional eye exam may be worth arranging soon."
      : results.recommendationLevel === "Medium"
        ? "A follow-up visit may be helpful."
        : "Nothing stood out in this screening."

  const safetyMessage = results.requiresEmergencyCare
    ? "Important: sudden changes, new double vision, pain, or loss of vision should be assessed promptly. If this is happening now, seek urgent care."
    : "This tool does not calculate eyeglass power or provide a prescription."

  const findings = [
    { label: "Left eye", value: getFindingLabel(scores.distanceLeft, "Not completed") },
    { label: "Right eye", value: getFindingLabel(scores.distanceRight, "Not completed") },
    { label: "Reading", value: getFindingLabel(scores.near, "Not completed") },
    { label: "Line appearance", value: scores.astigmatism === null ? "Not assessed" : scores.astigmatism ? "Worth discussing at an exam" : "No obvious concern from this check" },
    { label: "Color contrast", value: scores.color === null ? "Not assessed" : scores.color < 2 ? "Worth discussing at an exam" : "No obvious concern from this check" },
  ]

  return (
    <div className="flex-1 flex flex-col items-center w-full max-w-3xl mx-auto px-4 py-10 md:py-16">
      <div id="report-content" className="w-full rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 md:p-8">
        <H1 className="mb-4 text-center text-3xl sm:text-4xl">Your summary</H1>
        <P className="mb-8 text-center text-[var(--text-secondary)]">
          A calm overview of what your screening showed.
        </P>

        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--input-bg)] p-5 text-center">
          <div className="text-lg font-semibold">{getStatusLabel(results.recommendationLevel)}</div>
          <div className="mt-2 text-sm text-[var(--text-secondary)]">{recommendationMessage}</div>
          <div className="mt-3 text-sm text-[var(--text-secondary)]">{safetyMessage}</div>
        </div>

        <div className="mt-6 space-y-3 text-left">
          {findings.map((finding) => (
            <div key={finding.label} className="flex items-center justify-between rounded-xl border border-[var(--card-border)] px-4 py-3">
              <span className="font-medium">{finding.label}</span>
              <span className="text-sm text-[var(--text-secondary)]">{finding.value}</span>
            </div>
          ))}
        </div>

        <P className="mt-8 text-center text-sm text-[var(--text-secondary)]">
          This is a simple screening, not a diagnosis. It does not calculate eyeglass power or provide a prescription.
        </P>
      </div>

      <div className="mt-6 flex w-full flex-col gap-3">
        <Button onClick={handleRetake} size="lg" className="gap-2">
          <RotateCcw className="w-5 h-5" /> Retake quick check
        </Button>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleDownloadPdf} disabled={isGeneratingPdf}>
            <Download className="w-4 h-4" /> {isGeneratingPdf ? "Generating..." : pdfStatus === "error" ? "Export failed" : "Download PDF"}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleShare}>
            <Share className="w-4 h-4" />
            {shareStatus === "copied" ? "Copied" : shareStatus === "error" ? "Unable to share" : "Share"}
          </Button>
        </div>
      </div>
    </div>
  )
}
