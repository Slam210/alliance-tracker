import { NextResponse } from "next/server";

type AppsScriptResponse = unknown;

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Unknown error";
}

export async function POST(req: Request) {
  try {
    console.log("Proxy route hit");

    const scriptUrl = process.env.API_SCRIPT_URL;

    const body = await req.json();

    const response = await fetch(scriptUrl!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify(body),
    });

    const text = await response.text();

    let data: AppsScriptResponse;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "invalid_apps_script_response",
          raw: text,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "proxy_error",
        message: getErrorMessage(err),
      },
      { status: 500 },
    );
  }
}
