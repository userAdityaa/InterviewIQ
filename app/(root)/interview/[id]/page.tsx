import React from 'react'
import {getInterviewByUserId} from "@/lib/actions/general.action";
import {redirect} from "next/navigation";
import Image from "next/image";
import {getRandomInterviewCover} from "@/lib/utils";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import Agent from "@/components/Agent";
import {getCurrentUser} from "@/lib/actions/auth.action";

const Page = async ({ params }: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser();
    if(!user) redirect('/sign-in');
    const interview = await getInterviewByUserId(id);

    if(!interview) redirect('/')

    return (
        <div className="flex flex-col items-center justify-center h-full border w-full bg-[#181A20] px-0 py-0">
            <div
                className="shadow-lg p-8 mb-2 flex flex-row gap-8 justify-between items-center w-full border backdrop-blur-md bg-white/10"
                style={{
                    background: 'rgba(24, 26, 32, 0.35)',
                }}
            >
                <div className="flex flex-row gap-6 items-center">
                    <Image src={getRandomInterviewCover()} alt="cover-image" width={60} height={60} className="rounded-full object-cover size-[60px]" />
                    <div>
                        <h3 className="capitalize text-green-400 font-bold text-2xl">{interview.role} Interview</h3>
                        <p className="text-xs text-green-300">{interview.type}</p>
                    </div>
                    <DisplayTechIcons techStack={interview.techstack} />
                </div>
            </div>
            <div
                className="shadow-lg p-8 mb-8 w-full backdrop-blur-md bg-white/10"
                style={{
                    background: 'rgba(24, 26, 32, 0.35)',
                }}
            >
                <Agent userName={user?.name || ''} userID={user?.id} interviewId={id} type="interview" questions={interview.questions} interviewStyle={interview.interviewStyle}/>
            </div>
        </div>
    )
}

export default Page