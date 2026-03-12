import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "./lib/models/user.model";
import connectToDatabase from "./lib/config/db";
import { authConfig } from "./authConfig";

export const authOptions = {
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectToDatabase();

        const user = await User.findOne({
          email: String(credentials.email).toLowerCase().trim(),
        });

        if (!user) {
          return null;
        }

        if (!user.password) {
          return null;
        }

        let isPasswordValid = false;
        try {
          isPasswordValid = await bcrypt.compare(
            String(credentials.password),
            String(user.password),
          );
        } catch {
          return null;
        }

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          img: user.img,
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
};
