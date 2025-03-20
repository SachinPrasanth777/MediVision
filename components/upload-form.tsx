"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, FileImage } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function UploadForm() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    setFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    setProgress(0)
    setIsUploading(false)
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 p-8 transition-colors",
            isDragging ? "border-blue-500 bg-blue-500/10" : "hover:border-gray-500",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileImage className="mb-3 h-12 w-12 text-gray-400" />
          <p className="mb-2 text-sm text-gray-300">Drag & drop your X-ray image here</p>
          <p className="mb-4 text-xs text-gray-500">Supports: JPEG, PNG, DICOM</p>
          <label htmlFor="file-upload">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer border-gray-700 bg-transparent text-white hover:bg-gray-800"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 overflow-hidden rounded-md">
                <img src={preview || ""} alt="Preview" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile} className="h-8 w-8 text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isUploading && (
            <div className="mt-4 space-y-2">
              <Progress value={progress} className="h-2 bg-gray-700" />
              <p className="text-right text-xs text-gray-400">{progress}%</p>
            </div>
          )}

          {!isUploading && (
            <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700" onClick={simulateUpload}>
              <Upload className="mr-2 h-4 w-4" />
              Process X-ray
            </Button>
          )}
        </div>
      )}

      <div className="text-xs text-gray-400">
        <p>Your data is processed securely and privately.</p>
        <p>All uploads are encrypted and automatically deleted after analysis.</p>
      </div>
    </div>
  )
}

