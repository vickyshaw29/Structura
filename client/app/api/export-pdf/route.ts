import { NextRequest, NextResponse } from "next/server";
import { exportPdfFromHtml } from "@/actions/action";

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();
    if (!html) {
      console.error("No HTML received");
      return NextResponse.json({ error: "Missing HTML" }, { status: 400 });
    }

    const base64 = await exportPdfFromHtml(html);
    return NextResponse.json({ base64 });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}