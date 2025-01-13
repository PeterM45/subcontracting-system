import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/ui/app-sidebar";

import { TRPCReactProvider } from "~/trpc/react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import React from "react";

export const metadata: Metadata = {
  title: "Subcontracting System",
  description: "For FM",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={GeistSans.variable}>
        <body>
          <SignedOut>
            <div className="flex h-screen items-center justify-center text-3xl">
              <SignInButton />
            </div>
          </SignedOut>
          <SignedIn>
            <SidebarProvider>
              <TRPCReactProvider>
                <AppSidebar />
                <main className="w-full max-w-none">
                  <SidebarTrigger />
                  <div className="p-10">
                    {children}
                    {modal}
                  </div>
                </main>
              </TRPCReactProvider>
            </SidebarProvider>
          </SignedIn>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
