import { ResponsiveModal } from "@/components/responsive-dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";
import React from 'react'

interface pageProps {
    videoId:string,
    open:boolean,
    onOpenChange:(open:boolean) => void
}


const ThumbnailUploadModal = ({
    onOpenChange,
    open,
    videoId
} : pageProps) => {

    const utils = trpc.useUtils()


    const onUploadComplete = () =>{
        utils.studio.getOne.invalidate({id:videoId})
        utils.studio.getMany.invalidate()
        onOpenChange(false)
    }

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="Upload a thumbnail">
       <UploadDropzone 
       endpoint={"thumbnailUploader"}
       input={{videoId}}
       onClientUploadComplete={onUploadComplete}
       /> 
    </ResponsiveModal>
  )
}

export default ThumbnailUploadModal
