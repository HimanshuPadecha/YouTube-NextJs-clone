import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import React from 'react'
import MainSection from './main-section'
import { Separator } from '@/components/ui/separator'
import PersonalSection from './personal-section'
import Link from 'next/link'
import { LogOutIcon } from 'lucide-react'

const StudioSidebar = () => {
  return (
    
    <Sidebar className='pt-16 z-40' collapsible='icon'>
        <SidebarContent className='bg-background'>
            <MainSection />
            <Separator />
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={"Exit Studio"}>
                    <Link href={"/"}>
                    <LogOutIcon className='size-5' />
                    <span className='text-sm'>Exit studio</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
         
  )
}

export default StudioSidebar
