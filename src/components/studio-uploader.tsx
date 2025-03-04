import MuxUploader , {
    MuxUploaderDrop,
    MuxUploaderFileSelect,
    MuxUploaderProgress,
    MuxUploaderStatus
} from "@mux/mux-uploader-react"
import { UploadIcon } from "lucide-react"
import { Button } from "./ui/button"

interface StudioUploaderProps {
     endpoint?:string | null
     onSuccess: () => void
}


export const StudioUploader = ({
    endpoint,
    onSuccess
}:StudioUploaderProps) =>{
    return (
        <div>
            <MuxUploader endpoint={endpoint}
            onSuccess={onSuccess}
            id="video-uploader"
            className="hidden group/uploader"
            />

            <MuxUploaderDrop muxUploader="video-uploader" className="group/drop">
                <div slot="heading" className="flex items-center flex-col gap-6">
                    <div className="flex items-center justify-center gap-2 rounded-full bg-muted h-32 w-32">
                    <UploadIcon className="size-10 text-muted-foreground group/drop-[&[active]]:animate-bounce transition-all duration-300"/>
                    </div>

                    <div className="flex text-center gap-2 flex-col">
                        <p className="text-sm">Drag and drop files to uplaod</p>
                        <p className="text-xs text-muted-foreground">Your videos will be private untill you publish them.</p>
                    </div>

                    <MuxUploaderFileSelect muxUploader="video-uploader" >
                        <Button className="rounded-full" type="button" >  
                            Select file
                        </Button>
                    </MuxUploaderFileSelect>
                </div>
                <span slot="separator" className="hidden"/>
                <MuxUploaderStatus 
                muxUploader="video-uploader"
                className="text-sm"
                />
                <MuxUploaderProgress  
                muxUploader="video-uploader"
                className="text-sm"
                type="percentage"
                />
                <MuxUploaderProgress  
                muxUploader="video-uploader"
                type="bar"
                />
            </MuxUploaderDrop>
        </div>
    )
}

