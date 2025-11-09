"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Download } from "lucide-react"

interface AnalysisResultsProps {
  data: {
    detectionImage: string
    formationImage: string
    formations?: {
      team1?: string
      team2?: string
    }
  }
  onReset: () => void
}

export function AnalysisResults({ data, onReset }: AnalysisResultsProps) {
  const getProxiedImageUrl = (url: string) => {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`
  }

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with Reset */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-balance">Analysis Results</h2>
          <p className="mt-1 text-muted-foreground">Formation detection and player positioning visualization</p>
        </div>
        <Button onClick={onReset} variant="outline" size="lg">
          <RotateCcw className="mr-2 h-4 w-4" />
          Analyze New Image
        </Button>
      </div>

      {/* Formation Info */}
      {data.formations && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Detected Formations</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.formations.team1 && (
              <div className="rounded-lg bg-accent/10 p-4">
                <div className="text-sm font-medium text-muted-foreground">Team A</div>
                <div className="mt-1 text-2xl font-bold text-accent">{data.formations.team1}</div>
              </div>
            )}
            {data.formations.team2 && (
              <div className="rounded-lg bg-primary/10 p-4">
                <div className="text-sm font-medium text-muted-foreground">Team B</div>
                <div className="mt-1 text-2xl font-bold text-primary">{data.formations.team2}</div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Team A Visualization */}
      <Card className="overflow-hidden">
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Team A Analysis</h3>
              <p className="text-sm text-muted-foreground">Bounding boxes, center points, and formation lines</p>
            </div>
            <Button
              onClick={() => handleDownload(data.detectionImage, "teamA_boxes_lines.jpg")}
              variant="outline"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        <div className="p-6">
          <img
            src={getProxiedImageUrl(data.detectionImage) || "/placeholder.svg"}
            alt="Team A detection output"
            className="w-full rounded-lg"
            onError={(e) => {
              console.error("[v0] Failed to load Team A image")
              e.currentTarget.src = "/team-detection.jpg"
            }}
          />
        </div>
      </Card>

      {/* Team B Visualization */}
      <Card className="overflow-hidden">
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Team B Analysis</h3>
              <p className="text-sm text-muted-foreground">Bounding boxes, center points, and formation lines</p>
            </div>
            <Button
              onClick={() => handleDownload(data.formationImage, "teamB_boxes_lines.jpg")}
              variant="outline"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        <div className="p-6">
          <img
            src={getProxiedImageUrl(data.formationImage) || "/placeholder.svg"}
            alt="Team B formation output"
            className="w-full rounded-lg"
            onError={(e) => {
              console.error("[v0] Failed to load Team B image")
              e.currentTarget.src = "/team-formation.jpg"
            }}
          />
        </div>
      </Card>
    </div>
  )
}
