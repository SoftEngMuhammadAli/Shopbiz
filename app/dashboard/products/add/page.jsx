"use client";
import React from "react";
import styles from "../../../components/dashboard/products/addProduct.module.css";

const AddProductPage = () => {
  return (
    <div className={styles.container}>
      <h2>Add Product</h2>

      <form className={styles.form}>
        <input type="text" placeholder="Product Name" />
        <input type="number" placeholder="Price" />
        <input type="number" placeholder="Stock" />
        <input type="text" placeholder="Image URL" />
        <textarea placeholder="Description"></textarea>

        <button>Add Product</button>
      </form>
    </div>
  );
};

export default AddProductPage;
