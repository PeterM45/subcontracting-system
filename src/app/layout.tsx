import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";

import { TRPCReactProvider } from "~/trpc/react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Subcontracting System",
  description: "For FM",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <ClerkProvider>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <SidebarProvider>
              <AppSidebar />
              <SidebarTrigger />
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </SidebarProvider>
          </SignedIn>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
