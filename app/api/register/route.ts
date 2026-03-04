import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { hashPassword } from "@/src/lib/password";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = body?.name?.trim();
    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password;

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json(
        {
          error: "Name, valid email, and password (min 6 chars) are required.",
        },
        { status: 400 },
      );
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 409 },
      );
    }

    const userCount = await prisma.user.count();
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
        role: userCount === 0 ? "ADMIN" : "USER",
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to register user." },
      { status: 500 },
    );
  }
}
