import { adminnDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
      auth.protect(); // Ensure the user is authenticated
  
      const { sessionClaims } = await auth();
      const { room } = await req.json();
      if (!sessionClaims?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      const session = liveblocks.prepareSession(sessionClaims.email, {
        userInfo: {
          name: sessionClaims.fullName || "Unknown",
          email: sessionClaims.email,
          avatar: sessionClaims.image || "",
        },
      });
  
      const usersInRoom = await adminnDb
      .collectionGroup("rooms") // collectionGroup allows searching across all "rooms" subcollections
      .where("userId", "==", sessionClaims.email)
      .get();
      const userInRoom = usersInRoom.docs.find((doc) => {
        return doc.id === room
      });
      if (userInRoom?.exists) {
        session.allow(room, session.FULL_ACCESS);
        const { body, status } = await session.authorize();
  
        return new Response(body, { status });
      } else {
        return NextResponse.json(
          { message: "You are not allowed in this room" },
          { status: 403 }
        );
      }
    } catch (error:any) {
      console.error("Auth Endpoint Error:", error);
      return NextResponse.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 }
      );
    }
  }