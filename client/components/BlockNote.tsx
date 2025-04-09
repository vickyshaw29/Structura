import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { stringToColor } from "@/lib/stringToColor";
import { useSelf } from "@liveblocks/react/suspense";
import { ScrollArea } from "@/components/ui/scroll-area";
import { forwardRef, useImperativeHandle } from "react";

const BlockNote = forwardRef(
  (
    {
      doc,
      provider,
      darkMode,
    }: { doc: Y.Doc; provider: LiveblocksYjsProvider; darkMode: boolean },
    ref
  ) => {
    const userInfo = useSelf((me) => me.info);
    const editor: BlockNoteEditor = useCreateBlockNote({
      collaboration: {
        provider,
        fragment: doc?.getXmlFragment("document-store"),
        user: {
          name: userInfo?.name,
          color: stringToColor(userInfo?.email),
        },
      },
    });

    useImperativeHandle(ref, () => ({
      getHTML: async () => {
        const fullHTML = await editor.blocksToFullHTML(editor.document);
        
        // Optional: Extract only the <body> content
        const bodyMatch = fullHTML.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const innerHTML = bodyMatch ? bodyMatch[1] : fullHTML;
    
        return innerHTML;
      },
    }));
    

    return (
      <ScrollArea className="relative h-[80vh] max-w-6xl mx-auto pb-50">
        <BlockNoteView
          className="h-full flex-1 !bg-primary"
          editor={editor}
          theme={darkMode ? "dark" : "light"}
        />
      </ScrollArea>
    );
  }
);

export default BlockNote;
