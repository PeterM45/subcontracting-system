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
    <ClerkProvider>
      <html lang="en" className={GeistSans.variable}>
        <body>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <SidebarProvider>
              <TRPCReactProvider>
                <AppSidebar />
                <main className="w-full max-w-none">
                  <SidebarTrigger />
                  <div className="p-10">{children}</div>
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
