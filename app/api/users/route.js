import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/config/db";
import User from "@/app/lib/models/user.model";

export async function GET() {
  try {
    await connectToDatabase();

    const users = await User.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 },
    );
  }
}
