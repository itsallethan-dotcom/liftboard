import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 "proxy" (formerly middleware). Optimistic owner-only gate for the
 * command center surface. This is the UX layer (redirect/401 before render);
 * hard authorization is also enforced in the page (requireOwnerPage) and in
 * every protected route handler (requireOwnerApi) per Next.js guidance.
 */
function ownerEmails(): string[] {
  return (process.env.FORGEONIX_OWNER_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = !!user && ownerEmails().includes((user.email ?? "").toLowerCase());
  if (isOwner) return response;

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: user ? "Forbidden" : "Unauthorized" },
      { status: user ? 403 : 401 },
    );
  }

  const url = request.nextUrl.clone();
  if (!user) {
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
  } else {
    url.pathname = "/";
    url.searchParams.set("denied", "1");
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/command/:path*",
    "/api/os/:path*",
    "/api/career/:path*",
    "/api/ai/:path*",
  ],
};
