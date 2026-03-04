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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const q = searchParams.get("q");

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category: { slug: category } } : {}),
      ...(featured === "true" ? { featured: true } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await req.json();

  const required = ["name", "description", "price", "image", "stock", "categoryId"];
  for (const key of required) {
    if (body?.[key] === undefined || body?.[key] === null || body?.[key] === "") {
      return badRequest(`Missing field: ${key}`);
    }
  }

  const product = await prisma.product.create({
    data: {
      name: body.name.trim(),
      slug: slugify(body.name),
      description: body.description.trim(),
      price: Number(body.price),
      image: body.image.trim(),
      stock: Number(body.stock),
      featured: Boolean(body.featured),
      categoryId: body.categoryId,
    },
    include: { category: true },
  });

  return NextResponse.json({ product }, { status: 201 });
}


