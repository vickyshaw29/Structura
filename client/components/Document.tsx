"use client"

import { FormEvent, useEffect, useState, useTransition } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore"
import CollaborativeEditor from "./CollaborativeEditor"
import useOwner from "@/lib/useOwner"
import DeleteDocument from "./DeleteDocument"

const Document = ({id}:{id:string}) => {
  const [inputValue, setInputValue] = useState<string>("")
  const [isUpdating, startTransition] = useTransition();
  const [data, loading, error] = useDocumentData(doc(db, "documents", id))
  const isOwner = useOwner();

  const updateTitle = (e:FormEvent) => {
    e.preventDefault();
    if(inputValue.trim()){
      startTransition(async()=>{
        await updateDoc(doc(db, "documents", id), {
        title: inputValue
        })
      })
    }
  }

  useEffect(()=>{
    if(data){
      setInputValue(data.title)
    }
  }, [data])

  return (
    <div>
       <div className="max-w-6xl mx-auto justify-between pb-5">
          <form className="flex flex-1 space-x-2 items-center" onSubmit={updateTitle}>
              {/* Update title */}
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-white border-none"
              />
              <Button type="submit" disabled={isUpdating}>{isUpdating ? 'Updating' : 'Update'}</Button>
              {/* if isOwner && invideUser, Delete Document */}
              {isOwner && (
                <>
                  {/* Invite User */}
                  {/* Delete Document */}
                  <DeleteDocument/>
                </>
              )}
          </form>
       </div>
        <div>
            {/* ManageUsers */}

            {/* Avatars */}
        </div>

        {/* Collaborative editor */}
        <CollaborativeEditor/>
    </div>
  )
}

export default Document
