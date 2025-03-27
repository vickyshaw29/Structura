"use client"
import { MenuIcon } from "lucide-react";
import NewDocumentButton from "./NewDocumentButton";
import { useCollection } from "react-firebase-hooks/firestore"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@clerk/nextjs";
import { collection, collectionGroup, DocumentData, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import SideBarOption from "./SideBarOption";

interface RoomDocument extends DocumentData {
  createdAt: string;
  role:"owner" | "editor";
  roomId: string;
  userId: string;
}

const Sidebar = () => {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{owner: RoomDocument[]; editor:RoomDocument[]}>({owner:[], editor:[]})
  

  const userEmail = user?.emailAddresses?.[0]?.emailAddress; // Get the user's email safely

  const queryRooms = userEmail 
    ? query(collection(db, `users/${userEmail}/rooms`)) 
    : null;
  

  const [data, loading, error] = useCollection(queryRooms);
  useEffect(()=>{
    if(!data) return;
    const grouped = data?.docs?.reduce<{owner: RoomDocument[];editor:RoomDocument[];}>((acc, curr)=>{
      const roomData = curr.data() as RoomDocument;
      if(roomData.role === "owner"){
        acc.owner.push({
          id: curr.id,
          ...roomData
        })
      }else{
        acc.editor.push({
          id:curr.id,
          ...roomData   
        })
      }
      return acc;
  }, { owner: [], editor: [] });
  setGroupedData(grouped);
  },[data])  


  
  const menuOptions = ( 
    <>
      <NewDocumentButton/>
      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        {groupedData?.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm">No documents found</h2>
        ):(
          <>
            <h2 className="text-gray-500 font-semibold text-sm">My Documents</h2> 
            {groupedData?.owner?.map((doc, index)=>(
              <SideBarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}  
          </>
        )}
      </div>
      {/* Shared with me */}
      {groupedData?.editor?.length >0 && (
        <>
          <h2 className="text-gray-500 font-semibold text-sm">Shared with me</h2>
          {groupedData?.editor?.map((doc)=>(
              <SideBarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
          ))}
        </>
      )}
    </>
  )


  useEffect(()=>{
    if(!data){
      return;
    }

    const grouped = data.docs.reduce<{owner: RoomDocument[];editor:RoomDocument[];}>((acc, curr)=>{
      const roomData = curr.data() as RoomDocument;
      console.warn({roomData})
      if(roomData.role === "owner"){
        acc.owner.push({
          id: curr.id,
          ...roomData
        })
      }else{
        acc.editor.push({
          id:curr.id,
          ...roomData
        })
      }
      return acc;
    }, { owner: [], editor: [] });

    setGroupedData(grouped);
  },[data])

  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <Sheet>
        <SheetTrigger className="md:hidden">
          <MenuIcon className="p-2 hover:opacity-30 rounded-lg cursor-pointer" size={40}/>
        </SheetTrigger>
        <SheetContent className="" side="left">
        <SheetTitle></SheetTitle>
          <SheetHeader>
            {/* <SheetTitle>Menu</SheetTitle> */}
            <div className="">
                {menuOptions}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div className="hidden md:flex flex-col">{menuOptions}</div>
    </div>
  );
};

export default Sidebar;
