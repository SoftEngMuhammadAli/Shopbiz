const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

dotenv.config();

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set.");
  }

  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();

  try {
    const db = client.db();
    const now = new Date();

    await db.collection("OrderItem").deleteMany({});
    await db.collection("Order").deleteMany({});
    await db.collection("Product").deleteMany({});
    await db.collection("Category").deleteMany({});
    await db.collection("User").deleteMany({});

    const categoriesData = [
      { name: "Electronics", description: "Smart devices and accessories" },
      { name: "Fashion", description: "Everyday style for all seasons" },
      { name: "Home", description: "Upgrade your living space" },
      { name: "Sports", description: "Performance essentials" },
      { name: "Books", description: "Explore new worlds and ideas" },
      { name: "Toys", description: "Fun for kids of all ages" },
      {
        name: "Beauty",
        description: "Skincare, makeup, and wellness products",
        image:
          "https://images.unsplash.com/photo-1581521902279-39a64c8b0c4d?auto=format&fit=crop&w=1200&q=80",
      },
    ];

    const categories = [];

    for (const item of categoriesData) {
      const category = {
        _id: new ObjectId(),
        name: item.name,
        description: item.description,
        slug: slugify(item.name),
        image:
          item.image ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
        createdAt: now,
        updatedAt: now,
      };

      await db.collection("Category").insertOne(category);
      categories.push(category);
    }

    const products = [
      {
        name: "Aero Wireless Headphones",
        description:
          "Premium noise cancelling headphones with deep bass and 30-hour battery.",
        price: 199.99,
        stock: 40,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
        featured: true,
        categoryId: categories[0]._id,
      },
      {
        name: "Urban Trail Sneakers",
        description:
          "Lightweight, breathable sneakers built for city and trail use.",
        price: 89.5,
        stock: 70,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
        featured: true,
        categoryId: categories[1]._id,
      },
      {
        name: "Minimal Oak Lamp",
        description:
          "Warm ambient lamp with natural oak finish and dimmable LED core.",
        price: 64,
        stock: 25,
        image:
          "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80",
        featured: true,
        categoryId: categories[2]._id,
      },
      {
        name: "Velocity Fitness Watch",
        description:
          "Track workouts, pulse, sleep, and recovery with precision sensors.",
        price: 149,
        stock: 50,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
        featured: true,
        categoryId: categories[3]._id,
      },
    ];

    for (const product of products) {
      await db.collection("Product").insertOne({
        _id: new ObjectId(),
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image,
        featured: product.featured,
        categoryId: product.categoryId,
        slug: slugify(product.name),
        createdAt: now,
        updatedAt: now,
      });
    }

    const adminPassword = await bcrypt.hash("admin", 12);
    const userPassword = await bcrypt.hash("user", 12);

    await db.collection("User").insertOne({
      _id: new ObjectId(),
      name: "Admin User",
      email: "admin@shopbiz.com",
      password: adminPassword,
      role: "ADMIN",
      createdAt: now,
      updatedAt: now,
    });

    await db.collection("User").insertOne({
      _id: new ObjectId(),
      name: "Demo User",
      email: "user@shopbiz.com",
      password: userPassword,
      role: "USER",
      createdAt: now,
      updatedAt: now,
    });

    console.log("Seed complete.");
    console.log("Admin: admin@shopbiz.com / admin");
    console.log("User: user@shopbiz.com / user");
  } finally {
    await client.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
