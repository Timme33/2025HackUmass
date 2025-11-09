"use client"

import { useState } from "react"
import { UploadZone } from "@/components/upload-zone"
import { AnalysisResults } from "@/components/analysis-results"
import { Activity } from "lucide-react"

interface AnalysisData {
  detectionImage: string
  formationImage: string
  formations?: {
    team1?: string
    team2?: string
  }
}

export default function Home() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data)
    setIsAnalyzing(false)
  }

  const handleAnalysisStart = () => {
    setIsAnalyzing(true)
    setAnalysisData(null)
  }

  const handleAnalysisError = () => {
    setIsAnalyzing(false)
  }

  const handleReset = () => {
    setAnalysisData(null)
    setIsAnalyzing(false)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-balance">Soccer Formation Analyzer</h1>
              <p className="text-sm text-muted-foreground">AI-powered tactical analysis and formation detection</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {!analysisData && (
          <>
            <UploadZone
              onAnalysisComplete={handleAnalysisComplete}
              onAnalysisStart={handleAnalysisStart}
              onAnalysisError={handleAnalysisError}
            />

            {isAnalyzing && (
              <div className="mt-8 flex flex-col items-center justify-center gap-4 py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
                <p className="text-lg font-medium">Analyzing formation...</p>
                <p className="text-sm text-muted-foreground">Detecting players and computing tactical setup</p>
              </div>
            )}
          </>
        )}

        {analysisData && <AnalysisResults data={analysisData} onReset={handleReset} />}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          Powered by advanced computer vision and formation detection algorithms
        </div>
      </footer>
    </main>
  )
}
