"use client";

import { SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 h-full md:ml-64">
      <Image
        src="/illustration-dashboard.svg"
        alt="Empty Dashboard"
        width={320}
        height={320}
        className="mb-4"
      />
      <h1 className="text-3xl font-bold">Your ideas, structured.</h1>
      <p className="text-muted-foreground mt-2 max-w-md mb-4">
        Create documents, collaborate in real time, and organize your thoughts
        visually — all in one place.
      </p>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition">
            Sign in to get started
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
