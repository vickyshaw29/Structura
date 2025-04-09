"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import CollaborativeEditor from "./CollaborativeEditor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";

const Document = ({ id }: { id: string }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isUpdating, startTransition] = useTransition();
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const isOwner = useOwner();

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: inputValue,
        });
      });
    }
  };

  useEffect(() => {
    if (data) {
      setInputValue(data.title);
    }
  }, [data]);

  return (
    <div className="flex-1 h-full bg-white p-4 sm:p-5 md:ml-64 ">
      {/* it should be a floating header and content which is  CollaborativeEditor should go below it i mean should scroll below it*/}
      <div className="sticky top-0 z-10 bg-white pb-4 sm:pb-5">
        <div className="flex max-w-6xl mx-auto justify-between pb-5">
          <form
            className="flex flex-1 items-center gap-4"
            onSubmit={updateTitle}
          >
            {/* Update title */}
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className=""
            />
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating" : "Update"}
            </Button>
            {/* if isOwner && invideUser, Delete Document */}
            <div className=" hidden md:flex space-x-2">
              {isOwner && (
                <>
                  {/* Invite User */}
                  <InviteUser />
                  {/* Delete Document */}
                  <DeleteDocument />
                </>
              )}
            </div>
          </form>
        </div>
        <div className=" md:hidden flex justify-between  mb-4">
          {isOwner && (
            <>
              {/* Invite User */}
              <InviteUser />
              {/* Delete Document */}
              <DeleteDocument />
            </>
          )}
        </div>
        <div className="flex max-w-6xl mx-auto justify-between items-center mb-5 max-md:gap-10">
          {/* ManageUsers */}
          <ManageUsers />
          {/* Avatars */}
          <Avatars />
        </div>

        <hr className="pb-4 md:pb-10 max-w-6xl mx-auto mt-4" />
      </div>

      {/* Collaborative editor */}
      <div className="max-h-[calc(100vh-200px)] sm:px-2">
        <CollaborativeEditor />
      </div>
    </div>
  );
};

export default Document;
