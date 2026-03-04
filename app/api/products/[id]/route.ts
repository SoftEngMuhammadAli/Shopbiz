import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { badRequest, requireAdmin } from "@/src/lib/api";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ id: string }>;
};

const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (!body?.name) {
    return badRequest("Product name is required");
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name.trim(),
      slug: slugify(body.name),
      description: body.description?.trim() ?? existing.description,
      price: Number(body.price ?? existing.price),
      image: body.image?.trim() ?? existing.image,
      stock: Number(body.stock ?? existing.stock),
      featured: Boolean(body.featured ?? existing.featured),
      categoryId: body.categoryId ?? existing.categoryId,
    },
    include: { category: true },
  });

  return NextResponse.json({ product });
}

export async function DELETE(_: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { id } = await params;

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ message: "Product deleted" });
}


