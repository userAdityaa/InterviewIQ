import { ReactNode } from 'react'
import {isAuthenticated} from "@/lib/services/auth.action";
import {redirect} from "next/navigation";

const AuthLayout= async ({ children } : { children: ReactNode })=>  {
    const isUserAuthenticated = await isAuthenticated();

    if(isUserAuthenticated) redirect('/');

    return (
        <div className="min-h-screen w-full bg-[#181A20] flex items-center justify-center">{children}</div>
    )
}

export default AuthLayout