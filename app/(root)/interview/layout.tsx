import { ReactNode } from 'react';

const InterviewLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen w-full bg-[#181A20] flex flex-col items-center justify-start">
            {children}
        </div>
    );
};

export default InterviewLayout;
