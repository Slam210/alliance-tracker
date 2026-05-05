import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PASSWORD = "your-password-here";

export function middleware(req: NextRequest) {
  const authCookie = req.cookies.get("auth")?.value;

  // Allow already authenticated users
  if (authCookie === "true") {
    return NextResponse.next();
  }

  // Check password from query string
  const url = req.nextUrl;
  const password = url.searchParams.get("password");

  if (password === PASSWORD) {
    const res = NextResponse.next();

    // Set cookie so they stay logged in
    res.cookies.set("auth", "true", {
      httpOnly: true,
      path: "/",
    });

    return res;
  }

  // Block access → simple password prompt page
  return new NextResponse(
    `
      <html>
        <body style="font-family: sans-serif; text-align:center; margin-top:100px;">
          <h2>Protected Site</h2>
          <p>Enter password by adding ?password=YOUR_PASSWORD to the URL</p>
        </body>
      </html>
    `,
    { headers: { "Content-Type": "text/html" } }
  );
}

export const config = {
  matcher: "/:path*",
};
