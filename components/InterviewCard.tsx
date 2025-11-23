import React from 'react'
import dayjs from 'dayjs'
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import {getFeedbackByInterviewId} from "@/lib/actions/general.action";

const InterviewCard = async ({ id, userID, role, type, techstack, createdAt }: InterviewCardProps) => {
    const feedback= userID && id
        ? await getFeedbackByInterviewId({ interviewId: id, userID}) : null;
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY')
    return (
        <div
            className="relative p-8 w-[400px] max-sm:w-full min-h-96 flex flex-col justify-between rounded-2xl"
            style={{
                background: 'linear-gradient(135deg, #23272F 0%, #181A20 100%)',
                border: '2px solid #2AF598',
                boxShadow: '0 0 0 4px #23272F, 0 8px 32px rgba(42,245,152,0.10)',
            }}
        >
            <div className="flex flex-row items-center gap-4 mb-2">
                <Image src={getRandomInterviewCover()} alt="cover-image" width={60} height={60} className="rounded-full object-fit size-[60px]"/>
                <div>
                    <h3 className="capitalize text-green-400 font-bold text-xl">{role} Interview</h3>
                    <p className="text-xs text-green-300">{normalizedType}</p>
                </div>
            </div>
            <div className="flex flex-row gap-4 justify-between items-center mt-2">
                <div className="flex flex-row gap-2 items-center">
                    <Image src="/calendar.svg" width={18} height={18} alt="calendar"/>
                    <span className="text-xs text-gray-300">{formattedDate}</span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Image src="/star.svg" width={18} height={18} alt="star" />
                    <span className="text-xs text-green-400 font-semibold">{feedback?.totalScore || "---"}/100</span>
                </div>
            </div>
            <p className="line-clamp-2 mt-4 text-base text-gray-200">
                {feedback?.finalAssessment || "You haven't taken this interview yet. Take it now to improve your skills."}
            </p>
            <div className="flex flex-row justify-between items-center mt-4">
                <DisplayTechIcons techStack={techstack} />
                <Button className="bg-[#B5F5EC] text-black font-bold px-6 py-2 rounded-full shadow-md hover:bg-[#2AF598]/80">
                    <Link
                        href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}
                    >
                        {feedback ? "Check Feedback" : "View Interview"}
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export default InterviewCard;