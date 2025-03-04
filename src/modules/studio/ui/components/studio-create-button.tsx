"use client"
import { ResponsiveModal } from '@/components/responsive-dialog'
import { StudioUploader } from '@/components/studio-uploader'
import { Button } from '@/components/ui/button'
import { trpc } from '@/trpc/client'
import { Loader2Icon, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const StudioCreateModal = () => {
    const router = useRouter()
    const utils = trpc.useUtils()
    const create = trpc.videos.create.useMutation({
        onSuccess: ()=>{
            toast.success("Video Created")
            utils.studio.getMany.invalidate()
        },
        onError: (error)=>{
            toast.error(error.message)
        }
    })   
    
    const onSuccess = () =>{
        if(!create.data?.video.id) return

        create.reset()
        
        router.push(`/studio/videos/${create.data.video.id}`)
    }
  return (
    <>
    <ResponsiveModal
    title='Upload a video'
    open={Boolean(create.data?.url)}
    onOpenChange={()=> create.reset()}
    >
        {create.data?.url ? <StudioUploader onSuccess={onSuccess}  endpoint={create.data?.url}/> : <Loader2Icon /> }
    </ResponsiveModal>
    <Button variant={"secondary"} onClick={()=> {
        create.mutate()
    }} disabled={create.isPending}>
        {create.isPending ? <Loader2Icon className='animate-spin' /> : <PlusIcon className='size-5' />}
        <span>create</span>
    </Button>
    </>
  )
}

export default StudioCreateModal
