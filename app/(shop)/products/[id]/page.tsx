import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/db";
import ProductDetailClient from "@/src/components/ui/product-detail-client";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="page-shell">
      <ProductDetailClient product={product} />
    </div>
  );
}


