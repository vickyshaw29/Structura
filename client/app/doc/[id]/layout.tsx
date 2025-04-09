import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";
import { ReactNode } from "react";

interface DocLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;

}

export default async function DocLayout({ children, params }: DocLayoutProps) {
  const { userId } = await auth();
  const { id } = await params;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}