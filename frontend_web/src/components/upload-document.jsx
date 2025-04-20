import { useState, useRef, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Upload, File, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function UploadModal({
  isOpen,
  onClose,
  onUpload,
  maxSize = 10, 
  allowedTypes = ["*/*"],
}) {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState("pending")
  const fileInputRef = useRef(null)

  const handleFileChange = useCallback(
    (selectedFiles) => {
      if (!selectedFiles || selectedFiles.length === 0) return

      // Get the first file only
      const selectedFile = selectedFiles[0]
      
      // Check file size
      if (selectedFile.size > maxSize * 1024 * 1024) {
        toast.error(`File ${selectedFile.name} is too large. Maximum size is ${maxSize}MB.`)
        return
      }

      // Check file type if specific types are allowed
      if (allowedTypes[0] !== "*/*" && !allowedTypes.includes(selectedFile.type)) {
        toast.error(`File ${selectedFile.name} has an unsupported format.`)
        return
      }

      setFile({
        file: selectedFile,
        id: Math.random().toString(36).substring(2, 9),
        progress: 0,
        status: "pending",
      })
    },
    [maxSize, allowedTypes],
  )

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const droppedFiles = e.dataTransfer.files
      handleFileChange(droppedFiles)
    },
    [handleFileChange],
  )

  const removeFile = useCallback(() => {
    setFile(null)
    setUploadProgress(0)
    setUploadStatus("pending")
  }, [])

  const handleUpload = useCallback(async () => {
    if (!file || isUploading) return

    setIsUploading(true)
    setUploadStatus("uploading")

    // Simulate upload progress
    const intervalId = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = Math.min(prev + 10, 100)
        
        // When progress reaches 100, clear the interval
        if (newProgress === 100) {
          clearInterval(intervalId)
          setTimeout(() => {
            setUploadStatus("success")
          }, 500)
        }
        
        return newProgress
      });
    }, 300)

    // Wait for upload to complete
    setTimeout(async () => {
      try {
        // In a real app, call onUpload with the actual file
        await onUpload([file.file])
        setIsUploading(false)
        // Uncomment to auto-close after upload
        // onClose()
      } catch (error) {
        console.error("Upload failed:", error)
        setIsUploading(false)
        setUploadStatus("error")
        setFile((prev) => ({
          ...prev,
          error: "Upload failed. Please try again.",
        }))
      }
    }, 3500) // Simulating a network request time
  }, [file, isUploading, onUpload])

  const getFileIcon = (fileObj) => {
    if (!fileObj) return null
    
    const fileType = fileObj.file.type.split("/")[0]

    if (fileType === "image") {
      return (
        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
          <img
            src={URL.createObjectURL(fileObj.file) || "/placeholder.svg"}
            alt={fileObj.file.name}
            className="w-full h-full object-cover"
            onLoad={() => URL.revokeObjectURL(URL.createObjectURL(fileObj.file))}
          />
        </div>
      )
    }

    return <File className="w-10 h-10 text-muted-foreground" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>Drag and drop a file here or click to browse.</DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "mt-4 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {!file ? (
            <div className="flex flex-col items-center justify-center text-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Drag file here or click to upload</p>
            </div>
          ) : (
            <div className="w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 w-full">
                {getFileIcon(file)}

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium truncate" title={file.file.name}>
                        {file.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    {uploadStatus === "success" && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />}

                    {uploadStatus === "error" && <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />}

                    {(uploadStatus === "pending" || uploadStatus === "uploading") && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={removeFile}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    )}
                  </div>

                  {(uploadStatus === "uploading" || uploadStatus === "success") && (
                    <Progress value={uploadProgress} className="h-1 mt-1" />
                  )}

                  {file.error && <p className="text-xs text-destructive mt-1">{file.error}</p>}
                </div>
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
            accept={allowedTypes.join(",")}
          />
        </div>

        <DialogFooter className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}