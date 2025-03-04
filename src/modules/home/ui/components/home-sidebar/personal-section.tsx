"use client"

import { SidebarGroup, SidebarGroupContent, SidebarMenu,SidebarMenuButton,SidebarMenuItem } from "@/components/ui/sidebar"
import {  HistoryIcon,  ListVideoIcon,  ThumbsUpIcon } from "lucide-react"
import Link from "next/link"
import { useClerk,useAuth } from "@clerk/nextjs"


const  items  = [
    {
        title:"History",
        url:"/playlists/history",
        icon:HistoryIcon,
        auth:true
    },
    {
        title:"Liked Videos",
        url:"/playlists/liked",
        auth:true,
        icon:ThumbsUpIcon,
    },
    {
        title:"All Playlists",
        url:"/playlists",
        icon:ListVideoIcon,
        auth:true
    },    
]


import React from 'react'

const PersonalSection = () => {
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

export default PersonalSection
