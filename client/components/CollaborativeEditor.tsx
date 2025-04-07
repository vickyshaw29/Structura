'use client'

import { useRoom } from "@liveblocks/react";
import { useEffect, useState } from "react";
import * as Y from 'yjs';
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import BlockNote from "./BlockNote";

const CollaborativeEditor = () => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(()=>{
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return()=>{
        yDoc.destroy();
        yProvider.destroy();
    }
  },[])
  
  return (
    <div className="max-w-6xl mx-auto h-full b">
        <div className="flex items-center gap-2 justify-end mb-10 ">
            {/* Translating document ai */}
            {/* Chat tp document ai */}

            {/* Dark Mode */}
            <Button
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all
            ${darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900"}
          `}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </Button>
        </div>
        {/* BlackNote */}
        {doc && provider ? <BlockNote doc={doc} provider={provider} darkMode={darkMode} /> : <p>Loading...</p>}

    </div>
  )
}

export default CollaborativeEditor