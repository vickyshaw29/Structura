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
import html2pdf from "html2pdf.js";
import { DownloadIcon } from "lucide-react";

const CollaborativeEditor = () => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);
  const blockNoteRef = useRef<any>(null);

  const downloadPDF = async () => {
    if (!blockNoteRef.current?.getHTML) {
      console.warn("Editor ref missing or getHTML not available.");
      return;
    }

    try {
      const htmlContent = await blockNoteRef.current.getHTML();

      // Create a container div for PDF rendering
      const container = document.createElement("div");
      container.innerHTML = htmlContent;
      container.style.padding = "2rem";
      container.style.backgroundColor = "#ffffff";
      container.style.color = "#000000";
      container.style.fontFamily = "Inter, sans-serif";

      // Inject a style tag to override unsupported color functions
      const style = document.createElement("style");
      style.innerHTML = `
        * {
          color: initial !important;
          background-color: initial !important;
          border-color: initial !important;
        }
        [style*="oklch"] {
          color: #000 !important;
          background-color: #fff !important;
          border-color: #ccc !important;
        }
      `;
      container.prepend(style);

      document.body.appendChild(container);

      await html2pdf()
        .set({
          margin: 0.5,
          filename: "document.pdf",
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(container)
        .save();

      document.body.removeChild(container);
    } catch (err) {
      console.error("Failed to download PDF:", err);
    }
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
          <DownloadIcon className="h-4 w-4" />
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
