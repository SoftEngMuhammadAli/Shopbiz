import { withAuth } from "next-auth/middleware";

export default withAuth(function proxy() {}, {
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;
      if (path.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      if (path.startsWith("/checkout") || path.startsWith("/orders")) {
        return !!token;
      }
      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*", "/orders/:path*"],
};
