import StudioView from '@/modules/studio/ui/views/studio-view'
import { HydrateClient, trpc } from '@/trpc/server'
import React from 'react'

const Studio =async () => {

  void await trpc.studio.getMany.prefetchInfinite({limit:5})

  return (
    <HydrateClient>
      <StudioView /> 
    </HydrateClient>
  )
}

export default Studio
