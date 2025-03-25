
'use client'
import { LiveList } from '@liveblocks/client'
import { ClientSideSuspense, RoomProvider as RoomWrapperProvider} from '@liveblocks/react/suspense'
import LoadingSpinner from './LoadingSpinner'
import LiveCursorProvider from './LiveCursorProvider'

const RoomProvider = ({roomId, children}: {roomId:string, children:React.ReactNode}) => {
  return (
    <RoomWrapperProvider id={roomId} initialPresence={{
        cursor:null
    }}
    >
        <ClientSideSuspense fallback={<LoadingSpinner/>}>
            <LiveCursorProvider>
                {children}
            </LiveCursorProvider>
        </ClientSideSuspense>
    </RoomWrapperProvider>
  )
}

export default RoomProvider
