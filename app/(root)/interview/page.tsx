import React from 'react'
import Agent from "@/components/Agent";
import {getCurrentUser} from "@/lib/services/auth.action";

const Page = async () => {
    const user = await getCurrentUser();
    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-[#181A20] px-0 py-0">
                <div className="glass-card p-8 mb-8 h-[100vh] w-full flex flex-col items-center backdrop-blur-md" style={{
                    background: 'rgba(24, 26, 32, 0.35)',
                    boxShadow: '0 8px 32px 0 rgba(42,245,152,0.10)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                }}>
                <h3 className="text-green-400 font-bold text-2xl mb-6">Generate an interview Smartly by talking to the AI Interviewer</h3>
                <Agent userName={user?.name || ''} userID={user?.id || ''} type="generate" />
            </div>
        </div>
    )
}
export default Page;