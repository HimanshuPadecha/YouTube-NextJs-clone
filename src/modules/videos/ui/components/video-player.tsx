"use client"
import React from 'react'
import MuxPlayer from "@mux/mux-player-react"

interface pageProps {
    playbackId?:string | null,
    autoPlay?:boolean,
    onPlay?:() => void,
    thumbnailUrl?:string | null
}

const VideoPlayer = ({
    playbackId,
    thumbnailUrl,
    autoPlay,
    onPlay
} : pageProps) => {

    if(!playbackId) return null
  return (
    <MuxPlayer playbackId={playbackId}
    poster={thumbnailUrl || "/placeholder.svg"}
    playerInitTime={0}
    autoPlay={autoPlay}
    thumbnailTime={0}
    className='w-full h-full object-contain'
    accentColor="#FF2056"
    onPlay={onPlay}
    />
  )
}

export default VideoPlayer
