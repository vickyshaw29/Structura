'use client'

import { useMyPresence, useOthers } from "@liveblocks/react"
import { PointerEventHandler } from "react";

const LiveCursorProvider = ({children}:{children:React.ReactNode}) => {
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  const handlerPointerMove = (e:any) => {  // add type here
    const cursor = { x : Math.floor(e), y: Math.floor(e.pageY)};
    updateMyPresence({cursor})
  }
  const handlePointerLeave = () => {
    updateMyPresence({cursor:null})
  }
  return (
    <div onPointerMove={handlerPointerMove} onPointerLeave={handlePointerLeave}>
        {/* Render Cursors */}
    </div>
  )
}

export default LiveCursorProvider
