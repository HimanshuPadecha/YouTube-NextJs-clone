import React, { Suspense } from 'react'
import FormSection from '../sections/form-section'
import { ErrorBoundary } from 'react-error-boundary'
import { Skeleton } from '@/components/ui/skeleton'

interface pageProps {
    videoId: string
}

const VideoView = ({ videoId }: pageProps) => {
    return (
        <Suspense fallback={ <VideoDetailsSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <div className='max-w-screen-lg px-4 pt-2.5 '>
                    <FormSection videoId={videoId} />
                </div>
            </ErrorBoundary>

        </Suspense>
    )
}

export default VideoView

// function VideoDetailsSkeleton() {
//     return (
//         <div className="w-full">
//             <div className='flex items-center justify-between mb-6'>
//                 <div>
//                     <Skeleton className="h-8 w-[250px] mb-2" />
//                     <Skeleton className="h-4 w-[180px]" />
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//                 <div className="space-y-8 lg:col-span-3">
//                     {/* Title Skeleton */}
//                     <div className="space-y-2">
//                         <div className="flex items-center gap-x-2">
//                             <Skeleton className="h-6 w-16" />
//                             <Skeleton className="rounded-full size-6" />
//                         </div>
//                         <Skeleton className="h-10 w-full" />
//                     </div>

//                     {/* Description Skeleton */}
//                     <div className="space-y-2">
//                         <div className="flex items-center gap-x-2">
//                             <Skeleton className="h-6 w-24" />
//                             <Skeleton className="rounded-full size-6" />
//                         </div>
//                         <Skeleton className="h-40 w-full" />
//                     </div>

//                     {/* Thumbnail Skeleton */}
//                     <div className="space-y-2">
//                         <Skeleton className="h-6 w-20 mb-2" />
//                         <div className="relative h-[84px] w-[153px]">
//                             <Skeleton className="absolute inset-0" />
//                         </div>
//                     </div>

//                     {/* Category Skeleton */}
//                     <div className="space-y-2">
//                         <Skeleton className="h-6 w-16 mb-2" />
//                         <Skeleton className="h-10 w-full" />
//                     </div>
//                 </div>

//                 <div className="flex flex-col gap-y-8 lg:col-span-2">
//                     {/* Video Player Skeleton */}
//                     <div className="bg-[#F9F9F9] rounded-xl overflow-hidden">
//                         <Skeleton className="aspect-video" />
//                         <div className="p-4 space-y-4">
//                             <div className="space-y-2">
//                                 <Skeleton className="h-4 w-24" />
//                                 <div className="flex items-center gap-x-2">
//                                     <Skeleton className="h-5 w-48" />
//                                     <Skeleton className="size-8 rounded-full" />
//                                 </div>
//                             </div>
//                             <div className="space-y-2">
//                                 <Skeleton className="h-4 w-24" />
//                                 <Skeleton className="h-5 w-36" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Visibility Skeleton */}
//                     <div className="space-y-2">
//                         <Skeleton className="h-6 w-20 mb-2" />
//                         <Skeleton className="h-10 w-full" />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

function VideoDetailsSkeleton() {
    return (
      <div>
        <form>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-3 w-64 mt-2" />
            </div>
  
            
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="space-y-8 lg:col-span-3">
              {/* Title Field */}
              <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
  
              {/* Description Field */}
              <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <Skeleton className="h-40 w-full" />
              </div>
  
              {/* Thumbnail Field */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <div className="p-0.5 border-dashed border-neutral-400 relative h-[84px] w-[153px]">
                  <Skeleton className="h-full w-full" />
                </div>
              </div>
  
              {/* Category Field */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
  
            <div className="flex flex-col gap-y-8 lg:col-span-2">
              {/* Video Preview Section */}
              <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4 flex flex-col gap-y-6">
                  <div className="flex justify-between items-center gap-x-2">
                    <div className="flex flex-col gap-y-1 w-full">
                      <Skeleton className="h-3 w-20" />
                      <div className="flex items-center gap-x-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Visibility Field */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }