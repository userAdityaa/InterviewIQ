import { ReactNode } from 'react'
import Link from "next/link";
import Image from "next/image";
import {isAuthenticated} from "@/lib/services/auth.action";
import { redirect } from "next/navigation";
import { logout } from "@/lib/services/auth.action";

const RootLayout= async ({ children } : { children: ReactNode })=>  {
    const isUserAuthenticated = await isAuthenticated();

    if(!isUserAuthenticated) redirect('/sign-in');
    return (
        <div className="min-h-screen w-full bg-[#181A20] flex flex-col items-center justify-start fixed">
            <nav className="flex items-center justify-between w-full px-12 py-8 z-[100] shadow-lg bg-[#181A20]/90 backdrop-blur-md" style={{ position: 'sticky', top: 0 }}>
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/ai-avatar.png" alt="logo" width={50} height={50} />
                </Link>
                <form action={logout}>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-full bg-[#B5F5EC] text-black font-semibold hover:bg-[#2AF598]/80 transition"
                    >
                        Logout
                    </button>
                </form>
            </nav>
            {children}
        </div>
    )
}

export default RootLayout