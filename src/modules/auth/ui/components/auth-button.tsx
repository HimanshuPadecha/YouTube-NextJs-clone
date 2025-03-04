"use client"
import { UserButton,SignInButton,SignedIn,SignedOut } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'


import { ClapperboardIcon, UserCircleIcon } from 'lucide-react'
import React from 'react'

const AuthButton = () => {
  return (
    <>
    <SignedIn>
      <UserButton > 
        <UserButton.MenuItems>
          <UserButton.Link label='Studio' href='/studio' labelIcon={<ClapperboardIcon  className='size-4'/>}>
          </UserButton.Link>
        </UserButton.MenuItems>
      </UserButton>
    </SignedIn>
    <SignedOut>
      <SignInButton mode='modal'>
      <Button variant={"outline"}
     className='px-4 py2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounder-full shadow-none '>
        <UserCircleIcon />
        Sign in
    </Button>
      </SignInButton>
    </SignedOut>
    
    </>
    
  )
}

export default AuthButton
