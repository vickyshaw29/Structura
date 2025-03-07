"use client";

import Document from "@/components/Document";
import { useParams, useSearchParams } from "next/navigation";

const DocumentPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  console.log({ params, searchParams });

  return <div className="flex flex-col flex-1 min-h-screen">
    <Document id={params?.id as string}/>
  </div>;
};

export default DocumentPage;
