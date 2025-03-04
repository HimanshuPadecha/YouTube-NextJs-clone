"use client"

import { SidebarGroup, SidebarGroupContent, SidebarMenu,SidebarMenuButton,SidebarMenuItem } from "@/components/ui/sidebar"
import { FlameIcon, HomeIcon, PlaySquareIcon } from "lucide-react"
import Link from "next/link"
import { useClerk,useAuth } from "@clerk/nextjs"

const  items  = [
    {
        title:"Home",
        url:"/",
        icon:HomeIcon,
    },
    {
        title:"Subscriptions",
        url:"/feed/subscriptions",
        auth:true,
        icon:PlaySquareIcon,
    },
    {
        title:"Tranding",
        url:"/feed/tranding",
        icon:FlameIcon
    },    
]


import React from 'react'

const MainSection = () => {
  const {isSignedIn} = useAuth()
  const clerk = useClerk()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item)=>(
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild isActive={false} onClick={(e)=>{
                if(!isSignedIn && item.auth){
                  e.preventDefault()
                  return clerk.openSignIn()
                }
              }}>
              <Link  href={item.url} className="flex items-center gap-4">
              <item.icon/>
              <span className="text-sm">{item.title}</span>
              </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default MainSection
