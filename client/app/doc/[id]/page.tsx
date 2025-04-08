"use client";

import Document from "@/components/Document";
import { useParams, useSearchParams } from "next/navigation";

const DocumentPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();


  return <div className="flex flex-col flex-1">
    <Document id={params?.id as string}/>
  </div>;
};

export default DocumentPage;
