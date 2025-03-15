import { toast } from "sonner";

import { useClerk } from "@clerk/nextjs";
import { trpc } from "@/trpc/client";

interface arguments{
    userId: string
    isSubscribed : boolean
    fromVideoId : string
}

export const useSubscriptions = ({
    fromVideoId,
    isSubscribed,
    userId
} : arguments) => {

    const clerk = useClerk()

    const utils = trpc.useUtils()

    const subscribe = trpc.subscription.create.useMutation({
        onSuccess:() => {
            toast.success("subscribed")

            if(fromVideoId){
                utils.videos.getOne.invalidate({ videoId : fromVideoId })
            }
        },
        onError:(error) => {
            toast.error("Something went wrong")

            if(error.data?.code === "UNAUTHORIZED"){
                clerk.openSignIn()
            }
        }
    })

    const unsubscribe = trpc.subscription.remove.useMutation({
        onSuccess:() => {
            toast.success("unsubscribed")

            if(fromVideoId){
                utils.videos.getOne.invalidate({ videoId : fromVideoId })
            }
        },
        onError:(error) => {
            toast.error("Something went wrong")
            console.log(error);
            

            if(error.data?.code === "UNAUTHORIZED"){
                clerk.openSignIn()
            }
        }
    })

    const isPending = subscribe.isPending || unsubscribe.isPending

    const onClick = () => {
        if(isSubscribed) {
            unsubscribe.mutate({userId})
        }else{
            subscribe.mutate({userId})
        }
    }

    return { isPending, onClick}
}