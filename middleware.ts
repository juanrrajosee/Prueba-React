// middleware.ts
import { auth } from "@/lib/auth";

export default auth((req) => {
});

export const config = {
  matcher: [
    "/:locale/cuidador/:path*",
    "/:locale/maestro/:path*",
  ],
};
