import React, { Suspense } from 'react'
import FormSection from '../sections/form-section'
import { ErrorBoundary } from 'react-error-boundary'

interface pageProps {
    videoId: string
}

const VideoView = ({ videoId }: pageProps) => {
    return (
        <Suspense fallback={<p>Loading ...</p>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <div className='max-w-screen-lg px-4 pt-2.5 '>
                    <FormSection videoId={videoId} />
                </div>
            </ErrorBoundary>

        </Suspense>
    )
}

export default VideoView
