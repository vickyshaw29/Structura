"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { useRoom } from "@liveblocks/react";
import { useUser } from "@clerk/nextjs";
import useOwner from "@/lib/useOwner";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "sonner";
import { removeUserFromDocument } from "@/actions/action";
import { X } from "lucide-react";

const ManageUsers = () => {
  const { user } = useUser();
  const room = useRoom();
  const isOwner = useOwner();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room?.id))
  )
  const handleDelete = async (userId:string) => {
    startTransition(async () => {
      if(!user) return;
      const { success } = await removeUserFromDocument(room?.id, userId);
      if (success) {
        setIsOpen(false);
        toast.success("User removed successfully!");
      } else {
        toast.error("Failed to removed user!");
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"}>Users ({usersInRoom?.docs?.length})</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
          <AlertDialogHeader>
            <h2 className="text-lg font-semibold">Users With Access</h2>
            <p className="text-sm text-gray-500">
              Below is a list of users who have access to this document.
            </p>
          </AlertDialogHeader>
          <Button className="absolute right-0 top-0" variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        <hr className="my-2"/>
        <div className="flex flex-col space-y-4">
            {/* Map through users in the room */}
            {usersInRoom?.docs?.map((doc)=>(
                <div key={doc?.data()?.userId}
                    className="flex items-center justify-between"
                >
                    <p className="font-light">
                        {doc?.data()?.userId ===  user?.emailAddresses[0]?.toString()? `You(${doc?.data()?.userId})` : doc?.data()?.userId}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant={"outline"}>{doc?.data()?.role}</Button>
                        {isOwner && doc?.data().userId !== user?.emailAddresses[0]?.toString() && (
                            <Button
                                variant={"destructive"}
                                onClick={()=>handleDelete(doc?.data()?.userId)}
                                disabled={isPending}
                                size={"sm"}
                            >
                                {isPending ? "Removing": "X"}
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ManageUsers;
