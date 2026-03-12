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
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching products",
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, imageUrl, category, stock } = body || {};

    if (!name || !description || !imageUrl || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, description, image URL and category are required",
        },
        { status: 400 },
      );
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { success: false, message: "Price must be a valid non-negative number" },
        { status: 400 },
      );
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      return NextResponse.json(
        { success: false, message: "Stock must be a valid non-negative integer" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const product = await Product.create({
      name: String(name).trim(),
      description: String(description).trim(),
      price: parsedPrice,
      imageUrl: String(imageUrl).trim(),
      category: String(category).trim(),
      stock: parsedStock,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error creating product",
      },
      { status: 500 },
    );
  }
}
