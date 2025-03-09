import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const UserInfoVarients = cva("flex items-center gap-1", {
    variants: {
        size: {
            default: "[&_p]:text-sm [&_svg]:size-4",
            lg: "[&_p]:text-base [&_svg]:size-5 [&_p]:font-medium [&_p]:text-black",
            sm: "[&_p]:text-xs [&_svg]:size-3.5",
        }
    },
    defaultVariants: {
        size: "default"
    }
})

interface userInfoProps extends VariantProps<typeof UserInfoVarients> {
    name: string
    className?: string
}

const UserInfo = ({
    name,
    className,
    size
}: userInfoProps) => {
    return (
        <div className={cn(UserInfoVarients({ size, className }))}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <p className='text-gray-500 hover:text-gray-800 line-clamp-1'>
                        {name}
                    </p>
                </TooltipTrigger>
                <TooltipContent align='center' className='bg-black/70 '>
                    <p>{name}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}

export default UserInfo
