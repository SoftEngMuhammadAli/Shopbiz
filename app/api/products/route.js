import { NextResponse } from "next/server";
import Product from "../../lib/models/product.model";
import connectToDatabase from "@/app/lib/config/db";

export async function GET() {
  try {
    await connectToDatabase();

    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching products",
      },
      { status: 500 },
    );
  }
}
