"use client";

import { useState, useTransition } from "react";
import * as Y from "yjs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { BotIcon, LanguagesIcon, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


type Language =
  | "english"
  | "spanish"
  | "portuguese"
  | "french"
  | "german"
  | "chinese"
  | "arabic"
  | "hindi"
  | "russian"
  | "japanese";

const languages: Language[] = [
  "english",
  "spanish",
  "portuguese",
  "french",
  "german",
  "chinese",
  "arabic",
  "hindi",
  "russian",
  "japanese",
];

const TranslateDocument = ({ doc }: { doc: Y.Doc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [language, setLanguage] = useState<string>("");
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const documentData = doc.get("document-store").toJSON();

        console.log({ documentData: documentData }, "documentData");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              documentData,
              target_lang: language,
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          console.log(data, "response from cloudflare");
          setSummary(data.translated_text);

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
          <LanguagesIcon className="hidden md:block"/>
              <span className="max-md:text-xs">Translate</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Translate the Document</AlertDialogTitle>
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

        {question && <p className="mt-5 text-gray-500">Q : {question}</p>}
        <Button
          className="absolute right-0 top-0"
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </Button>
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Language" />
            </SelectTrigger>
            <SelectContent>
              {languages?.map((lang) => (
                <SelectItem key={lang} value={lang} defaultValue={"english"}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isPending || !language}>
            {isPending ? "Translating..." : "Translate"}
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TranslateDocument;
