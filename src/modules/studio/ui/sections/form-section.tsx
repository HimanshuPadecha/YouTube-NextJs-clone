"use client"
import { z } from "zod"

import { Button } from '@/components/ui/button'
import { trpc } from '@/trpc/client'
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CopyCheckIcon, CopyIcon, ImagePlusIcon, Loader2Icon, MoreVerticalIcon, RotateCcwIcon, SparkleIcon, SparklesIcon, TrashIcon } from 'lucide-react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { videoUpdateSchema } from "@/db/schema"
import { toast } from "sonner"
import VideoPlayer from "@/modules/videos/ui/components/video-player"
import Link from "next/link"
import { snakeCaseToTitle } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Image from "next/image"
import ThumbnailUploadModal from "../components/thumbnail-upload-modal"

interface pageProps {
    videoId: string
}

const FormSection = ({ videoId }: pageProps) => {

    const router = useRouter()
    const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId })
    const [categories] = trpc.categories.getMany.useSuspenseQuery()
    const utils = trpc.useUtils()
    const update = trpc.videos.update.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate()
            utils.studio.getOne.invalidate({ id: videoId })
            toast.success("Video Updated")
            router.push("/studio")
        },
        onError: () => {
            toast.error("Something went wrong")
        }
    })
    const remove = trpc.videos.remove.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate()
            toast.success("Video deleted")
            router.push(`/studio`)
        },
        onError: () => {
            toast.error("Something went wrong")
        }
    })
    const restore = trpc.videos.restoreThumbnail.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate()
            utils.studio.getOne.invalidate({ id: videoId })
        },
        onError: () => {
            toast.error("Something went wrong")
        }
    })
    const generateTitle = trpc.videos.genarateTitle.useMutation({
        onSuccess: () => {
            toast.success("Background jop has started", { description: "This may take long" })
        },
        onError: () => {
            toast.error("Something went wrong")
        }
    })
    const generateDescription = trpc.videos.genarateDescription.useMutation({
        onSuccess: () => {
            toast.success("Background jop has started", { description: "This may take long" })
        },
        onError: () => {
            toast.error("Something went wrong")
        }
    })

    const form = useForm<z.infer<typeof videoUpdateSchema>>({
        resolver: zodResolver(videoUpdateSchema),
        defaultValues: video
    })

    const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
        update.mutate(data)
    }

    const fullUrl = `${process.env.VERCEL_URL || "http:localhost:3000"}/videos/${videoId}`
    const [isCopied, setIsCopied] = useState<boolean>(false)


    const onCopy = async () => {
        await navigator.clipboard.writeText(fullUrl)
        setIsCopied(true)

        setTimeout(() => {
            setIsCopied(false)
        }, 2000)
    }

    const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false)


    return (
        <>
            <ThumbnailUploadModal videoId={videoId} open={thumbnailModalOpen} onOpenChange={setThumbnailModalOpen}>

            </ThumbnailUploadModal>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='flex items-center justify-between mb-6'>
                        <div>
                            <h1 className='text-2xl font-bold'>Video Details</h1>
                            <p className='text-xs text-muted-foreground'>Manage Your Videos details</p>
                        </div>

                        <div className='flex items-center gap-x-2'>
                            <Button type='submit' disabled={update.isPending}>
                                Save
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={"ghost"} size={"icon"}>
                                        <MoreVerticalIcon />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='start'>
                                    <DropdownMenuItem onClick={() => remove.mutate({ id: videoId })}>
                                        <TrashIcon className='size-4 mr-2' />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>


                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="space-y-8 lg:col-span-3">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center gap-x-2">
                                            <FormLabel>Title</FormLabel>
                                            <Button variant={"outline"} className="rounded-full size-6 [&_svg]:size-3" disabled={generateTitle.isPending || !video.muxTrackId} size={"icon"} type="button" onClick={() => generateTitle.mutate({ videoId })}>
                                                {generateTitle.isPending ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />}
                                            </Button>
                                        </div>
                                        <FormControl>
                                            <Input {...field} placeholder="Add a title to Your Video" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center gap-x-2">
                                            <FormLabel>Description</FormLabel>
                                            <Button variant={"outline"} className="rounded-full size-6 [&_svg]:size-3" disabled={generateTitle.isPending || !video.muxTrackId} size={"icon"} type="button" onClick={() => generateDescription.mutate({ videoId })}>
                                                {generateDescription.isPending ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />}
                                            </Button>
                                        </div>
                                        <FormControl>
                                            <Textarea  {...field} value={field.value || ""}
                                                placeholder="Enter the description"
                                                rows={10}
                                                className="resize-none pr-10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="thumbnailUrl"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Thumbnail
                                        </FormLabel>
                                        <FormControl>
                                            <div className="p-0.5 border-dashed border-neutral-400 relative h-[84px] w-[153px] group">
                                                <Image
                                                    fill
                                                    alt="thumbnail"
                                                    src={video.thumbnailUrl || "/placeholder.svg"}
                                                    className="object-cover"
                                                />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant={"ghost"} size={"icon"} type="button" className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7">
                                                            <MoreVerticalIcon className="text-white" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" side="right">
                                                        <DropdownMenuItem onClick={() => setThumbnailModalOpen(true)}>
                                                            <ImagePlusIcon className="size-4 mr-1" /> Change
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { }}>
                                                            <SparklesIcon className="size-4 mr-1" /> AI-Generated
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => restore.mutate({ videoId })}>
                                                            <RotateCcwIcon className="size-4 mr-1" /> Restore
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={
                                            field.value ?? undefined
                                        }>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map(category => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-y-8 lg:col-span-2">
                            <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
                                <div className="aspect-video overflow-hidden relative">
                                    <VideoPlayer
                                        playbackId={video.muxPlaybackId}
                                        thumbnailUrl={video.thumbnailUrl}
                                    />
                                </div>
                                <div className="p-4 flex flex-col gap-y-6">
                                    <div className="flex justify-between items-center gap-x-2">
                                        <div className="flex flex-col gap-y-1">
                                            <p className="text-muted-foreground text-xs">Video Link</p>
                                            <div className="flex items-center gap-x-2">
                                                <Link href={`/videos/${video.id}`}>
                                                    <p className="line-clamp-1 text-sm text-blue-500">
                                                        {fullUrl}
                                                    </p>
                                                </Link>
                                                <Button variant={"ghost"} size={"icon"} type="button" className="shrink-0" onClick={onCopy} disabled={isCopied}>
                                                    {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-y-1">
                                            <p className="text-muted-foreground text-xs">
                                                Video Status
                                            </p>
                                            <p className="text-sm">
                                                {snakeCaseToTitle(video.muxStatus || "Preparing")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Visibility</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={
                                            field.value ?? undefined
                                        }>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select visibility" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="private">Private</SelectItem>
                                                <SelectItem value="public">Public</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default FormSection
