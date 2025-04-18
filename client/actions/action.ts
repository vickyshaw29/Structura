"use server";

import { adminnDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server" ;
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import puppeteerBundled from 'puppeteer';


export async function createNewDocument() {
    auth.protect();

    const { sessionClaims } = await auth();

    if(!sessionClaims?.email) {
        throw new Error("No email found in session");
    }

    const docCollectiionRef = adminnDb.collection("documents");
    const docRef = await docCollectiionRef.add({
        title: "New Doc"
    })
    await adminnDb.collection('users')
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


export async function deleteDocument(roomId:string){
    auth.protect();
    // console.log("deleteDocument", roomId);
    
    try {
        await adminnDb.collection("documents").doc(roomId).delete();
        const query = await adminnDb.collectionGroup("rooms").where("roomId" , "==", roomId).get();
        const batch = adminnDb.batch();
        query.docs.forEach((doc)=>{
            batch.delete(doc.ref);
        });
        await batch.commit();
        await liveblocks.deleteRoom(roomId);
        return {success:true};
    } catch (error) {
        console.log(error);
        return {success:false};
    }
}

export async function inviteUserToDocument (roomId:string, email:string){
    auth.protect();

    try {
        await adminnDb
        .collection("users")
        .doc(email)
        .collection("rooms")
        .doc(roomId)
        .set({
            userId:email,
            role:'editor',
            createdAt: new Date(),
            roomId
        })
        return {success:true};
    } catch (error) {
        console.log(error);
        return {success:false};
    }
}

export async function removeUserFromDocument(roomId:string, email:string){
    auth.protect();
    try {
        await adminnDb
        .collection("users")
        .doc(email)
        .collection("rooms")
        .doc(roomId)
        .delete();

        return {success:true}
    } catch (error) {
        console.log(error);
        return {success:false}
    }
}


export async function exportPdfFromHtml(html: string): Promise<string> {
    try {
      const isLocal = !process.env.VERCEL;
  
      const browser = await (isLocal ? puppeteerBundled : puppeteer).launch({
        args: isLocal ? [] : chromium.args,
        defaultViewport: isLocal ? null : chromium.defaultViewport,
        executablePath: isLocal
          ? undefined
          : await chromium.executablePath(),
        headless: true,
      });
  
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
  
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '15mm',
          right: '15mm',
        },
      });
  
      await browser.close();
      return Buffer.from(pdfBuffer).toString('base64');
    } catch (err) {
      console.error('Error inside exportPdfFromHtml:', err);
      throw err;
    }
  }