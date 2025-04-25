import "@/styles/embla.css";
import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Slide, ToastContainer } from "react-toastify";

import { auth } from "@/server/auth";
import NextAuthProvider from "@/components/HOC/NextAuthProvider";
import ProgressBarProvider from "@/components/HOC/ProgressBarProvider";

export const metadata: Metadata = {
  title: "Rewize.",
  description: "Rewize.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={`${geist.variable}`}>
      <NextAuthProvider session={session}>
        <body className="bg-background">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Slide}
          />

          <ProgressBarProvider>{children}</ProgressBarProvider>
        </body>
      </NextAuthProvider>
    </html>
  );
}
