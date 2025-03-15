import { Avatar } from '@/components/ui/avatar'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useUser, useClerk } from '@clerk/nextjs'
import { trpc } from '@/trpc/client'
import { commentsInsertSchema } from '@/db/schema'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

interface pageProps {
    videoId: string
    onSuccess?: () => void
}

const CommentForm = ({ videoId, onSuccess }: pageProps) => {

    const formSchema = commentsInsertSchema.omit({ userId: true })

    const utils = trpc.useUtils()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            videoId,
            value: ""
        }
    })

    const clerk = useClerk()
    const create = trpc.comments.create.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId })
            form.reset()
            toast.success("comment added")
            onSuccess?.()
        },
        onError: (error) => {
            toast.error("Something went wrong")
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        create.mutate(values)
    }

    const { user } = useUser()


    return (
        <Form {...form}>
            <form className='flex gap-4 group' onSubmit={form.handleSubmit(handleSubmit)}>
                <Avatar>
                    <AvatarImage src={user?.imageUrl || "./fallback.svg"} />
                    <AvatarFallback>{user?.fullName}</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                    <FormField
                        control={form.control}
                        name='value'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder='add a comment..'
                                        className='resize-none bg-transparent overflow-hidden min-h-0'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='justify-end gap-2 mt-2 flex'>
                        <Button type='submit' disabled={create.isPending}>
                            Comment
                        </Button>
                    </div>
                </div>

            </form>
        </Form>
    )
}

export default CommentForm
