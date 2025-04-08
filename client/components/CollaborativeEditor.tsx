"use client";

import { useRoom } from "@liveblocks/react";
import { useEffect, useState, useRef } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import BlockNote from "./BlockNote";
import TranslateDocument from "./TranslateDocument";
import ChatToDocument from "./ChatToDocument";

const CollaborativeEditor = () => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc.destroy();
      yProvider.destroy();
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto h-full b z-50">
      <div className="flex items-center gap-2 justify-evenly md:justify-end mb-10">
        {/* Translating document ai */}
        <TranslateDocument doc={doc!} />
        {/* Chat to document ai */}
        <ChatToDocument doc={doc!} />

        {/* Dark Mode */}
        <Button
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all
            ${
              darkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900"
            }
          `}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </Button>
      </div>
      {/* BlackNote */}
      {doc && provider ? (
        <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CollaborativeEditor;
