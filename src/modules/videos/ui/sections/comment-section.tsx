"use client"
import { trpc } from '@/trpc/client'
import CommentForm from '@/modules/comments/ui/components/comments-form'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import CommentItem from '@/modules/comments/ui/components/comment-item'
import { InfiniteScroll } from '@/components/infinite-scroll'
import { Loader2Icon } from 'lucide-react'

interface pageProps {
    videoId: string
}

const CommentSectionSkeleton = () => {
    return (
        <div className='flex items-center justify-center mt-6'>
            <Loader2Icon className='animate-spin text-muted-foreground size-7' />
        </div>
    )
}

const CommentSection = ({ videoId }: pageProps) => {

    const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery({ videoId, limit: 5 },
        {
            getNextPageParam: (page) => page.nextCursor
        }
    )
    return (
        <Suspense fallback={<CommentSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <div className='mt-6'>
                    <div className='flex flex-col gap-6'>
                        <h1 className='text-xl font-bold'>
                            {comments.pages[0].totalComments} comments
                        </h1>
                        <CommentForm videoId={videoId} />
                    </div>
                    <div className='flex flex-col gap-4 mt-2'>
                        {comments.pages.flatMap(page => page.items).map(comment => <CommentItem key={comment.id} comment={comment} />)}
                        <InfiniteScroll
                            isManual
                            hasNextPage={query.hasNextPage}
                            isFetchingNextPage={query.isFetchingNextPage}
                            fetchNextPage={query.fetchNextPage}
                        />
                    </div>
                </div>
            </ErrorBoundary>
        </Suspense>
    )
}

export default CommentSection
