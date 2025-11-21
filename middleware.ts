// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  // Obtener locale desde la URL
  const locale = pathname.split("/")[1] || "es";

  // Rutas protegidas
  const protectedRoutes = [
    `/${locale}/cuidador`,
    `/${locale}/maestro`,
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    const session = await auth();

    if (!session) {
      // Si NO hay sesión -> redirigir al login con el locale correcto
      return NextResponse.redirect(
        new URL(`/${locale}/login`, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*).*)"],
};
