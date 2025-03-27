"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { deleteDocument, inviteUserToDocument } from "@/actions/action";
import { toast } from "sonner";
import { Input } from "./ui/input";

const InviteUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState<string>('')
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const handleInvite = async (e:FormEvent) => {
    e.preventDefault();

    const roomId = pathname?.split("/").pop();
    if (!roomId) return;

    startTransition(async () => {
      const { success } = await inviteUserToDocument(roomId, email!);
      if (success) {
        setIsOpen(false);
        setEmail('')
        toast.success("User added to the room successfullyu!");
      } else {
        toast.error("Failed to add the user!");
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"}>Invite</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {/* <AlertDialogFooter>
          <Button 
            onClick={handleDelete} 
            variant="destructive"
            disabled={isPending}
          >
            {isPending ? "Inviting..." : "Invite"}
          </Button>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter> */}
        <form onSubmit={handleInvite} className="flex gap-2">
            <Input
                type="email"
                placeholder="Email"
                className="w-full"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />
            <Button type="submit" disabled={isPending || !email}>
                {isPending ? 'Inviting...' : 'Invite'}
            </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InviteUser;
