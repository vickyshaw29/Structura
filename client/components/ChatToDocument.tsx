"use client";
import * as Y from "yjs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { BotIcon, MessageCircleCode, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatToDocument = ({ doc }: { doc: Y.Doc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState("");
  const [summary, setSummary] = useState("");

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuestion(input);
    startTransition(async () => {
      try {
        const documentData = doc.get("document-store").toJSON();

        // console.log({ documentData: documentData }, "documentData");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              documentData,
              question: input,
            }),
          }
        );

        if (res.ok) {
          const { message } = await res.json();
          // console.log(message, "response from cloudflare");
          setInput("");
          setSummary(message);
        } else {
          const errorText = await res.text();
          console.error("Translation failed:", errorText);
          toast.error("Translation failed. Please try again.");
        }
      } catch (error) {
        console.error("An error occurred while translating:", error);
        toast.error("Something went wrong.");
      }
    });
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"}>
          <MessageCircleCode />
          <span className="max-md:text-xs">ChatToDocument</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Chat to Document</AlertDialogTitle>
        {question && <p className="mt-5 text-gray-500">Q : {question}</p>}
        {summary && (
          <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 bg-gray-100 p-2 rounded-md">
            <div className="flex items-center gap-2">
              <BotIcon className="w-5 h-5 shrink-0" />
              <p className="text-sm text-gray-600">GPT Says:</p>
            </div>
            {isPending ? (
              <p>Thinking...</p>
            ) : (
              <>
                {typeof summary === "string" && (
                  <div className="prose max-w-none">
                    <Markdown children={summary} remarkPlugins={[remarkGfm]} />
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <Button
          className="absolute right-0 top-0"
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </Button>
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <Input
            type="text"
            placeholder="i.e What is this about ?"
            className="w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" disabled={isPending || !input?.length}>
            {isPending ? "Asking..." : "Ask"}
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChatToDocument;
