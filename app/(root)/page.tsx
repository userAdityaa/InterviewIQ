import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import InterviewSessionCard from "@/components/InterviewSessionCard";
import {getCurrentUser} from "@/lib/services/auth.action";
import {getAllInterviews, getInterviewsByUserId, getLatestInterviews} from "@/lib/services/general.action";


const Page = async () => {
    const user = await getCurrentUser();

    const [userInterviews, latestInterviews] = await Promise.all([
        getAllInterviews(),
        getLatestInterviews({ userID: user?.id! })
    ])


    const hasPastInterviews = userInterviews!.length > 0;
    const hasUpcomingInterviews = latestInterviews!.length > 0;
    return (
        <main className="min-h-screen w-full bg-[#181A20] flex flex-row items-center justify-center px-0 py-0 -mt-[6rem]">
            {/* Left: Headline & CTA */}
            <section className="flex flex-col justify-center gap-6 px-16 py-24 w-[60rem]">
                <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
                    Ace Your Next Interview<br/>
                    <span className="text-green-400">with AI Guidance</span>
                </h1>
                <p className="text-2xl text-gray-300 mb-4">Practice. Get Feedback. Land Your Dream Job.</p>
                <Button asChild className="bg-green-400 hover:bg-green-500 text-black font-bold rounded-full px-12 py-6 text-2xl shadow-lg w-fit mb-2">
                    <Link href="/interview">Create an Interview</Link>
                </Button>
                <div className="flex flex-row gap-4 mt-2 mb-2 items-center">
                    <Image src="/google.svg" width={32} height={32} alt="Google" />
                    <Image src="/microsoft.svg" width={32} height={32} alt="Microsoft" />
                    <Image src="/spotify.svg" width={32} height={32} alt="Spotify" />
                </div>
            </section>
            {/* Center: Robot Image */}
            <section className="flex flex-col items-center justify-center w-[30%] min-w-[400px]">
                <Image src="/robot.png" alt="AI Robot" width={1100} height={1100} priority className="drop-shadow-2xl w-[50rem] scale-150" />
            </section>
            {/* Right: Interviews Sidebar - scrollable when content overflows */}
            <aside className="flex flex-col px-12 pt-32 pb-24 w-[32%] min-w-[500px] max-w-[540px] h-screen overflow-hidden">
                <h2 className="text-3xl font-bold text-white mb-6 flex-shrink-0">Your Interviews</h2>
                <div className="flex flex-col gap-10 overflow-y-auto overflow-x-hidden pr-2 flex-1">
                    {hasPastInterviews ? (
                        userInterviews?.map((interview) => (
                            <InterviewSessionCard {...interview} key={interview.id} />
                        ))
                    ) : (
                        <p className="text-gray-400">You haven't taken any interviews yet.</p>
                    )}
                </div>
            </aside>
        </main>
    )
}

export default Page