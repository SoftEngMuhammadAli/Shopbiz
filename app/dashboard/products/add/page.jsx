import React from "react";
import styles from "../../../components/dashboard/products/addProduct.module.css";
import { addProduct } from "../../../lib/actions";

const AddProductPage = () => {
  return (
    <div className={styles.container}>
      <h2>Add Product</h2>

      <form className={styles.form} action={addProduct}>
        <input type="text" name="name" placeholder="Product Name" required />
        <input
          type="number"
          name="price"
          placeholder="Price"
          min="0"
          step="0.01"
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          min="0"
          step="1"
          required
        />
        <input type="text" name="category" placeholder="Category" required />
        <input type="text" name="imageUrl" placeholder="Image URL" required />
        <textarea name="description" placeholder="Description" required />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductPage;
