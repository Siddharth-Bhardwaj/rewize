export { auth as middleware } from "./server/auth";

export const config = {
  matcher: [
    "/auth/:path*",
    "/profile/:path*",
    "/merchant/:path*",
    "/add-card/:path*",
    "/dashboard/:path*",
    "/how-to-use/:path*",
  ],
};
