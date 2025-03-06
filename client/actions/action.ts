"use server";

import { adnminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server" ;

export async function createNewDocument() {
    auth.protect();

    const { sessionClaims } = await auth();

    const docCollectiionRef = adnminDb.collection("documents");
    const docRef = await docCollectiionRef.add({
        title: "New Doc"
    })
    await adnminDb.collection('users')
    .doc(sessionClaims?.email!)
    .collection('rooms')
    .doc(docRef.id)
    .set({
        userId: sessionClaims?.email!,
        createdAt: new Date(),
        roomId: docRef.id,
        role: "owner"
    })

    return { docId:docRef.id }
}