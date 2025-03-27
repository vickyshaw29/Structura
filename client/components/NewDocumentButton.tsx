'use client';

import { useTransition } from "react";
import { Button } from "./ui/button"
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/actions/action";

const NewDocumentButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handlerCreateNewDocument = () => {
    startTransition(async()=> {
        const { docId } = await createNewDocument();
        router.push(`/doc/${docId}`)
    })
  }
  return (
    <Button disabled={isPending} onClick={handlerCreateNewDocument}>
       {isPending ? 'Creating...': 'New Document'}
    </Button>
  )
}

export default NewDocumentButton
