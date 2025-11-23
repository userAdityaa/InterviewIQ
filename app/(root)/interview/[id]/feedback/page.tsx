import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/services/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/services/auth.action";

const Page = async ({ params }: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser();

    const interview = await getInterviewById(id);
    if (!interview) redirect("/");

    const feedback = await getFeedbackByInterviewId({
        interviewId: id,
        userID: user?.id!,
    });

    return (
        <section className="flex flex-col items-center justify-center min-h-screen w-full bg-[#181A20]">
            <div className="w-full p-10 flex flex-col gap-8 shadow-xl overflow-y-auto min-h-[80vh] max-h-[80vh]">
                <h1 className="text-4xl font-bold text-center mb-2 text-white">
                    Feedback: <span className="capitalize text-green-400">{interview.role}</span> Interview
                </h1>
                <div className="flex flex-row items-center justify-center gap-8">
                    <div className="flex flex-col items-center p-6 gap-2 border border-green-400 bg-white/10">
                        <Image src="/star.svg" width={32} height={32} alt="star" />
                        <span className="text-2xl font-bold text-green-400">{feedback?.totalScore}/100</span>
                        <span className="text-xs text-gray-400">Overall Impression</span>
                    </div>
                    <div className="flex flex-col items-center p-6 gap-2 border border-green-400 bg-white/10">
                        <Image src="/calendar.svg" width={32} height={32} alt="calendar" />
                        <span className="text-lg font-semibold text-green-300">{feedback?.createdAt ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A") : "N/A"}</span>
                        <span className="text-xs text-gray-400">Date</span>
                    </div>
                </div>
                <div className="p-6 mt-4 border border-green-400 bg-white/10">
                    <h2 className="text-xl font-semibold mb-2 text-green-400">Final Assessment</h2>
                    <p className="text-lg text-gray-300">{feedback?.finalAssessment}</p>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                    <h2 className="text-lg font-bold text-green-400">Breakdown of the Interview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {feedback?.categoryScores?.map((category, index) => (
                            <div key={index} className="p-4 flex flex-col gap-2 border border-green-400 bg-white/10">
                                <span className="font-bold text-green-400">{category.name}</span>
                                <span className="text-sm text-gray-300">Score: {category.score}/100</span>
                                <span className="text-xs text-gray-400">{category.comment}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 border border-green-400 bg-white/10 min-h-[200px] flex flex-col">
                        <h3 className="text-lg font-bold text-green-400 mb-2 flex items-center gap-2">
                            <Image src="/star.svg" width={20} height={20} alt="strength" /> Strengths
                        </h3>
                        <ul className="list-disc list-inside text-gray-300">
                            {feedback?.strengths?.map((strength, index) => (
                                <li key={index} className="text-zinc-400">{strength}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-4 border border-green-400 bg-white/10 min-h-[200px] flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-red-400">Areas for Improvement</span>
                        </div>
                        <ul className="list-disc list-inside text-gray-300">
                            {feedback?.areasForImprovement?.map((area, index) => (
                                <li key={index} className="text-zinc-400 rounded-none">{area}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-row gap-4 mt-8 justify-center">
                    <Button className="px-8 py-3 rounded-none font-bold text-lg">
                        <Link href="/" className="flex w-full justify-center">
                            Back to dashboard
                        </Link>
                    </Button>
                    <Button className="px-8 py-3 rounded-none font-bold text-lg">
                        <Link href={`/interview/${id}`} className="flex w-full justify-center">
                            Retake Interview
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Page;