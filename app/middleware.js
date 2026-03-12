import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
