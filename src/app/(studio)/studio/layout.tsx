import { StudioLayout } from '@/modules/studio/ui/layouts/studio-layout'
import React from 'react'

interface pageProps{
    children: React.ReactElement
}

const Layout = ({children}:pageProps) => {
  return (
    <StudioLayout>
        {children}
    </StudioLayout>
  )
}

export default Layout
