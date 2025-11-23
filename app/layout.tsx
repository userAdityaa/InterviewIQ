import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InterviewIQ | Mock Interview Platform",
  description: "InterviewIQ is your AI-powered companion for mastering mock interviews, personalized feedback, and real-time coaching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.className} antialiased`} 
        style={{ backgroundImage: 'url(/pattern.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      >
        {children}
        <Toaster position="top-center" toastOptions={{
          className: 'sonner-toast text-white',
        }} />
      </body>
    </html>
  );
}
