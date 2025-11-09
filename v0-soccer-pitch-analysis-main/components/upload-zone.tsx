"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface UploadZoneProps {
  onAnalysisComplete: (data: {
    detectionImage: string
    formationImage: string
    formations?: { team1?: string; team2?: string }
  }) => void
  onAnalysisStart: () => void
  onAnalysisError?: () => void
}

export function UploadZone({ onAnalysisComplete, onAnalysisStart, onAnalysisError }: UploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setError(null)
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(uploadedFile)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
  })

  const handleAnalyze = async () => {
    if (!file) return

    try {
      setError(null)
      onAnalysisStart()

      const formData = new FormData()
      formData.append("file", file)

      const baseUrl = "https://unitinerant-shavonda-prosaically.ngrok-free.dev"

      const response = await fetch(`${baseUrl}/process_image`, {
        method: "POST",
        body: formData,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Upload failed with status ${response.status}: ${errorText}`)
      }

      const data = await response.json()

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const teamAUrl = `${baseUrl}/image/teamA_boxes_lines.jpg?t=${Date.now()}`
      const teamBUrl = `${baseUrl}/image/teamB_boxes_lines.jpg?t=${Date.now()}`

      onAnalysisComplete({
        detectionImage: teamAUrl,
        formationImage: teamBUrl,
        formations: data.formations || { team1: data.teamA_formation, team2: data.teamB_formation },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
      onAnalysisError?.()
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-balance">Upload a Soccer Pitch Image</h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Upload an image of a soccer pitch to automatically detect players, analyze team formations, and visualize
          tactical positioning
        </p>
      </div>

      <Card className="overflow-hidden">
        <div
          {...getRootProps()}
          className={`cursor-pointer border-2 border-dashed transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/20"
          } p-12`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4 text-center">
            {preview ? (
              <div className="relative w-full">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="mx-auto max-h-64 rounded-lg object-contain"
                />
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  <span>{file?.name}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive ? "Drop your image here" : "Drag and drop an image"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">or click to browse files</p>
                  <p className="mt-2 text-xs text-muted-foreground">Supports PNG, JPG, JPEG, WEBP</p>
                </div>
              </>
            )}
          </div>
        </div>

        {preview && (
          <div className="flex gap-3 border-t border-border bg-card p-4">
            <Button onClick={handleAnalyze} className="flex-1" size="lg">
              Analyze Formation
            </Button>
            <Button
              onClick={() => {
                setPreview(null)
                setFile(null)
                setError(null)
              }}
              variant="outline"
              size="lg"
            >
              Clear
            </Button>
          </div>
        )}
      </Card>

      {error && <div className="rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">{error}</div>}
    </div>
  )
}
