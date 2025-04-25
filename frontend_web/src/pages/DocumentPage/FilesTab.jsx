import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileIcon, FileTextIcon, ImageIcon, MoreHorizontalIcon, FileArchiveIcon, Upload, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/authentication-context"
import { useQueryClient } from "@tanstack/react-query"
import { useDocument } from "@/hooks/use-document"
import { useState } from "react"
import {UploadModal} from "@/components/upload-document"
import { format } from "date-fns"
import { Loading } from "@/components/loading-state"
import { Grid } from 'ldrs/react'

import { Input } from "@/components/ui/input"

const getFileIcon = (name) => {
    const fileType = name.split(".").pop()
    switch (fileType) {
        case "pdf":
        case "docx":
            return <FileTextIcon className="h-10 w-10" />
        case "xlsx":
            return <FileTextIcon className="h-10 w-10 " />
        case "png":
        case "jpg":
        case "jpeg":
        case "image/jpeg":
        case "PNG":
            return <ImageIcon className="h-10 w-10 " />
        case "zip":
            return <FileArchiveIcon className="h-10 w-10 " />
        default:
            return <FileIcon className="h-10 w-10 " />
    }
}
export default function FilesTab({projectId}){
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [isRenaming, setIsRenaming] = useState(false)
    const [renamingFileId, setRenamingFileId] = useState(null)
    const [newName, setNewName] = useState("")
    const { currentUser, getAuthHeader } = useAuth()
    const queryClient = useQueryClient()
    const { 
        documents,
        uploadDocumentMutation,
        downloadDocumentMutation,
        deleteDocumentMutation,
        renameDocumentMutation,
        isUploading,
        isDownloading,
        isDeleting,
        isLoadingDocuments,
        isDocumentsError,
        isDocumentsSuccess,
    } = useDocument({
        currentUser,
        queryClient,
        getAuthHeader,
        projectId
    })
    
    const handleUpload = async (uploadedFile) => {
        if (uploadedFile && uploadedFile[0] instanceof File) {
            uploadedFile = uploadedFile[0];
        }
        const formData = new FormData()
        formData.append("file", uploadedFile)
        formData.append("uploadedBy", currentUser.userId)
        formData.append("projectId", projectId)

        if (!uploadedFile || !(uploadedFile instanceof File)) {
            console.error("Invalid file object:", uploadedFile);
            return;
        }
        console.log("Form data:", formData)

        uploadDocumentMutation.mutate(formData, {
            onSuccess: () => {
                queryClient.invalidateQueries(['documents', projectId])
                setIsUploadModalOpen(false)
            }})
    }

    const handleDownload = (fileId) => {
        downloadDocumentMutation.mutate(fileId, {
            onSuccess: () => {
                queryClient.invalidateQueries(['documents', projectId])
            }})
    }

    const handleDelete = (fileId) => {
        console.log(fileId)
        deleteDocumentMutation.mutate(fileId, {
            onSuccess: () => {
                queryClient.invalidateQueries(['documents', projectId])
            }})
    }

    const handleRename = (fileId, fileName) => {
        setRenamingFileId(fileId)
        setNewName(fileName)
    }
    const confirmRename = (documentId) => {
        renameDocumentMutation.mutate({ documentId, newName }, {
            onSuccess: () => {
                queryClient.invalidateQueries(['documents', projectId])
                setRenamingFileId(null)
            }})
    }

    return(
        <div className="flex flex-col gap-4">
            {isLoadingDocuments ? (
                <div className="flex flex-col items-center justify-center h-96 w-full">
                    <Grid
                    size="60"
                    speed="1.5"
                    color="black" 
                    />
                    <p className="text-muted-foreground text-base">Fetching Documents...</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col w-full">
                            <h1 className="text-2xl font-bold">Files</h1>
                            <p className="text-muted-foreground">Manage and organize your files</p>
                        </div>
                        <Button className="ml-auto" onClick={() => setIsUploadModalOpen(true)}>
                            Upload
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents?.length === 0 ? (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg w-full">
                                <div className="bg-muted/30 p-6 rounded-full mb-4">
                                    <FileIcon className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-medium mb-2">No files yet</h3>
                                <p className="text-muted-foreground mb-6 text-center max-w-md">
                                    Upload files to get started. You can upload documents, images, spreadsheets, and more.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button onClick={() => setIsUploadModalOpen(true)} size="lg" className="gap-2">
                                    <Upload className="h-4 w-4" />
                                        Upload Files
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            documents?.map((file) => (
                                <Card key={file.documentId} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex items-start p-6">
                                            <div className="mr-4 flex-shrink-0">{getFileIcon(file.fileName)}</div>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex justify-between items-start">
                                                    {renamingFileId === file.documentId ? (
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                type="text"
                                                                className="border border-gray-300 rounded-md px-2 py-1 w-full"
                                                                value={newName}
                                                                onChange={(e) => setNewName(e.target.value)}
                                                            />
                                                            <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8" onClick={() => confirmRename(file.documentId)}>
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8" onClick={() => setRenamingFileId(null)}>
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        ) : (
                                                        <h3 className="font-medium text-sm truncate" title={file.fileName}>
                                                            {file.fileName}
                                                        </h3>
                                                    )}
                                                    
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            {renamingFileId === file.documentId ? (
                                                                <>
                                                                </>
                                                            ) : (
                                                                <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                                                                    <MoreHorizontalIcon className="h-4 w-4" />
                                                                    <span className="sr-only">Open menu</span>
                                                                </Button>
                                                            )}
                                                            
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem className="cursor-pointer" onClick={()=>handleDownload(file.documentId)}>
                                                                Download
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleRename(file.documentId, file.fileName)}>
                                                                Rename
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => handleDelete(file.documentId)}>
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    <Badge variant="outline" className="mr-2">
                                                        {file.fileType.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <div className="flex text-xs text-muted-foreground mt-2">
                                                    <span>Modified: {format(file.uploadedAt, "MMM d")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </>
            )}
            

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUpload={handleUpload}
                maxFiles={10}
                maxSize={50}
                allowedTypes={["*/*"]} // Accept all file types
            />
        </div>
    )
}