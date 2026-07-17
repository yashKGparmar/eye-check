import type { Metadata } from "next";
import Link from "next/link";
import { H1, H2, P } from "@/components/ui/Typography";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Eye,
  Monitor,
  Apple,
  Lightbulb,
  Activity,
  Stethoscope,
  ArrowLeft,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Eye Health Education | VisionCheck AI",
  description: "Learn about eye strain, screen habits, nutrition, blue light myths, and when to visit a doctor.",
};

const articles = [
  {
    icon: Monitor,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    title: "Digital Eye Strain",
    summary: "Prolonged screen use causes temporary discomfort known as digital eye strain or computer vision syndrome.",
    body: [
      "Symptoms include blurred vision, headaches, dry eyes, and neck/shoulder pain.",
      "The American Optometric Association recommends the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.",
      "Blinking fully and frequently keeps the eye surface lubricated. Studies show blink rate drops by 50–66% during screen use.",
      "Keeping screens at arm's length and slightly below eye level reduces strain significantly.",
    ],
  },
  {
    icon: Activity,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/20",
    title: "Screen Habits for Healthy Eyes",
    summary: "Simple daily habits can dramatically reduce the long-term impact of screen time on your eyes.",
    body: [
      "Use night mode or warm colour temperature settings after sunset.",
      "Ensure your room lighting matches your screen brightness — avoid working in a dark room with a bright screen.",
      "Keep your display clean. Smudges and reflections force your eyes to work harder.",
      "Adjust font size and contrast so you don't squint or lean forward.",
    ],
  },
  {
    icon: Apple,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950/20",
    title: "Nutrition & Eye Health",
    summary: "What you eat directly affects your long-term eye health and risk of conditions like macular degeneration.",
    body: [
      "Lutein and zeaxanthin (found in leafy greens like kale and spinach) protect the macula from oxidative stress.",
      "Omega-3 fatty acids (oily fish, flaxseed) support the tear film and may reduce dry eye symptoms.",
      "Vitamin A deficiency is a leading cause of preventable blindness worldwide. Sources include carrots, sweet potato, and eggs.",
      "Antioxidants (vitamin C, vitamin E, zinc) found in citrus, nuts, and seeds reduce cataract risk.",
    ],
  },
  {
    icon: Lightbulb,
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    title: "Blue Light: Facts vs. Myths",
    summary: "Blue light from screens is often misunderstood. Here's what the evidence actually shows.",
    body: [
      "The sun emits far more blue light than any screen. Blue light itself is not inherently harmful at screen exposure levels.",
      "Current research does NOT confirm that blue-light-blocking glasses reduce digital eye strain compared to regular lenses.",
      "The biggest screen-related impact on sleep is real: blue light suppresses melatonin. Avoid bright screens 1-2 hours before bed.",
      "The discomfort you feel from screens is more likely due to reduced blinking and poor ergonomics than blue light itself.",
    ],
  },
  {
    icon: Eye,
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/20",
    title: "Eye Exercises",
    summary: "While exercises won't correct refractive errors, they can reduce fatigue and improve focus flexibility.",
    body: [
      "Focus shifting: Alternate focusing on a near object (your finger) then a distant object for 10-15 cycles.",
      "Figure-8 tracing: Slowly trace an imaginary figure-8 with your eyes to improve muscle control.",
      "Palming: Cover your closed eyes with warm palms for 30 seconds to reduce tension.",
      "The 20-20-20 rule remains the most evidence-backed exercise for reducing digital fatigue.",
    ],
  },
  {
    icon: Stethoscope,
    color: "text-teal-500",
    bg: "bg-teal-50 dark:bg-teal-950/20",
    title: "When to Visit a Doctor",
    summary: "Some symptoms require prompt professional attention. Never ignore these warning signs.",
    body: [
      "URGENT: Sudden vision loss, curtain-like shadow across vision, flashes of light, or a sudden shower of floaters — these can indicate retinal detachment.",
      "URGENT: Eye pain, redness, or chemical/physical injury — seek emergency care immediately.",
      "Schedule an appointment soon for: gradual blurring, double vision, frequent headaches, or difficulty driving at night.",
      "Routine: Adults with no symptoms should have a comprehensive eye exam every 1-2 years; more often if you wear glasses or have risk factors.",
    ],
  },
];

export default function EducationPage() {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div className="mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
        <H1 className="mb-3">Eye health tips</H1>
        <P className="text-[var(--text-secondary)] max-w-2xl text-balance">
          Short, practical ideas for caring for your eyes.
        </P>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {articles.map((article) => (
          <Card
            key={article.title}
            className={`flex flex-col ${article.bg} border-0 shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-black/30 flex items-center justify-center">
                  <article.icon className={`w-5 h-5 ${article.color}`} />
                </div>
                <CardTitle className="text-base">{article.title}</CardTitle>
              </div>
              <CardDescription>{article.summary}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {article.body.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 shrink-0 opacity-60" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 p-8 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] text-center">
        <H2 className="mb-3 text-2xl">Ready to check your vision?</H2>
        <P className="text-[var(--text-secondary)] mb-6">
          Try the screening in a few minutes.
        </P>
        <Link href="/">
          <Button size="lg" className="shadow-lg shadow-blue-500/20">
            Start Vision Screening
          </Button>
        </Link>
      </div>
    </div>
  );
}
