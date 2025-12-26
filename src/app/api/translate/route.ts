import { NextRequest, NextResponse } from "next/server";
import { v2 } from "@google-cloud/translate";

// Initialize the Google Translate client
let translateClient: v2.Translate | null = null;

function getTranslateClient() {
  if (!translateClient) {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_TRANSLATE_API_KEY is not configured");
    }

    translateClient = new v2.Translate({
      key: apiKey,
    });
  }

  return translateClient;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");
    const target = searchParams.get("target");
    const source = searchParams.get("source");

    if (!text || !target) {
      return NextResponse.json(
        {
          status: false,
          message: "text and target parameters are required",
          code: 400,
        },
        { status: 400 }
      );
    }

    // Don't translate if source and target are the same
    if (source === target) {
      return NextResponse.json({
        status: true,
        message: "No translation needed",
        data: {
          translatedText: text,
          detectedSource: source || "auto",
        },
        code: 200,
      });
    }

    // Don't translate empty text
    if (!text.trim()) {
      return NextResponse.json({
        status: true,
        message: "Empty text",
        data: {
          translatedText: text,
          detectedSource: source || "auto",
        },
        code: 200,
      });
    }

    const client = getTranslateClient();

    // Perform translation
    const [translation, metadata] = await client.translate(text, {
      from: source || undefined,
      to: target,
    });

    return NextResponse.json({
      status: true,
      message: "Translation successful",
      data: {
        translatedText: translation,
        detectedSource: metadata?.from || source || "auto",
      },
      code: 200,
    });
  } catch (error) {
    console.error("Translation API error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Translation failed",
        code: 500,
      },
      { status: 500 }
    );
  }
}
