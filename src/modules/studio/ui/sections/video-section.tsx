"use client"
import { InfiniteScroll } from '@/components/infinite-scroll'
import { trpc } from '@/trpc/client'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Table, 
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
 } from '@/components/ui/table'
import Link from 'next/link'
import {format} from "date-fns"
import VideoThumbnail from '@/modules/videos/ui/components/video-thumbnail'
import { snakeCaseToTitle } from '@/lib/utils'
import { Globe2Icon, LockIcon } from 'lucide-react'

const VideosSection = () => {
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery({ limit: 5 }, {
    getNextPageParam: (lastpage) => lastpage.nextCursor
  })
  // console.log(videos);
  

  // const create = trpc.videos.create.useMutation()
  return (
    <Suspense fallback={<p>Loading ...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <div>
          <div className='border-y'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='pl-6 w-[510px]'>
                    Video
                  </TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className='text-right'>Views</TableHead>
                  <TableHead className='text-right'>Comments</TableHead>
                  <TableHead className='text-right pr-6'>Likes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.pages.flatMap((page) => page.items).map((video)=> (
                  <Link href={`/studio/videos/${video.id}`} key={video.id} legacyBehavior>
                    <TableRow className='cursor-pointer'>
                      <TableCell>
                        <div className='flex items-center gap-4 '>
                          <div className='relative aspect-video w-36 shrink-0'>
                              <VideoThumbnail imageUrl={video.thumbnailUrl}
                              previewUrl={video.previewUrl}
                              title={video.title}
                              duration={video.duration}
                              />
                          </div>
                          <div className='flex flex-col overflow-hidden'>
                            <span className='text-sm line-clamp-1'>{video.title}</span>
                            <span className='text-sm line-clamp-1 text-muted-foreground'>{video.description || "No description"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center'>
                          {video.visibility === "private" ? <LockIcon className='size-4 mr-2'/>: <Globe2Icon className='size-4 mr-2' />}
                          {snakeCaseToTitle(video.visibility)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center'>
                          {snakeCaseToTitle(video.muxStatus || "error")}
                        </div>
                      </TableCell>
                      <TableCell className='text-sm truncate'>
                        {format(new Date(video.createdAt),"d MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        views
                      </TableCell>
                      <TableCell>
                        comments
                      </TableCell>
                      <TableCell>
                        Likes
                      </TableCell>
                    </TableRow>
                  </Link>
                ))}
              </TableBody>
            </Table>
          </div>

          <InfiniteScroll 
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          fetchNextPage={query.fetchNextPage}
          isManual
          /> 
        </div>
      </ErrorBoundary>
    </Suspense>
  )
}

export default VideosSection
