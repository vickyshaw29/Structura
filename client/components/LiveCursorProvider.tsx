"use client";

import { useMyPresence, useOthers } from "@liveblocks/react";
import FollowPointer from "./FollowPointer";

const LiveCursorProvider = ({ children }: { children: React.ReactNode }) => {
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  const handlerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) };
    updateMyPresence({ cursor });
  };

  const handlePointerLeave = () => {
    updateMyPresence({ cursor: null });
  };

  return (
    <div onPointerMove={handlerPointerMove} onPointerLeave={handlePointerLeave}>
      {/* Render Cursors */}
      {others
        ?.filter((other) => other.presence.cursor !== null)
        ?.map(({ connectionId, presence, info }) => {
          console.log({ presence }, "presence");
          return (
            <FollowPointer
              key={connectionId}
              info={info}
              x={presence.cursor?.x!}
              y={presence.cursor?.y!}
            />
          );
        })}
      {children}
    </div>
  );
};

export default LiveCursorProvider;
