import { SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import AuthButton from "@/modules/auth/ui/components/auth-button"
import StudioCreateModal from "../studio-create-button"

export const StudioNavbar = () => {
    return (
        <nav
            className="w-full fixed left-0 right-0 top-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border-b shadow-md"
        >
            {/* full width main div in nav */}
            <div className="flex items-center gap-4 w-full">

                {/* holder of sidebartrigger and link  */}
                <div className="flex items-center flex-shrink-0">
                <SidebarTrigger />
                <Link href={"/studio"}>
                <div className="p-4 flex items-center gap-1">
                <Image src={"/logo.svg"} height={32} width={32} alt="logo"/>
                <p className="text-xl font-semibold tracking-tight">Studio</p>
                </div>
                </Link>
                </div>


              <div className="flex-1"></div>

                {/* Auth button div */}
                <div className="flex-shrink-0 items-center flex gap-4">
                    <StudioCreateModal /> 
                    <AuthButton />
                </div>
            </div>
        </nav>
    )

}