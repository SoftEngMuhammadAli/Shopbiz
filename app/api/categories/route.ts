import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { badRequest, requireAdmin } from "@/src/lib/api";

export const runtime = "nodejs";

const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await req.json();
  const name = body?.name?.trim();
  if (!name) return badRequest("Category name is required");

  const category = await prisma.category.create({
    data: {
      name,
      slug: slugify(name),
      description: body?.description?.trim() || null,
      image: body?.image?.trim() || null,
    },
  });

  return NextResponse.json({ category }, { status: 201 });
}
