import React from 'react'
import { Button,ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface pageProps {
    onClick:ButtonProps["onClick"]
    disabled:boolean
    isSubscribed:boolean
    className?:string
    size?:ButtonProps["size"]
}

const SubscriptionButton = ({
    disabled,
    isSubscribed,
    onClick,
    className,
    size
} : pageProps) => {
  return (
    <Button 
    size={size}
    variant={isSubscribed ? "secondary" : "default"}
    className={cn("rounded-full",className)}
    onClick={onClick}
    disabled={disabled}
    >
        {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  )
}

export default SubscriptionButton
