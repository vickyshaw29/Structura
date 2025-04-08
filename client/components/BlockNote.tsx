
import * as Y from 'yjs';
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import { BlockNoteView } from '@blocknote/shadcn'
import { BlockNoteEditor } from '@blocknote/core'
import { useCreateBlockNote } from "@blocknote/react"
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css"
import { stringToColor } from '@/lib/stringToColor';
import { useSelf } from '@liveblocks/react/suspense';
import { ScrollArea } from "@/components/ui/scroll-area"


const BlockNote = ({doc, provider, darkMode}:{doc:Y.Doc, provider:LiveblocksYjsProvider, darkMode:boolean}) => {
  const userInfo = useSelf((me)=>me.info)
  const editor:BlockNoteEditor = useCreateBlockNote({
    collaboration:{
        provider,
        fragment: doc?.getXmlFragment('document-store'),
        user:{
            name:userInfo?.name,
            color: stringToColor(userInfo?.email)
        }
    }
  })
  return (
    <ScrollArea className='relative h-[80vh] max-w-6xl mx-auto'>
        <BlockNoteView
            className="h-full flex-1 !bg-primary"
            editor={editor}
            theme={darkMode ? "dark" :"light"}
        />
    </ScrollArea>
  )
}

export default BlockNote
