import type { VercelRequest, VercelResponse } from "@vercel/node";

type AppsScriptResponse = unknown;

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Unknown error";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "method_not_allowed",
    });
  }

  try {
    const scriptUrl = process.env.APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return res.status(500).json({
        success: false,
        error: "missing_env_var",
        message: "APPS_SCRIPT_URL is not defined",
      });
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    let data: AppsScriptResponse;

    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        success: false,
        error: "invalid_apps_script_response",
        raw: text,
      });
    }

    return res.status(200).json(data);
  } catch (err: unknown) {
    console.error("Proxy error:", err);

    return res.status(500).json({
      success: false,
      error: "proxy_error",
      message: getErrorMessage(err),
    });
  }
}
