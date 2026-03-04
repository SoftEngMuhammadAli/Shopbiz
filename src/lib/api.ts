import { NextResponse } from "next/server";
import { getAuthSession } from "@/src/lib/auth";

export const unauthorized = (message = "Unauthorized") =>
  NextResponse.json({ error: message }, { status: 401 });

export const forbidden = (message = "Forbidden") =>
  NextResponse.json({ error: message }, { status: 403 });

export const badRequest = (message = "Bad request") =>
  NextResponse.json({ error: message }, { status: 400 });

export const requireAuth = async () => {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return { error: unauthorized() };
  }
  return { session };
};

export const requireAdmin = async () => {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return { error: unauthorized() };
  }
  if (session.user.role !== "ADMIN") {
    return { error: forbidden() };
  }
  return { session };
};

