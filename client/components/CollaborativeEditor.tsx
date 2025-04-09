"use client";

import { useRoom } from "@liveblocks/react";
import { useEffect, useState, useRef, useTransition } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import BlockNote from "./BlockNote";
import TranslateDocument from "./TranslateDocument";
import ChatToDocument from "./ChatToDocument";
import { DownloadIcon } from "lucide-react";
import { Loader } from "lucide-react";




const CollaborativeEditor = () => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);
  const [isPending, startTransition] = useTransition();
  const blockNoteRef = useRef<any>(null);

  const downloadPDF = () => {
    if (!blockNoteRef.current) return;
  
    startTransition(async () => {
      const rawHTML = await blockNoteRef.current.getHTML();
  
      const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>PDF Document</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
          <style>
            @font-face {
              font-family: 'NotoColorEmoji';
              src: url("https://cdn.jsdelivr.net/npm/twemoji-colr-font@14.0.2/twemoji.woff2") format("woff2");
            }
      
            * {
              box-sizing: border-box;
            }
      
            html, body {
              font-family: 'Inter', 'NotoColorEmoji', 'Segoe UI Emoji', sans-serif;
              font-size: 14px;
              padding: 40px;
              margin: 0;
              color: #111;
              line-height: 1.6;
            }
      
            h1, h2, h3 {
              font-weight: 600;
              margin-top: 1.5em;
            }
      
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          ${rawHTML}
        </body>
      </html>
      `;
  
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: fullHTML }),
      });
  
      const data = await res.json();
      if (!res.ok || !data.base64) {
        console.error("PDF generation failed", data);
        return;
      }
      const base64 = data.base64;
  
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  };


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
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={downloadPDF}
        >
          {isPending ? <Loader className="animate-spin"/> : <DownloadIcon className="h-4 w-4" />}
        </Button>

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
        <BlockNote
          doc={doc}
          provider={provider}
          darkMode={darkMode}
          ref={blockNoteRef}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CollaborativeEditor;
