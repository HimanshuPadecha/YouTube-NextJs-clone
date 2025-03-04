import { SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import SearchInput from "./search-input"
import AuthButton from "@/modules/auth/ui/components/auth-button"

export const HomeNavbar = () => {
    return (
        <nav
            className="w-full fixed left-0 right-0 top-0 h-16 bg-white flex items-center px-2 pr-5 z-50"
        >
            {/* full width main div in nav */}
            <div className="flex items-center gap-4 w-full">

                {/* holder of sidebartrigger and link  */}
                <div className="flex items-center flex-shrink-0">
                <SidebarTrigger />
                <Link href={"/"}>
                <div className="p-4 flex items-center gap-1">
                <Image src={"/logo.svg"} height={32} width={32} alt="logo"/>
                <p className="text-xl font-semibold tracking-tight">Youtube</p>
                </div>
                </Link>
                </div>


                {/* search bar holder  */}
                <div className="flex-1 flex justify-center max-w-[720px] mx-auto ">
                    <SearchInput />
                </div>

                {/* Auth button div */}
                <div className="flex-shrink-0 items-center flex gap-4">
                    <AuthButton />
                </div>
            </div>
        </nav>
    )

}