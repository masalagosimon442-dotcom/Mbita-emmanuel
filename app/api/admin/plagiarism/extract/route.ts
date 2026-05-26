import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  // Auth check
  const res = new NextResponse();
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  if (!session.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF, DOCX, or TXT." },
        { status: 400 }
      );
    }

    let extractedText = "";

    if (file.type === "text/plain") {
      extractedText = await file.text();
    } else if (file.type === "application/pdf") {
      // Basic PDF text extraction — reads raw text content from PDF
      const buffer = Buffer.from(await file.arrayBuffer());
      extractedText = extractTextFromPDF(buffer);
    } else {
      // DOCX — extract text from XML content
      const buffer = Buffer.from(await file.arrayBuffer());
      extractedText = await extractTextFromDOCX(buffer);
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from the document. The file may be scanned/image-based." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text: extractedText, wordCount: extractedText.split(/\s+/).filter(Boolean).length });
  } catch (err) {
    console.error("Plagiarism extract error:", err);
    return NextResponse.json({ error: "Failed to process the document." }, { status: 500 });
  }
}

/**
 * Basic PDF text extraction — extracts readable text strings from PDF binary.
 * For scanned PDFs, an OCR library would be needed.
 */
function extractTextFromPDF(buffer: Buffer): string {
  const content = buffer.toString("latin1");
  const textParts: string[] = [];

  // Extract text between BT (Begin Text) and ET (End Text) operators
  const btEtRegex = /BT\s([\s\S]*?)ET/g;
  let match;
  while ((match = btEtRegex.exec(content)) !== null) {
    const block = match[1];
    // Extract text from Tj and TJ operators
    const tjRegex = /\(([^)]*)\)\s*Tj/g;
    let tjMatch;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      textParts.push(tjMatch[1]);
    }
    // TJ array operator
    const tjArrayRegex = /\[([^\]]*)\]\s*TJ/g;
    let tjArrMatch;
    while ((tjArrMatch = tjArrayRegex.exec(block)) !== null) {
      const items = tjArrMatch[1];
      const strRegex = /\(([^)]*)\)/g;
      let strMatch;
      while ((strMatch = strRegex.exec(items)) !== null) {
        textParts.push(strMatch[1]);
      }
    }
  }

  // Clean up extracted text
  let text = textParts.join(" ");
  // Decode common PDF escape sequences
  text = text.replace(/\\n/g, "\n").replace(/\\r/g, "").replace(/\\\(/g, "(").replace(/\\\)/g, ")").replace(/\\\\/g, "\\");
  // Remove non-printable characters
  text = text.replace(/[^\x20-\x7E\n\r\t]/g, " ");
  // Normalize whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Basic DOCX text extraction — reads text from the XML inside the ZIP.
 */
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  // DOCX is a ZIP file. We'll look for the document.xml content.
  // Simple approach: find XML text content between <w:t> tags
  try {
    // Look for PK signature (ZIP)
    if (buffer[0] !== 0x50 || buffer[1] !== 0x4B) {
      return "";
    }

    // Find document.xml content in the ZIP
    const content = buffer.toString("utf8");
    const textParts: string[] = [];

    // Extract text from <w:t> tags (Word XML text elements)
    const wtRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    let match;
    while ((match = wtRegex.exec(content)) !== null) {
      textParts.push(match[1]);
    }

    // Also try <t> tags
    if (textParts.length === 0) {
      const tRegex = /<t[^>]*>([^<]*)<\/t>/g;
      while ((match = tRegex.exec(content)) !== null) {
        textParts.push(match[1]);
      }
    }

    return textParts.join(" ").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}
