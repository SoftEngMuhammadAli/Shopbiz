const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categoriesData = [
    { name: "Electronics", description: "Smart devices and accessories" },
    { name: "Fashion", description: "Everyday style for all seasons" },
    { name: "Home", description: "Upgrade your living space" },
    { name: "Sports", description: "Performance essentials" },
  ];

  const categories = [];
  for (const item of categoriesData) {
    const category = await prisma.category.create({
      data: {
        ...item,
        slug: slugify(item.name),
        image: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80`,
      },
    });
    categories.push(category);
  }

  const products = [
    {
      name: "Aero Wireless Headphones",
      description: "Premium noise cancelling headphones with deep bass and 30-hour battery.",
      price: 199.99,
      stock: 40,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      categoryId: categories[0].id,
    },
    {
      name: "Urban Trail Sneakers",
      description: "Lightweight, breathable sneakers built for city and trail use.",
      price: 89.5,
      stock: 70,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      categoryId: categories[1].id,
    },
    {
      name: "Minimal Oak Lamp",
      description: "Warm ambient lamp with natural oak finish and dimmable LED core.",
      price: 64,
      stock: 25,
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      categoryId: categories[2].id,
    },
    {
      name: "Velocity Fitness Watch",
      description: "Track workouts, pulse, sleep, and recovery with precision sensors.",
      price: 149,
      stock: 50,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      categoryId: categories[3].id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        slug: slugify(product.name),
      },
    });
  }

  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const userPassword = await bcrypt.hash("User@123", 12);

  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@shopbiz.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Demo User",
      email: "user@shopbiz.com",
      password: userPassword,
      role: "USER",
    },
  });

  console.log("Seed complete.");
  console.log("Admin: admin@shopbiz.com / Admin@123");
  console.log("User: user@shopbiz.com / User@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

