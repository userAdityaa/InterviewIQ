'use client';

import React, {useEffect, useState} from 'react'
import Image from 'next/image'
import { cn } from "@/lib/utils";
import {useRouter} from "next/navigation";
import { vapi } from '@/lib/vapi.sdk';
import {id} from "zod/locales";
import {interviewer} from "@/constants";
import {createFeedback} from "@/lib/actions/general.action";

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface SavedMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

interface AgentProps {
  userName: string;
  userID: string;
  type: "generate" | "interview";
  interviewId?: string;
  questions?: string[];
  interviewStyle?: string;
}

const SmartAgent = ({userName, userID, type, interviewId, questions, interviewStyle}: AgentProps) => {
        const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
        const videoRef = React.useRef<HTMLVideoElement>(null);

        useEffect(() => {
            if (!videoStream && typeof window !== 'undefined') {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        setVideoStream(stream);
                        if (videoRef.current) {
                            videoRef.current.srcObject = stream;
                        }
                    })
                    .catch(err => {
                        setVideoStream(null);
                    });
            } else if (videoRef.current && videoStream) {
                videoRef.current.srcObject = videoStream;
            }
            return () => {
                if (videoStream) {
                    videoStream.getTracks().forEach(track => track.stop());
                }
            };
        }, [videoStream]);
    const router = useRouter();
    const [isSpeaking, setIsSpeaking]= useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessage = (message: Message) => {
            if(message.type === 'transcript' && message.transcriptType === 'final'){
                const newMessage = {role: message.role, content: message.transcript};

                setMessages((prev) => [...prev, newMessage]);
            }
        }

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => console.log('Error', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError);
        }
    }, [])

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        console.log('Generate feedback here.');

        const { success, feedbackId: id } = await createFeedback({
            interviewId: interviewId!,
            userID: userID!,
            transcript: messages
        });

        if(success && id) {
            router.push(`/interview/${interviewId}/feedback`);
        } else {
            console.log('Error saving feedback');
            router.push('/');
        }
    }

    useEffect(() => {
        if(callStatus === CallStatus.FINISHED){
            if(type === 'generate') {
                router.push('/')
            } else {
                handleGenerateFeedback(messages);
            }
        }
    }, [messages, callStatus, type, userID]);

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        if (type === "generate") {
            await vapi.start(
                undefined,
                undefined,
                undefined,
                process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
                {
                    variableValues: {
                        username: userName,
                        userid: userID,
                    },
                }
            );
        } else {
            let formattedQuestions = ''

            if(questions) {
                formattedQuestions = questions
                    .map((question) => `- ${question}`)
                    .join('\n');
            }
            await vapi.start(interviewer, {
                variableValues: {
                    questions: formattedQuestions,
                    interviewStyle: interviewStyle || "fast",
                }
            })
        }
    };

    const handleDisconnect = async () => {
        setCallStatus(CallStatus.FINISHED);

        vapi.stop();
    }

    const lastestMessage = messages[messages.length - 1]?.content;
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

    return (
        <>
            <div className="call-view">
                <div className="card-interviewer">
                    <div className="">
                        <Image src="/ai_robo.png" alt="AI Interviewer" width={250} height={54} className="object-cover"/>
                        {isSpeaking && <span className="animate-speak"/>}
                    </div>
                    <h3 className="text-white">AI Interviewer</h3>
                </div>
                <div className="w-[30rem] h-[25rem]">
                    <div className="card-content flex flex-col items-center justify-center">
                        {videoStream ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                width={120}
                                height={120}
                                className="rounded-full object-cover size-[120px] border-2 border-green-400"
                            />
                        ) : (
                            <button
                                className="bg-green-400 text-black px-4 py-2 rounded-full font-bold"
                                onClick={() => {
                                    navigator.mediaDevices.getUserMedia({ video: true })
                                        .then(stream => {
                                            setVideoStream(stream);
                                            if (videoRef.current) {
                                                videoRef.current.srcObject = stream;
                                            }
                                        });
                                }}
                            >
                                Enable Video
                            </button>
                        )}
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
            {messages.length > 0 && (
                <div className="mt-[2rem]">
                    <div className="transcript">
                        <p key={lastestMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fade opacity-100')}>
                            {lastestMessage}
                        </p>
                    </div>
                </div>
            )}
            <div className="w-full flex justify-center mt-[2rem]">
                {callStatus !== 'ACTIVE' ? (
                    <button className="relative btn-call mt-[2rem] flex items-center justify-center" onClick={handleCall}>
                        <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')}/>
                        { isCallInactiveOrFinished ? (
                            <span>Start</span>
                        ) : (
                            <span>. . .</span>
                        )}
                    </button>
                ) : (
                    <button className="btn-disconnect" onClick={handleDisconnect}>
                        End
                    </button>
                )}
            </div>
        </>
    )
}
export default SmartAgent;