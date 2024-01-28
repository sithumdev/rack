import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { url } from "inspector";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabse = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabse.auth.getSession();

  console.log(session);

  if (!session) {
    return NextResponse.rewrite(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
