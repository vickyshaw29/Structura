"use client";

import { MenuIcon } from "lucide-react";
import NewDocumentButton from "./NewDocumentButton";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignedIn, useUser } from "@clerk/nextjs";
import { collection, DocumentData, query } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import SideBarOption from "./SideBarOption";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

const Sidebar = () => {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({ owner: [], editor: [] });

  const userEmail = user?.emailAddresses?.[0]?.emailAddress;

  const queryRooms = userEmail
    ? query(collection(db, `users/${userEmail}/rooms`))
    : null;

  const [data] = useCollection(queryRooms);

  useEffect(() => {
    if (!data) return;

    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;
        if (roomData.role === "owner") {
          acc.owner.push({ id: curr.id, ...roomData });
        } else {
          acc.editor.push({ id: curr.id, ...roomData });
        }
        return acc;
      },
      { owner: [], editor: [] }
    );

    setGroupedData(grouped);
  }, [data]);

  const SidebarContent = (
    <div className="space-y-6 p-4">
      <NewDocumentButton />
      <div className="space-y-2">
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 text-sm font-semibold">
            No documents found
          </h2>
        ) : (
          <>
            <h2 className="text-gray-500 text-sm font-semibold">
              My Documents
            </h2>
            {groupedData.owner.map((doc) => (
              <SideBarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </>
        )}
      </div>
      {groupedData.editor.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-gray-500 text-sm font-semibold">
            Shared with me
          </h2>
          {groupedData.editor.map((doc) => (
            <SideBarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <SignedIn>
      <div className="relative">
        {/* Mobile Sidebar (Drawer) */}
        <div className="md:hidden p-4">
          <Sheet>
            <SheetTrigger asChild>
              <MenuIcon
                className="p-2 hover:opacity-70 rounded-lg cursor-pointer"
                size={40}
              />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader />
              <ScrollArea className="h-full">{SidebarContent}</ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-64 md:h-screen md:fixed md:top-0 md:left-0  bg-white">
          <ScrollArea className="h-full w-full">{SidebarContent}</ScrollArea>
        </aside>
      </div>
    </SignedIn>
  );
};

export default Sidebar;
