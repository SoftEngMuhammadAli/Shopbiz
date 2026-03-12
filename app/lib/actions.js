"use server";

import { revalidatePath } from "next/cache";
import connectToDatabase from "../../app/lib/config/db.js";
import User from "../../app/lib/models/user.model.js";
import Product from "../../app/lib/models/product.model.js";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const toPlain = (value) => JSON.parse(JSON.stringify(value));

export async function addUser(formData) {
  const { name, email, password, role, img } = Object.fromEntries(formData);

  if (!password) {
    return {
      success: false,
      message: "Password is required",
    };
  }

  try {
    await connectToDatabase();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      img,
    });

    await newUser.save();
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to create user",
    };
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

export async function getUsers() {
  try {
    await connectToDatabase();

    const users = await User.find({}, "-password")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      users: toPlain(users),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to fetch users",
      users: [],
    };
  }
}

export async function getUserById(id) {
  if (!isValidId(id)) {
    return {
      success: false,
      message: "Invalid user id",
    };
  }

  try {
    await connectToDatabase();

    const user = await User.findById(id, "-password").lean();

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      user: toPlain(user),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to fetch user",
    };
  }
}

export async function deleteUserById(id) {
  if (!isValidId(id)) {
    return {
      success: false,
      message: "Invalid user id",
    };
  }

  try {
    await connectToDatabase();

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to delete user",
    };
  }
}

export async function updateUserById(payload) {
  const { id, name, email, role, img, password } = payload || {};

  if (!isValidId(id)) {
    return {
      success: false,
      message: "Invalid user id",
    };
  }

  if (!name || !email || !role) {
    return {
      success: false,
      message: "Name, email and role are required",
    };
  }

  try {
    await connectToDatabase();

    const updateData = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      role: String(role),
      img: img ? String(img).trim() : "/images/noavatar.png",
    };

    if (password && String(password).trim()) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(String(password), salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);

    if (updatedUser && updatedUser.password) {
      delete updatedUser.password;
    }

    return {
      success: true,
      message: "User updated successfully",
      user: toPlain(updatedUser),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to update user",
    };
  }
}

export async function addProduct(formData) {
  const { name, description, price, imageUrl, category, stock } =
    Object.fromEntries(formData);

  const parsedPrice = Number(price);
  const parsedStock = Number(stock);

  if (!name || !description || !imageUrl || !category) {
    return {
      success: false,
      message: "Name, description, image URL and category are required",
    };
  }

  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    return {
      success: false,
      message: "Price must be a valid non-negative number",
    };
  }

  if (!Number.isInteger(parsedStock) || parsedStock < 0) {
    return {
      success: false,
      message: "Stock must be a valid non-negative integer",
    };
  }

  try {
    await connectToDatabase();

    await Product.create({
      name: String(name).trim(),
      description: String(description).trim(),
      price: parsedPrice,
      imageUrl: String(imageUrl).trim(),
      category: String(category).trim(),
      stock: parsedStock,
    });
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to create product",
    };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function getProducts() {
  try {
    await connectToDatabase();

    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    return {
      success: true,
      products: toPlain(products),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to fetch products",
      products: [],
    };
  }
}

export async function getProductById(id) {
  if (!isValidId(id)) {
    return {
      success: false,
      message: "Invalid product id",
    };
  }

  try {
    await connectToDatabase();

    const product = await Product.findById(id).lean();

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    return {
      success: true,
      product: toPlain(product),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to fetch product",
    };
  }
}

export async function deleteProductById(id) {
  if (!isValidId(id)) {
    return {
      success: false,
      message: "Invalid product id",
    };
  }

  try {
    await connectToDatabase();

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    revalidatePath("/dashboard/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to delete product",
    };
  }
}

export async function updateProductById(payload) {
  const { id, name, description, price, imageUrl, category, stock } =
    payload || {};

  if (!isValidId(id)) {
    return {
      success: false,
      message: "Invalid product id",
    };
  }

  if (!name || !description || !imageUrl || !category) {
    return {
      success: false,
      message: "Name, description, image URL and category are required",
    };
  }

  const parsedPrice = Number(price);
  const parsedStock = Number(stock);

  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    return {
      success: false,
      message: "Price must be a valid non-negative number",
    };
  }

  if (!Number.isInteger(parsedStock) || parsedStock < 0) {
    return {
      success: false,
      message: "Stock must be a valid non-negative integer",
    };
  }

  try {
    await connectToDatabase();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: String(name).trim(),
        description: String(description).trim(),
        price: parsedPrice,
        imageUrl: String(imageUrl).trim(),
        category: String(category).trim(),
        stock: parsedStock,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!updatedProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${id}`);

    return {
      success: true,
      message: "Product updated successfully",
      product: toPlain(updatedProduct),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to update product",
    };
  }
}

export async function deleteUserAction(formData) {
  const id = String(formData.get("id") || "");
  const response = await deleteUserById(id);

  if (!response.success) {
    redirect(
      `/dashboard/users?error=${encodeURIComponent(
        response.message || "Failed to delete user",
      )}`,
    );
  }

  redirect("/dashboard/users");
}

export async function updateUserAction(formData) {
  const id = String(formData.get("id") || "");

  const response = await updateUserById({
    id,
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    role: String(formData.get("role") || ""),
    img: String(formData.get("img") || ""),
    password: String(formData.get("password") || ""),
  });

  if (!response.success) {
    redirect(
      `/dashboard/users/${id}?error=${encodeURIComponent(
        response.message || "Failed to update user",
      )}`,
    );
  }

  redirect(
    `/dashboard/users/${id}?success=${encodeURIComponent(
      "User updated successfully",
    )}`,
  );
}

export async function deleteProductAction(formData) {
  const id = String(formData.get("id") || "");
  const response = await deleteProductById(id);

  if (!response.success) {
    redirect(
      `/dashboard/products?error=${encodeURIComponent(
        response.message || "Failed to delete product",
      )}`,
    );
  }

  redirect("/dashboard/products");
}

export async function updateProductAction(formData) {
  const id = String(formData.get("id") || "");

  const response = await updateProductById({
    id,
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || ""),
    price: Number(formData.get("price")),
    imageUrl: String(formData.get("imageUrl") || ""),
    category: String(formData.get("category") || ""),
    stock: Number(formData.get("stock")),
  });

  if (!response.success) {
    redirect(
      `/dashboard/products/${id}?error=${encodeURIComponent(
        response.message || "Failed to update product",
      )}`,
    );
  }

  redirect(
    `/dashboard/products/${id}?success=${encodeURIComponent(
      "Product updated successfully",
    )}`,
  );
}
