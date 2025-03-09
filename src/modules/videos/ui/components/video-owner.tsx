import React from 'react'
import { VideoGetOneOutput } from '../../types'
import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import SubscriptionButton from '@/modules/subscription/ui/components/subscription-button'
import UserInfo from '@/modules/users/ui/components/user-info'

interface pageProps {
    user: VideoGetOneOutput["user"]
    videoId: string
}

const VideoOwner = ({ user, videoId }: pageProps) => {

    const { userId: userClerkId } = useAuth()

    return (
        <div className='flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0'>
            <Link href={`/users/${user.id}`}>
                <div className='flex text-muted-foreground items-center gap-3 min-w-0'>
                    <Avatar>
                        <AvatarImage src={user.imageUrl} alt='user-image' />
                        <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-1 min-w-0'>
                        <UserInfo
                            name={user.name}
                            size={"lg"}
                        />
                        <span>
                            {0} Subscribers
                        </span>
                    </div>
                </div>
            </Link>
            {userClerkId === user.clerkId ?
                <Button className='rounded-full' asChild variant={"secondary"}>
                    <Link href={`/studio/videos/${videoId}`}>
                        Edit video
                    </Link>
                </Button> :
                <SubscriptionButton
                    onClick={() => { }}
                    disabled={false}
                    isSubscribed={false}
                    className='flex-none'
                />
            }
        </div>
    )
}

export default VideoOwner
