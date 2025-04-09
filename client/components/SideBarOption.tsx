'use client'
import { db } from "@/firebase";
import Link from "next/link";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SideBarOption = ({href, id, onClick}:{href:string; id:string, onClick?:()=>void}) => {
  const docRef = doc(db, "documents", id);
  const [data, loading, error] = useDocumentData(docRef);
  const pathname = usePathname();
  const isActive = href.includes(pathname) && pathname !== "/";

  if(!data) return null ;

  return (
    <Link href={href} onClick={onClick}>
    <div
      className={cn(
        "w-full px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors truncate mb-2",
        isActive
          ? "bg-gray-200 font-semibold text-black"
          : "hover:bg-gray-100 text-gray-700"
      )}
    >
       {data.title || "Untitled"}
    </div>
  </Link>
  )
}

export default SideBarOption
